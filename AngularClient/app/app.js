(function () {
    "use strict";
    var userManagementModule = angular.module("userManagement", ["common.services", "ngCookies"]);
    var formManagementModule = angular.module("formManagement", ["common.services", "ngCookies", "chart.js"]);
    var carManagementModule = angular.module("carManagement", ["common.services", "ngCookies"]);
    var utilityManagementModule = angular.module("utilityManagement", ["common.services", "ngCookies"]);
    var contactManagementModule = angular.module("contactManagement", ["common.services", "ngCookies"]);

    var app = angular.module("app", ["userManagement", "formManagement","carManagement", "utilityManagement", "contactManagement", "ngRoute", "ngclipboard"]);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
     
        $routeProvider.when('/:home', {
            templateURL: 'index.html',
            controller: 'mainController'
        });
    }]);
}());
