(function () {
    "use strict";
    angular
        .module("userManagement")
        .controller("UserController", ["userResource","$cookies", "$rootScope", UserController]);

    function UserController(userResource,$cookies, $rootScope) {
        var vm = this;

        vm.page_nr = 0; //numarul paginii
        vm.per_page = 10; //numarul de elemente de pe pagina
        vm.Prev = false; // se afiseaza "prev page" la paginare
        vm.Next = true; // se afiseaza "next page" la paginare
        $rootScope.isLoading = true;
        var param = { page_nr: vm.page_nr, per_page: vm.per_page };
       
        userResource.get.getUsers(param,
            function (response) {
                vm.users = response.data;
                vm.message = null;

            if (vm.users.length < vm.per_page) {
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

        vm.deleteUser = function (userID) {
            var r = confirm("Are you sure that you want to permanently delete this user?");

            if (r == true) {
                $rootScope.isLoading = true;
                var param = { user_id: userID };
                var i;

                userResource.delete.deleteUser(param,
                    function (response) {
                        vm.message = null;
                        for (i = 0; i < vm.users.length ; i++) {

                            if (vm.users[i].UserID === userID) {
                                vm.users.splice(i, 1);
                            }
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

        vm.promote = function (userID) {
            $rootScope.isLoading = true;
            var param = { user_id: userID };
            var i;

            userResource.promote.promoteUser(param,
                function (response) {
                    vm.message = null;
                    for (i = 0; i < vm.users.length ; i++) {

                        if (vm.users[i].UserID === userID) {
                            vm.users[i].Role = 'admin';
                        }
                    }
                    $rootScope.isLoading = false;
                },
                 function (error) {
                     vm.message = error.data.message;
                     vm.Next = false;
                     $rootScope.isLoading = false; //loading gif
                 });
           
        }

        vm.demote = function (userID) {
            $rootScope.isLoading = true;
            var param = { user_id: userID };
            var i;

            userResource.demote.demoteUser(param,
                function (response) {
                    vm.message = null;

                    for (i = 0; i < vm.users.length ; i++) {

                        if (vm.users[i].UserID === userID) {
                            vm.users[i].Role='user';
                        }
                    }
                    $rootScope.isLoading = false;
                },
                 function (error) {
                     vm.message = error.data.message;
                     vm.Next = false;
                     $rootScope.isLoading = false; //loading gif
                 });
           
        }


        vm.itemsPerPage = vm.per_page;
        vm.chosePerPage = function () {
            //schimba numarul de elemente de pe pagina

            if (vm.itemsPerPage != vm.per_page) {

                $rootScope.isLoading = true;
                vm.per_page = vm.itemsPerPage;
                vm.page_nr = 0;
                var param = { page_nr: vm.page_nr, per_page: vm.per_page };
       
                userResource.get.getUsers(param,
                    function (response) {
                        vm.message = null;
                        vm.users = response.data;
                    $rootScope.isLoading = false;

                    if (vm.users.length < vm.per_page) {
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
            var param = { page_nr: vm.page_nr, per_page: vm.per_page };

            if (vm.page_nr <= 0) {
                vm.Prev = false;
            }
            else {
                vm.Prev = true;
            }
            
            userResource.get.getUsers(param,
                function (response) {
                    vm.message = null;
                    vm.users = response.data;
                $rootScope.isLoading = false;
                
                if (vm.users.length < vm.per_page) {
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
     
        vm.viewSendMessage = function (id, username) {
           // alert(id+" "+username);
            $cookies.remove('receiver_id');
            $cookies.remove('receiver_username');

            $cookies.put('receiver_id', id);
            $cookies.put('receiver_username', username);
            return 'contact_admin_redirect';
        }
    }
}());
