var Thread = require("../../game.components/thread"), 
	RenderLoop = require("./renderloop"),
	gameSettings = require("../../../settings"),
	setControls = require("./controls"),
	setBases = require("./setBases"),
	MakeMoveHandler = require("../builders/moveHandler"),
	Crawlers = require("../../../app/play/editor/crawlersFactory");
	
"use strict";

var view, handleMove;

function initGlobals (s, game) {
	view = s;
	handleMove = MakeMoveHandler({
		queue: s.graph.queueNodes,
		nodes: s.graph.nodes,
		opponent: game.opponent,
		role: game.role
	});
}

function Interface (game, playerData) {
	this.role = game.role; //"host or client"
	setBases(game, playerData);
	initGlobals(new sigma(
		{
			graph: game.board,
			renderers: [{
				container: document.getElementById("container"),
				type: "gameSvg",
				settings: {
					enableHovering: true
				}
			}],
			settings: {
				drawLabels: false,
				host: game.role === "host" ? playerData.playerColor : playerData.opponentColor,
				client: game.role === "client" ? playerData.playerColor : playerData.opponentColor,
				player: game.role,
				width: game.board.width,
				height: game.board.height,
				defaultNodeColor: gameSettings.default,
				defaultEdgeColor: gameSettings.default
			}
		}
	), game);
	
	//need to fix vvv
	var loop = new RenderLoop(view); // fix this to only render when a node is inserted
	view.graph.bases = game.board.bases;
	view.graph.color = this.playerColor;
	this.initThreads(game.board, handleMove);
	// var clickANode = function (func, event) {
	// 	if(this.state === 'attackNode'){
	// 		this[this.currentThread].crawl(event.data.node.id, {
	// 			start: function(id){
	// 				this.attackNode(self.source, id);
	// 			},
	// 			receiveLinks: function(node){
	// 				self.source = node.id;
	// 			}
	// 		});
	// 	}else if(this.state === 'reinforceNode'){
	// 		this[this.currentThread].crawl(event.data.node.id, {
	// 			start: function(id){
	// 				this.reinforceNode(id);
	// 			}
	// 		});
	// 	}else if(this.state === 'moveBase'){
	// 		this[this.currentThread].moveBase(event.data.node.id);
	// 		view.refresh({skipIndexation: true});
	// 	}else if(this.state === 'selectSrc'){
	// 		this.source = event.data.node.id;
	// 		console.log('selected a new source');
	// 	}
	// };
	view.bind("clickNode", (function(event) {
		this.thread1.crawl(event.data.node.id, Crawlers.getCrawler("test"));
	}).bind(this));
	view.bind("overNode", (event) => {if(event.data.node) console.log(event.data.node.health);})
	// view.bind("clickNode", clickANode.bind(this, this.claim.bind(this)));
	//need to fix ^^^
	view.refresh();
	setControls(this);
}

Interface.prototype.initThreads = function (board, handler) {
	this.currentThread = 'thread1';
	this.state = 'attackNode';
	this.source = board.bases[this.role].id;
	this.threads = gameSettings.numThreads;
	for(var i = 1; i <= this.threads; i++){
		var threadNumber = "thread" + i;
		this[threadNumber] = new Thread(handler)
	}
};

Interface.prototype.updateBoard = function (data) {
	handleMove.execute(data);
};

module.exports = Interface;
