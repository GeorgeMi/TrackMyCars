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
            UtilitiesIDs: [{}]
        };
        vm.addCarMessage = '';

        vm.checkbox = function (utilityId) {
            // alert(utilityId);
            if (vm.updateCar.UtilitiesIDs != undefined) {
                if (vm.updateCar.UtilitiesIDs.indexOf(utilityId) > -1) {
                    vm.updateCar.UtilitiesIDs.splice(vm.updateCar.UtilitiesIDs.indexOf(utilityId), 1);
                } else {
                    vm.updateCar.UtilitiesIDs.push(utilityId);
                }
            } else if (vm.updateCar.UtilitiesIDs == undefined) {
                vm.updateCar.UtilitiesIDs = [{}];
                vm.updateCar.UtilitiesIDs.push(utilityId);
            }

            vm.updateCar.UtilitiesIDs = vm.updateCar.UtilitiesIDs.filter(function (n) { return n != undefined });
        }

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
        
       //<-----------------update car----------------------> 
        vm.updateCarDetails = function () {
           
            if (vm.updateCar.regNo != '' && vm.updateCar.brand != '' && vm.updateCar.year != '' && vm.updateCar.kmNo != '' && vm.updateCar.kmNo >= 0) {
                vm.updateCar.brand = vm.updateCar.brand.trim();
            }

            if (vm.updateCar.brand != '') {
                //alert('haha2');
                $rootScope.isLoading = true;

                var x = JSON.stringify(vm.updateCar);

                carResource.update.updateCarDetails(x,
                    function (response) {

                        carResource.get.getCars(
                            function (response) {
                                $rootScope.isLoading = false;                              
                            },
                            function (error) {
                                vm.created = response.status;
                                vm.message = error.data.message;
                                $rootScope.isLoading = false; //loading gif
                            });

                        vm.messageForm = response.message;
                        vm.created = response.status;
                    },
                    function (error) {
                        vm.created = response.status;
                        vm.message = error.data.message;
                        $rootScope.isLoading = false; //loading gif
                    });
            }
        }

        vm.verifyUtilityId = function (id) {
            if (vm.updateCar.UtilitiesIDs.indexOf(id) > -1) {
                return true;
            }
            return false;
        }

        vm.verifyDriverId = function (id) {
            if (id == 0 && vm.updateCar.DriverID == null) {
                return true;
            }
            else if (id != 0 && vm.updateCar.DriverID == id) {
                return true;
            }           
            return false;
        }
    }
}());
