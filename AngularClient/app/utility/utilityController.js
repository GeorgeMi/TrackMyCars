(function () {
    "use strict";
    angular
        .module("utilityManagement")
        .controller("UtilityController", ["utilityResource", "$cookies", "$rootScope", UtilityController]);

    //data for utilities


    function UtilityController(utilityResource, $cookies, $rootScope) {
        var vm = this;
        $rootScope.isLoading = true;//loading gif
        var param;

        vm.utility =  {
            UtilityName: '',
            KmNo: '',
            MonthsNo: '',
            Description: ''
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

        this.initialize = function (id) {
            param = { ut_id: id };

            utilityResource.getUtility.getUtility(param,
            function (response) {
                vm.utility = response.data[0];

                $rootScope.isLoading = false;
                vm.message = null;
            },
            function (error) {
                vm.message = error.data.message;
                $rootScope.isLoading = false; //loading gif
            }
        );
        }
       
        vm.addUtility = function () {
            if (vm.utility.UtilityName != '' && vm.utility.KmNo != '' && vm.utility.KmNo != '' && vm.utility.MonthsNo != '' && vm.utility.Description != '' && vm.utility.MonthsNo > -1 && vm.utility.KmNo > -1) {
                vm.utility.UtilityName = vm.utility.UtilityName.replace(/ /g, '');
                vm.utility.Description = vm.utility.Description.replace(/ /g, '');

                if (isNaN(vm.utility.MonthsNo)) {
                    vm.utility.KmNo = vm.utility.KmNo.trim();
                }

                if (isNaN(vm.utility.MonthsNo)) {
                    vm.utility.year = vm.utility.year.trim();
                }
            }
            
            if (vm.utility.UtilityName != '' && vm.utility.KmNo != '' && vm.utility.KmNo != '' && vm.utility.MonthsNo != '' && vm.utility.Description != '' && vm.utility.MonthsNo > -1 && vm.utility.KmNo > -1) {
                $rootScope.isLoading = true;
                utilityResource.add.addUtility(vm.utility,
                    function(response) {

                        utilityResource.get.getUtilities(
                            function(response) {
                                vm.utility.UtilityName = '';
                                vm.utility.KmNo = '';
                                vm.utility.MonthsNo = '';
                                vm.utility.Description = '';
                                vm.utilities = response.data;
                                $rootScope.isLoading = false;
                            },
                            function(error) {
                                vm.message = error.data.message;
                                $rootScope.isLoading = false; //loading gif
                            });
                    },
                    function(error) {
                        vm.message = error.data.message;
                        $rootScope.isLoading = false; //loading gif
                    });
            }
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

        //<-----------------update car----------------------> 
        vm.updateUtility = function () {

            if (vm.utility.UtilityName != '' && vm.utility.KmNo != '' && vm.utility.KmNo != '' && vm.utility.MonthsNo != '' && vm.utility.Description != '' && vm.utility.MonthsNo > -1 && vm.utility.KmNo > -1) {
                vm.utility.UtilityName = vm.utility.UtilityName.replace(/ /g, '');
                vm.utility.Description = vm.utility.Description.replace(/ /g, '');

                if (isNaN(vm.utility.MonthsNo)) {
                    vm.utility.KmNo = vm.utility.KmNo.trim();
                }

                if (isNaN(vm.utility.MonthsNo)) {
                    vm.utility.year = vm.utility.year.trim();
                }
            }
            
            if (vm.utility.UtilityName != '' && vm.utility.KmNo != '' && vm.utility.KmNo != '' && vm.utility.MonthsNo != '' && vm.utility.Description != '' && vm.utility.MonthsNo > -1 && vm.utility.KmNo > -1) {
                $rootScope.isLoading = true;
                utilityResource.update.updateUtility(vm.utility,
                    function(response) {

                        vm.messageForm = response.message;
                        vm.created = response.status;
                    },
                    function(error) {
                        vm.created = response.status;
                        vm.message = error.data.message;
                        $rootScope.isLoading = false;
                    });
            }                         
        }

        vm.reset = function() {
            utilityResource.get.getUtilities(
                function(response) {
                    vm.utilities = response.data;
                    $rootScope.isLoading = false; //loading gif
                    vm.message = null;
                },
                function(error) {
                    vm.message = error.data.message;
                    vm.Next = false;
                    $rootScope.isLoading = false; //loading gif               
                }
            );
        }
    }
}());
