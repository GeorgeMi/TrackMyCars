(function () {
    "use strict";
    angular
        .module("common.services", ["ngResource"])
        .constant("appSettings",
        {
             serverPath: "http://trackmycarswebapi.azurewebsites.net/"
            // serverPath: "http://localhost:19692"
        });

}());