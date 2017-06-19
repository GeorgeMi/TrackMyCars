(function () {
    "use strict";
    angular
        .module("common.services")
        .factory("carResource", ["$resource", "appSettings", "$cookies", carResource])

    function carResource($resource, appSettings, $cookies) {
        return {
            //all forms
            get: $resource(appSettings.serverPath + "/api/form?state=:state&page=:page_nr&per_page=:per_page", { state: '@id', page_nr: '@id', per_page: '@id' },
                      {
                          'getForms': {
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
            //specific form
            getCar: $resource(appSettings.serverPath + "/api/form/getform/:form_id", { form_id: '@id' },
                     {
                         'getForm': {
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
            //add form
            add: $resource(appSettings.serverPath + "/api/form", null,
               {
                   'addForm': {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json', 'token': $cookies.get('token') }
                   }

               }),
            //send form with vote
            vote: $resource(appSettings.serverPath + "/api/vote", null,
              {
                  'voteForm': {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'token': $cookies.get('token') }
                  }

              }),
            //all forms from user
            getForms: $resource(appSettings.serverPath + "/api/form/user/" + $cookies.get('username') + "?state=:state&page=:page_nr&per_page=:per_page", { state: '@id', page_nr: '@id', per_page: '@id' },
                      {
                          'getForms': {
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
            //delete form
            delete: $resource(appSettings.serverPath + "/api/form/:form_id", { form_id: '@id' },
               {
                   'deleteForm': {
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