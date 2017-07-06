(function () {
    "use strict";
    angular
        .module("carManagement")
        .controller("CarUserController", ["carResource", "$cookies", "$rootScope", "desktopNotification", CarUserController]);

    function CarUserController(carResource, $cookies, $rootScope, desktopNotification) {
        var vm = this;

        $rootScope.isLoading = true; //loading gif

        desktopNotification.requestPermission();

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

        vm.userIsSecretariat = function () {
            var username = $cookies.get('username');
            
            if (username === 'George') {
                return true;
            } else {
                return false;
            }
        }

        vm.refresh = function () {
            setTimeout(function () {
                vm.reload();
            }, 24 * 3600 * 1000); // 1 day 
        }

        vm.checkWarnings = function (days, km) {
            if (days < 20 && km < 200) {
                $('#myModal').modal('show');

                desktopNotification.show('Warning', {
                    body: 'One of the utilities is about to expire or has expired!',
                    autoClose: false
                });
            }
        }
    }
}());
