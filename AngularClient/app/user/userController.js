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
    }
}());
