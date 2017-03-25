var Crawlers = require("./editor/crawlersFactory");
var controls = require("../../game/game.logic/initialization/controls");
var local = require("./local");

var playController = function($scope) {
  if (Crawlers.crawlers.length === 1) {
    local.getCrawlers();
  }

  $scope.crawlers = Crawlers.crawlers;

  $scope.setCrawler = function(num) {
    controls.setCrawler(num);
  };

  $scope.setThread = function(num) {
    controls.setThread(num);
  };

  $scope.stopThread = function() {
    controls.stop();
  };
};

playController.$inject = ["$scope"];

module.exports = playController;
