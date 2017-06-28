(function () {
    "use strict";
    angular
        .module("common.services")
        .factory("carResource", ["$resource", "appSettings", "$cookies", carResource])

    function carResource($resource, appSettings, $cookies) {
        return {
            //all cars
            get: $resource(appSettings.serverPath + "/api/car",null,
                      {
                          'getCars': {
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

            //all user cars
            getUserCars: $resource(appSettings.serverPath + "/api/car/usercars/:username", { username: '@id' },
                      {
                          'getUserCars': {
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
            //specific car
            getCar: $resource(appSettings.serverPath + "/api/car/getcar/:car_id", { car_id: '@id' },
                     {
                         'getCar': {
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
            //add car
            add: $resource(appSettings.serverPath + "/api/car", null,
               {
                   'sendCarDetails': {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json', 'token': $cookies.get('token') }
                   }

               }),

            //update car
            update: $resource(appSettings.serverPath + "/api/car", null,
               {
                   'updateCarDetails': {
                       method: 'PUT',
                       headers: { 'Content-Type': 'application/json', 'token': $cookies.get('token') }
                   }

               }),

            //delete car
            delete: $resource(appSettings.serverPath + "/api/car/:car_id", { car_id: '@id' },
               {
                   'deleteCar': {
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
               }),

            //search forms
            search: $resource(appSettings.serverPath + "/api/search/:searchedText?state=:state&page=:page_nr&per_page=:per_page", { state: '@id', searchedText: '@id', page_nr: '@id', per_page: '@id' },
                      {
                          'searchForms': {
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
                      })
        }
    }

}());