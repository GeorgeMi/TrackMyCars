(function () {
    "use strict";
    var userManagementModule = angular.module("userManagement", ["common.services", "ngCookies"]);
    var carManagementModule = angular.module("carManagement", ["common.services", "ngCookies"]);
    var utilityManagementModule = angular.module("utilityManagement", ["common.services", "ngCookies"]);
    var contactManagementModule = angular.module("contactManagement", ["common.services", "ngCookies"]);

    var app = angular.module("app", ["userManagement","carManagement", "utilityManagement", "contactManagement", "ngRoute", "ngclipboard"]);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
     
        $routeProvider.when('/:home', {
            templateURL: 'index.html',
            controller: 'mainController'
        });
    }]);
}());
