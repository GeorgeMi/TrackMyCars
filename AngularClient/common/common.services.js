(function () {
    "use strict";
    angular
        .module("common.services", ["ngResource"])
        .constant("appSettings",
        {
             serverPath: "https://trackmycarswebapi.azurewebsites.net/"
             //serverPath: "http://localhost:19692"
        });

}());