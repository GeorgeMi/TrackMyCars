(function () {
    "use strict";
    angular
        .module("common.services")
        .factory("contactResource", ["$resource", "appSettings", "$cookies", contactResource])

    function contactResource($resource, appSettings, $cookies) {
        return {
            //send message 
            send: $resource(appSettings.serverPath + "/api/contact", null,
               {
                   'sendMessage': {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json', 'token': $cookies.get('token') }
                   }

               })
        }
    }

}());