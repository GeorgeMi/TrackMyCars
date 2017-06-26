(function () {
    "use strict";
    angular
        .module("carManagement")
        .controller("CarController", ["carResource", "$cookies", "$rootScope", "$window", CarController]);

    function CarController(carResource, $cookies, $rootScope, $window) {
        var vm = this;

        vm.created = false;
        vm.page_nr = 0; //numarul paginii
        vm.per_page = 10; //numarul de elemente de pe pagina
        vm.state = 'open'; //open, closed, all
        vm.Prev = false; // se afiseaza "prev page" la paginare
        vm.Next = true; // se afiseaza "next page" la paginare
        vm.message = null;
        $rootScope.isLoading = true; //loading gif

        //data form to send
        vm.addCar = {
            regNo: '',
            brand: '',
            year: '',
            kmNo: '',
            driverId: ''
        };

        vm.addCarMessage = '';
        //max vals
        vm.maxQuestionCount = 20;
        vm.maxAnswerCount = 6;

        //<-----------------load page----------------------> 
        carResource.get.getCars(
            function (response) {
                vm.cars = response.data;
                $rootScope.isLoading = false; //loading gif
                vm.message = null;

                if (vm.cars.length < vm.per_page) {
                    vm.Next = false;
                }
                else {
                    vm.Next = true;
                }

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
        vm.sendCarDetails = function () {
            if (vm.addCar.regNo != '' && vm.addCar.brand != '' && vm.addCar.year != '' && vm.addCar.kmNo != '' && vm.addCar.kmNo >= 0) {
                vm.addCar.brand = vm.addCar.brand.trim();
            }

            if (vm.addCar.regNo != '' && vm.addCar.brand != '' && vm.addCar.year != '' && vm.addCar.kmNo != '' && vm.addCar.kmNo >= 0) {
                $rootScope.isLoading = true;
                carResource.add.sendCarDetails(vm.addCar,
                    function (response) {

                        carResource.get.getCars(
                            function (response) {
                                vm.addCar.regNo = '';
                                vm.addCar.brand = '';
                                vm.addCar.year = '';
                                vm.addCar.kmNo = '';
                                vm.addCar.driverId = '';
                                vm.cars = response.data;
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

        //<-----------------delete car----------------------> 
        vm.deleteCar = function (carID) {
            var r = confirm("Are you sure that you want to permanently delete this car?");

            if (r == true) {
                $rootScope.isLoading = true;
                var param = { car_id: carID };
                var i;
                carResource.delete.deleteCar(param,
                    function (response) {

                        for (i = 0; i < vm.cars.length ; i++) {

                            if (vm.cars[i].CarID === carID) {
                                vm.cars.splice(i, 1);
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

        //<-----------------update car----------------------> 
        vm.updateCar = function (id) {
            
            $cookies.remove('update_car');
            $cookies.put('update_car', id);
            return 'update_cars';
        }

        //<-----------------change items per page----------------------> 
        vm.itemsPerPage = vm.per_page;
        vm.chosePerPage = function () {
            //schimba numarul de elemente de pe pagina

            if (vm.itemsPerPage != vm.per_page) {

                $rootScope.isLoading = true;
                vm.per_page = vm.itemsPerPage;
                vm.page_nr = 0;
                var param = { page_nr: 0, per_page: vm.itemsPerPage, state: vm.state };
                carResource.get.getCars(param,

                    function (response) {
                        vm.cars = response.data;
                        $rootScope.isLoading = false; //loading gif
                        vm.message = null;

                       },

                    function (error) {
                        vm.message = error.data.message;
                        vm.Next = false;
                        $rootScope.isLoading = false; //loading gif
                    });

            }
        }
        //<-----------------change page----------------------> 
        vm.chosePageNr = function (id) {
            //schimba numarul paginii
            $rootScope.isLoading = true;
            vm.page_nr = id;
            var param = { state: vm.state, page_nr: id, per_page: vm.itemsPerPage };

            if (vm.page_nr <= 0) {
                vm.Prev = false;
            }
            else {
                vm.Prev = true;
            }

            carResource.get.getCars(param,

               function (response) {
                   vm.cars = response.data;
                   $rootScope.isLoading = false; //loading gif
                   vm.message = null;

                   if (vm.cars.length < vm.per_page) {
                       vm.Next = false;
                   }
                   else {
                       vm.Next = true;
                   }

                   if (vm.page_nr <= 0) {
                       vm.Prev = false;
                   }
                   else {
                       vm.Prev = true;
                   }

               },

               function (error) {
                   vm.message = error.data.message;
                   vm.Next = false;
                   $rootScope.isLoading = false; //loading gif
               });
        }
    }
}());
