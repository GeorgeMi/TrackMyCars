﻿(function () {
    "use strict";
    angular
        .module("utilityManagement")
        .controller("UtilityController", ["utilityResource", "$cookies", "$rootScope", UtilityController]);

    //data for utilities


    function UtilityController(utilityResource, $cookies, $rootScope) {
        var vm = this;
        $rootScope.isLoading = true;//loading gif
        
        vm.utility =  {
            name: ''
        };
       
        utilityResource.get.getUtilities(
            function (response) {
                vm.utilities = response.data;
            
            $rootScope.isLoading = false;
            },
            function (error) {
                vm.message = error.data.message;
                $rootScope.isLoading = false; //loading gif
            }
        );
       
        vm.addUtility = function () {
            $rootScope.isLoading = true;

            utilityResource.add.addUtility(vm.utility,
                function (response) {

                    utilityResource.get.getUtilities(
                    function (response) {
                        vm.utility.name = '';
                        vm.utilities = response.data;
                        $rootScope.isLoading = false;
                    },
                    function (error) {
                        vm.message = error.data.message;
                        $rootScope.isLoading = false; //loading gif
                    });
            },
             function (error) {
                 vm.message = error.data.message;
                 $rootScope.isLoading = false; //loading gif
             });
        }

        vm.deleteUtility = function (utilityID) {
            var r = confirm("Are you sure that you want to permanently delete this utility?");

            if (r == true) {
                $rootScope.isLoading = true;
                var param = { cat_id: utilityID };
                var i;
                utilityResource.delete.deleteUtility(param,
                    function (response) {

                        /*  utilityResource.get.getUtilities(function (data) {
                              vm.utilities = data;
                          });*/
                        for (i = 0; i < vm.utilities.length ; i++) {

                            if (vm.utilities[i].UtilityID === utilityID) {
                                vm.utilities.splice(i, 1);
                            }
                        }
                        $rootScope.isLoading = false;
                    },
                function (error) {
                    vm.message = error.data.message;
                    $rootScope.isLoading = false; //loading gif
                });
            }
        }

        vm.viewUtilityForms = function (id) {
            //alert("cookie");
            $cookies.put('utility_id', id);
            return 'utility_forms';
        }
    }
}());