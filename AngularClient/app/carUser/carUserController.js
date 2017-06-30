(function () {
    "use strict";
    angular
        .module("carManagement")
        .controller("CarUserController", ["carResource", "$cookies", "$rootScope", CarUserController]);

    function CarUserController(carResource, $cookies, $rootScope) {
        var vm = this;

        $rootScope.isLoading = true; //loading gif

        var param = { username: $cookies.get('username') };
        //<-----------------load page----------------------> 
        carResource.getUserCars.getUserCars(param,
            function(response) {

                vm.userCars = response.data;
                $rootScope.isLoading = false;

                if (vm.userCars.length < vm.per_page) {
                    vm.Next = false;
                } else {
                    vm.Next = true;
                }

            },
            function(error) {
                vm.message = error.data.message;
                vm.Next = false;
                $rootScope.isLoading = false; //loading gif
            }
        );

        vm.reload = function () {
            carResource.getUserCars.getUserCars(param,
            function (response) {

                vm.userCars = response.data;
                $rootScope.isLoading = false;

                if (vm.userCars.length < vm.per_page) {
                    vm.Next = false;
                } else {
                    vm.Next = true;
                }

            },
            function (error) {
                vm.message = error.data.message;
                vm.Next = false;
                $rootScope.isLoading = false; //loading gif
            }
        );
        }
    }
}());
