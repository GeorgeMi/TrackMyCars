(function () {
    "use strict";
    angular
        .module("categoryManagement")
        .controller("CategoryController", ["categoryResource", "$cookies","$rootScope", CategoryController]);

    //data for categories


    function CategoryController(categoryResource, $cookies, $rootScope) {
        var vm = this;
        $rootScope.isLoading = true;//loading gif
        
        vm.category =  {
            name: ''
        };
       
        categoryResource.get.getCategories(
            function (response) {
                vm.categories = response.data;
            
            $rootScope.isLoading = false;
            },
            function (error) {
                vm.message = error.data.message;
                $rootScope.isLoading = false; //loading gif
            }
        );
       
        vm.addCategory = function () {
            $rootScope.isLoading = true;

            categoryResource.add.addCategory(vm.category,
                function (response) {

                categoryResource.get.getCategories(
                    function (response) {
                        vm.category.name = '';
                        vm.categories = response.data;
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

        vm.deleteCategory = function (categoryID) {
            var r = confirm("Are you sure that you want to permanently delete this category?");

            if (r == true) {
                $rootScope.isLoading = true;
                var param = { cat_id: categoryID };
                var i;
                categoryResource.delete.deleteCategory(param,
                    function (response) {

                        /*  categoryResource.get.getCategories(function (data) {
                              vm.categories = data;
                          });*/
                        for (i = 0; i < vm.categories.length ; i++) {

                            if (vm.categories[i].CategoryID === categoryID) {
                                vm.categories.splice(i, 1);
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

        vm.viewCategoryForms = function (id) {
            //alert("cookie");
            $cookies.put('category_id', id);
            return 'category_forms';
        }
    }
}());
