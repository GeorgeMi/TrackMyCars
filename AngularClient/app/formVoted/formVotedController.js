(function () {
    "use strict";
    angular
        .module("formManagement")
        .controller("FormVotedController", ["formResource", "$cookies", "$rootScope", FormVotedController]);

    function FormVotedController(formResource, $cookies, $rootScope) {
        var vm = this;
        vm.page_nr = 0; //numarul paginii
        vm.per_page = 5; //numarul de elemente de pe pagina
        vm.Prev = false; // se afiseaza "prev page" la paginare
        vm.Next = true; // se afiseaza "next page" la paginare
        vm.state = 'open'; //open, closed, all
        $rootScope.isLoading = true;
        vm.message = null;

        var param = {state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };

        formResource.getVotedForms.getVotedForms(param,
            function (response) {
                vm.forms = response.data;
                vm.message = null;

                if (vm.forms.length < vm.per_page) {
                    vm.Next = false;
                }
                else {
                    vm.Next = true;
                }
                $rootScope.isLoading = false

            },
         function (error) {
             vm.message = error.data.message;
             vm.Next = false;
             $rootScope.isLoading = false; //loading gif
         });

        vm.viewResults = function (id) {
            //alert("cookie");
            $cookies.put('my_poll_result', id);
            return 'my_poll_result';
        }


        vm.itemsPerPage = vm.per_page;
        vm.chosePerPage = function () {
            //schimba numarul de elemente de pe pagina

            if (vm.itemsPerPage != vm.per_page) {

                $rootScope.isLoading = true;
                vm.per_page = vm.itemsPerPage;
                vm.page_nr = 0;
                var param = { state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };

                formResource.getVotedForms.getVotedForms(param,

                    function (response) {
                        vm.forms = response.data;
                        vm.message = null;
                        $rootScope.isLoading = false;

                        if (vm.forms.length < vm.per_page) {
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

        vm.chosePageNr = function (id) {
            //schimba numarul paginii
            $rootScope.isLoading = true;

            vm.page_nr = id;
            var param = { state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };

            if (vm.page_nr <= 0) {
                vm.Prev = false;
            }
            else {
                vm.Prev = true;
            }


            formResource.getVotedForms.getVotedForms(param,
                function (response) {
                vm.message = null;
                vm.forms = response.data;
                $rootScope.isLoading = false;

                if (vm.forms.length < vm.per_page) {
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

        //<-----------------change state----------------------> 
        vm.itemsState = vm.state;
        vm.changeState = function () {
            //schimba numarul de elemente de pe pagina
            if (vm.itemsState != vm.state) {

                $rootScope.isLoading = true;
                vm.state = vm.itemsState;
                var param = { state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };
                formResource.getVotedForms.getVotedForms(param,

                    function (response) {
                        vm.forms = response.data;
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


    }

}());
