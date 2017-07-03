(function () {
    "use strict";
    angular
        .module("utilityManagement")
        .controller("UtilityDetailsController", ["utilityResource", "$cookies", "$rootScope", UtilityDetailsController]);

    //data for utilities


    function UtilityDetailsController(utilityResource, $cookies, $rootScope)
    {
        var vm = this;

        this.initialize = function (id) {

            var param = { car_id: id };

            utilityResource.getCarUtilities.getCarUtilities(param,
                function (response) {
                    vm.utilities = response.data;
                },
                function (error) {
                    vm.message = error.data.message;
                }
            );
        }

    }

}());
