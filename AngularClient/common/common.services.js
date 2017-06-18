(function () {
    "use strict";
    angular
        .module("common.services", ["ngResource"])
        .constant("appSettings",
        {
            // serverPath: "http://pollwebapi.azurewebsites.net"
             serverPath: "http://localhost:19692"
        });

}());