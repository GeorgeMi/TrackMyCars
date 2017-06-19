(function () {
    "use strict";
    angular
        .module("common.services")
        .factory("utilityResource", ["$resource", "appSettings", "$cookies", utilityResource])

    function utilityResource($resource, appSettings, $cookies) {
        return {
            get: $resource(appSettings.serverPath + "/api/utility", null,
                      {
                          'getUtilities': {
                              method: 'GET',
                              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': $cookies.get('token') },
                              transformRequest: function (data, headersGetter) {
                                  var str = [];
                                  for (var d in data) {
                                      str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                                  }
                                  return str.join("&");
                              }
                          }
                      }),

            add: $resource(appSettings.serverPath + "/api/utility", null,
               {
                   'addUtility': {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': $cookies.get('token') },
                       transformRequest: function (data, headersGetter) {
                           var str = [];
                           for (var d in data) {
                               str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                           }
                           return str.join("&");
                       }
                   }
               }),
            delete: $resource(appSettings.serverPath + "/api/utility/:cat_id", { cat_id: '@id' },
               {
                   'deleteUtility': {
                       method: 'DELETE',
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': $cookies.get('token') },
                       transformRequest: function (data, headersGetter) {
                           var str = [];
                           for (var d in data) {
                               str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                           }
                           return str.join("&");
                       }
                   }
               })
        }
    }

}());