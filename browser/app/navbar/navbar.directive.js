define([], function () {
    var navbar = {name: "navbar"};
    navbar.func = function () {
        return {
            restrict: 'E',
            templateUrl: '/app/navbar/navbar.html',
            link: function(scope) {
                scope.categories = [{
                    label: 'Play Game',
                    state: 'play'
                }, {
                    label: 'Signup',
                    state: 'signup'
                }, {
                    label: 'Login',
                    state: 'login'
                }]
            }
        };
    };

    return navbar;
});