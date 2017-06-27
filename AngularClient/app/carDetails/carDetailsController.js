(function () {
    "use strict";
    angular
        .module("carManagement")
        .controller("CarDetailsController", ["carResource", "$cookies", "$rootScope", "$window", CarDetailsController]);

    function CarDetailsController(carResource, $cookies, $rootScope, $window) {
        var vm = this;

        var param = { car_id: $cookies.get('update_car') };

        vm.message = null;
        $rootScope.isLoading = true; //loading gif

        vm.updateCar = {
            RegNo: '',
            Brand: '',
            Year: '',
            KmNo: '',
            DriverID: 0,
            UtilitiesIDs: []
        };
        vm.addCarMessage = '';

        //<-----------------load page----------------------> 
        carResource.getCar.getCar(param,
            function (response) {
                vm.updateCar = response.data[0];
                
                $rootScope.isLoading = false; //loading gif
                vm.message = null;
            },

            function (error) {
                vm.message = error.data.message;
                vm.Next = false;
                $rootScope.isLoading = false; //loading gif
                if (vm.message == "Invalid Authorization Key") {
                    $window.location.reload();
                }
            }
        );

        //<-----------------add car----------------------> 
        vm.updateCarDetails = function () {
           
            if (vm.updateCar.regNo != '' && vm.updateCar.brand != '' && vm.updateCar.year != '' && vm.updateCar.kmNo != '' && vm.updateCar.kmNo >= 0) {
                vm.updateCar.brand = vm.updateCar.brand.trim();
            }
            if (vm.updateCar.brand != '') {
                //alert('haha2');
                $rootScope.isLoading = true;
                carResource.update.updateCarDetails(vm.updateCar,
                    function (response) {

                        carResource.get.getCars(
                            function (response) {
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
        }

        vm.checkbox = function (utilityId) {
            // alert(utilityId);
            if (vm.updateCar.UtilitiesIDs != undefined) {
                if (vm.updateCar.UtilitiesIDs.indexOf(utilityId) > -1) {
                    vm.updateCar.UtilitiesIDs.splice(vm.updateCar.UtilitiesIDs.indexOf(utilityId), 1);
                } else {
                    vm.updateCar.UtilitiesIDs.push(utilityId);
                }
            } else {
                vm.updateCar.UtilitiesIDs = new Array(utilityId);
                vm.updateCar.UtilitiesIDs.push(utilityId);
            }

            vm.updateCar.UtilitiesIDs = vm.updateCar.UtilitiesIDs.filter(function (n) { return n != undefined });
        }
    }
}());
