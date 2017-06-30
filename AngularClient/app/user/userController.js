(function () {
    "use strict";
    angular
        .module("userManagement")
        .controller("UserController", ["userResource","userAccount","$cookies", "$rootScope", UserController]);

    function UserController(userResource, userAccount,$cookies, $rootScope) {
        var vm = this;

        vm.page_nr = 0; //numarul paginii
        vm.per_page = 10; //numarul de elemente de pe pagina
        vm.Prev = false; // se afiseaza "prev page" la paginare
        vm.Next = true; // se afiseaza "next page" la paginare
        $rootScope.isLoading = true;
       
        userResource.get.getUsers(
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

        vm.getUsers = function() {
            userResource.get.getUsers(
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
        }

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


      vm.viewSendMessage = function (id, username) {
           // alert(id+" "+username);
            $cookies.remove('receiver_id');
            $cookies.remove('receiver_username');

            $cookies.put('receiver_id', id);
            $cookies.put('receiver_username', username);
            return 'contact_admin_redirect';
      }

      vm.countAdminUsers = function () {
          var count = 0;
          for (var i = 0; i < vm.users.length ; i++) {

              if (vm.users[i].Role === 'admin') {
                  count++;
              }
          }

          if (count > 1) {
              return false;
          }

          return true;
      }

        //data for registration
        vm.userDataRegistration = {
            username: '',
            password: '',
            email: ''
        };
        vm.confirm_password = '';
        vm.tokenDataRegistration = $cookies.get('token');

        //------------------register-----------------------
        vm.registerUser = function () {
            //alert(vm.userDataRegistration.email);
            if (vm.userDataRegistration.email != '' && vm.userDataRegistration.email != null && vm.userDataRegistration.username != '' && vm.userDataRegistration.username != null
                && vm.userDataRegistration.password != '' && vm.userDataRegistration.password != null) {

               // alert(vm.userDataRegistration.password);
                vm.userDataRegistration.email = vm.userDataRegistration.email.replace(/ /g, '');
                vm.userDataRegistration.username = vm.userDataRegistration.username.replace(/ /g, '');
                vm.userDataRegistration.password = vm.userDataRegistration.password.replace(/ /g, '');
            }

            if (vm.userDataRegistration.email != '' && vm.userDataRegistration.email != null && vm.userDataRegistration.username != '' && vm.userDataRegistration.username != null
                && vm.userDataRegistration.password != '' && vm.userDataRegistration.password != null) {


                if (vm.confirm_password == vm.userDataRegistration.password) {
                    //start loading
                    $rootScope.isLoadingRegister = true;

                    userAccount.registration.registerUser(vm.userDataRegistration,

                        function (response) {

                            //inregistrarea a avut succes

                            vm.userDataRegistration.username= '';
                            vm.userDataRegistration.password= '';
                            vm.userDataRegistration.email= '';
                            vm.confirm_password = '';

                            vm.messageSuccessRegistration = response.message;
                            vm.messageFailedRegistration = '';
                            //  vm.login();
                            $rootScope.isLoadingRegister = false;

                            vm.getUsers();

                            vm.messageSuccessRegistration = '';
                            vm.messageFailedRegistration = '';
                        },

                        function (error) {
                            //inregistrarea nu a avut succes
                            $rootScope.isLoadingRegister = false;
                            vm.messageSuccessRegistration = '';
                            vm.messageFailedRegistration = error.data.message;
                        });
                }
                else {
                    vm.messageFailedRegistration = "Passwords don't match";
                }
            }
        }

        vm.reset = function () {
            vm.created = null;
            vm.messageSuccessRegistration = '';
            vm.messageFailedRegistration = '';
            vm.message = null;
        }
    }
}());
