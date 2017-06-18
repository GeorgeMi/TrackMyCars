(function () {
    "use strict";
    angular
        .module("formManagement")
        .controller("FormCategoryController", ["formResource", "$cookies", "$rootScope", FormCategoryController]);


    function FormCategoryController(formResource, $cookies, $rootScope) {
        var vm = this;

        vm.page_nr = 0; //numarul paginii
        vm.per_page = 5; //numarul de elemente de pe pagina
        vm.Prev = false; // se afiseaza "prev page" la paginare
        vm.Next = true; // se afiseaza "next page" la paginare
        vm.state = 'open'; //open, closed, all
        $rootScope.isLoading = true; //loading gif

        var param = { category_id: $cookies.get('category_id'),state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };

        formResource.getCategoryForms.getCategoryForms(param,
            function (response) {
                vm.forms = response.data;
                vm.message = null;

                if (vm.forms.length < vm.per_page) {
                    vm.Next = false;
                }
                else {
                    vm.Next = true;
                }
                $rootScope.isLoading = false;
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

        vm.deleteForm = function (formID) {
            var r = confirm("Are you sure that you want to permanently delete this form?");
            if (r == true) {
                $rootScope.isLoading = true;

                var param = { form_id: formID };
                var i;
                // alert(formID);

                formResource.delete.deleteForm(param,
                    function (response) {
                        vm.message = null;
                        for (i = 0; i < vm.forms.length ; i++) {

                            if (vm.forms[i].Id === formID) {
                                vm.forms.splice(i, 1);
                            }
                        }
                        if (vm.forms.length < vm.per_page) {
                            vm.Next = false;
                        }
                        else {
                            vm.Next = true;
                        }
                        $rootScope.isLoading = false;
                    },
                
                function (error) {
                    vm.message = error.data.message;
                    vm.Next = false;
                    $rootScope.isLoading = false; //loading gif
                });
            }
        }

        vm.itemsPerPage = vm.per_page;
        vm.chosePerPage = function () {
            //schimba numarul de elemente de pe pagina

            if (vm.itemsPerPage != vm.per_page) {

                $rootScope.isLoading = true;
                vm.per_page = vm.itemsPerPage;
                vm.page_nr = 0;
                var param = { category_id: $cookies.get('category_id'), state:vm.state, page_nr: vm.page_nr, per_page: vm.per_page };

                formResource.getCategoryForms.getCategoryForms(param,
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
            var param = { category_id: $cookies.get('category_id'), state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };

            if (vm.page_nr <= 0) {
                vm.Prev = false;
            }
            else {
                vm.Prev = true;
            }


            formResource.getCategoryForms.getCategoryForms(param,
                function (response) {
                    vm.forms = response.data;
                $rootScope.isLoading = false;
                vm.message = null;

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
                param = { category_id: $cookies.get('category_id'), state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };

                formResource.getCategoryForms.getCategoryForms(param,

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
