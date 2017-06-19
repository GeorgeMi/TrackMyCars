(function () {
    "use strinct";
    angular
        .module("app")
        .controller("MainController", ["userAccount","formResource", "$cookies", "$routeParams", "$location", "$rootScope", MainController])
    
    function MainController(userAccount, formResource, $cookies, $routeParams, $location, $rootScope)
    {
        var vm = this;

        vm.isLoggedIn = true;
        $rootScope.isLoading = false; //loading gif
        $rootScope.isLoadingRegister = false; //loading gif
        vm.isQuery = false;

        vm.messageSuccessRegistration = '';
        vm.messageFailedRegistration = '';
        vm.messageLogIn = '';
        vm.message = '';
        vm.role = 'admin';

        //data for login
        vm.userData = {
            username: $cookies.get('username'),
            password: ''
        };

        //data for registration
        vm.userDataRegistration = {
            username: '',
            password: '',
            email: ''
        };

        vm.pagesArray = {
            current: '',
            last: ''
        };
        //app pages
        vm.pages = {
            home: true,
            my_polls: false,
            my_poll_result: false,
            utilities: false,
            new_poll: false,
            new_car: false,
            manage_users: false,
            manage_polls: false,
            manage_utilities: false,
            utility_forms: false,
            contact: false,
            search_polls: false,
            contact_admin: false,
            contact_admin_redirect: false
        };

        vm.confirm_password = '';
        vm.tokenDataRegistration = $cookies.get('token');

        //------------------register-----------------------
        vm.registerUser = function () {

            if (vm.userDataRegistration.email != '' && vm.userDataRegistration.email != null
               && vm.userDataRegistration.username != '' && vm.userDataRegistration.username != null
                && vm.userDataRegistration.password != '' && vm.userDataRegistration.password != null) {
                //alert(vm.userDataRegistration.password);
                vm.userDataRegistration.email = vm.userDataRegistration.email.replace(/ /g, '');
                vm.userDataRegistration.username = vm.userDataRegistration.username.replace(/ /g, '');
                vm.userDataRegistration.password = vm.userDataRegistration.password.replace(/ /g, '');
            }

            if (vm.userDataRegistration.email != '' && vm.userDataRegistration.email != null
               && vm.userDataRegistration.username != '' && vm.userDataRegistration.username != null
                && vm.userDataRegistration.password != '' && vm.userDataRegistration.password != null) {

                if (vm.confirm_password == vm.userDataRegistration.password) {
                    //start loading
                    $rootScope.isLoadingRegister = true;

                    userAccount.registration.registerUser(vm.userDataRegistration,

                        function (response) {
                            //inregistrarea a avut succes
                            vm.messageSuccessRegistration = response.message;
                            vm.messageFailedRegistration = '';
                            vm.userData.username = vm.userDataRegistration.username;
                            vm.userData.password = vm.userDataRegistration.password;
                            //  vm.login();
                            $rootScope.isLoadingRegister = false;
                        },

                        function (error) {
                            //inregistrarea nu a avut succes
                            vm.isLoggedIn = false;
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

        //-----------------login with username and password-----------------------
        vm.login = function () {

            if (vm.userData.password != '' && vm.userData.username != '') {

                vm.userData.password = vm.userData.password.replace(/ /g, '');
                vm.userData.username = vm.userData.username.replace(/ /g, '');
            }

            if (vm.userData.password != '' && vm.userData.username != '') {

                //start loading
                $rootScope.isLoadingRegister = true;
                userAccount.login.loginUser(vm.userData,
                    function(response) {

                        vm.isLoggedIn = true;
                        vm.password = "";
                        vm.token = response.token;
                        vm.role = response.role;
                        //always load on home page
                        vm.changePage('home');

                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);

                        $cookies.put("token", vm.token, { 'expires': expireDate });
                        $cookies.put("username", vm.userData.username, { 'expires': expireDate });
                        $cookies.put("role", vm.role, { 'expires': expireDate });

                        //stop loading
                        $rootScope.isLoadingRegister = false;

                    },
                    function(error) {
                        //inregistrarea nu a avut succes

                        vm.isLoggedIn = false;
                        vm.password = "";
                        vm.messageLogIn = error.data.message;
                       
                       //stop loading
                        $rootScope.isLoadingRegister = false;
                    });
            }
        }

        //------------------login with token-----------------------
        vm.registerToken = function () {

            userAccount.tokenRegistration.registerToken(
                function(data) {

                    if (data.error) {
                        //token invalid
                        vm.isLoggedIn = false;
                        vm.messageLogIn = data.error;

                    } else {
                        //token acceptat
                        vm.isLoggedIn = true;

                        //always load on home page
                        if (!vm.isQuery) {
                            vm.changePage('home');
                        }

                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        vm.role = data.role;

                        $cookies.put("token", vm.tokenDataRegistration, { 'expires': expireDate });
                        $cookies.put("username", vm.userData.username, { 'expires': expireDate });
                        $cookies.put("role", vm.role, { 'expires': expireDate });
                    }
                });
        }

        //------------------logout-----------------------
        vm.logout = function () {
            $cookies.remove("token");
            $cookies.remove("role");
            $cookies.remove("receiver_id");
            $cookies.remove("receiver_username");

            vm.isLoggedIn = false;

            vm.pages.home = false;
            vm.pages.utilities = false;
            vm.pages.my_polls = false;
            vm.pages.new_poll = false;
            vm.pages.new_car = false;
            vm.pages.manage_users = false;
            vm.pages.manage_polls = false;
            vm.pages.manage_utilities = false;
            vm.pages.utility_forms = false;
            vm.pages.contact = false;
            vm.pages.search_polls = false;
            vm.pages.contact_admin = false;
            vm.pages.contact_admin_redirect = false;
        }

        //------------------change page-----------------------

        vm.changePage = function (mypage) {
           //inchide sideBar la smartphone
            $(".mobileSideBarVisible").addClass("sideBarHidden");
            vm.ok = 1; // mypage este valid
            vm.pages.home = false;
            vm.pages.utilities = false;
            vm.pages.utility_forms = false;
            vm.pages.my_polls = false;
            vm.pages.my_poll_result = false;
            vm.pages.new_poll = false;
            vm.pages.new_car = false;
            vm.pages.manage_users = false;
            vm.pages.manage_polls = false;
            vm.pages.manage_utilities = false;
            vm.pages.contact = false;
            vm.pages.search_polls = false;
            vm.pages.contact_admin = false;
            vm.pages.contact_admin_redirect = false;

            if (mypage == 'home') {
                vm.pages.home = true;
                vm.ok = 1;
            }
            else if (mypage == 'utilities') {
                vm.pages.utilities = true;
                vm.ok = 1;
            }
            else if (mypage == 'my_polls') {
                vm.pages.my_polls = true;
                vm.ok = 1;
            }
            else if (mypage == 'new_poll') {
                vm.pages.new_poll = true;
                vm.ok = 0;
            }
            else if (mypage == 'new_car') {
                vm.pages.new_car = true;
                vm.ok = 0;
            }
            else if (mypage == 'manage_users') {
                vm.pages.manage_users = true;
                vm.ok = 1;
            }
            else if (mypage == 'manage_polls') {
                vm.pages.manage_polls = true;
                vm.ok = 1;
            }
            else if (mypage == 'manage_utilities') {
                vm.pages.manage_utilities = true;
                vm.ok = 1;
            }
            else if (mypage == 'utility_forms') {
                vm.pages.utility_forms = true;
                vm.ok = 0;
            }
            else if (mypage == 'contact') {
                vm.pages.contact = true;
                vm.ok = 1;
            }
            else if (mypage == 'search_polls') {
                vm.pages.search_polls = true;
                vm.ok = 1;
            }
            else if (mypage == 'contact_admin') {
                vm.pages.contact_admin = true;
                vm.ok = 1;
            }
            else if (mypage == 'contact_admin_redirect') {
                vm.pages.contact_admin_redirect = true;
                vm.ok = 0;
            }
            else {
                vm.ok = 0;
            }

            if (vm.ok == 1) {
                vm.pagesArray.last = vm.pagesArray.current;
                vm.pagesArray.current = mypage;
            }
            else {
                vm.pagesArray.last = vm.pagesArray.current;
            }
        }
        vm.changePage('home');

        vm.backPage = function () {

            vm.changePage(vm.pagesArray.last);
            temp = vm.pagesArray.last;
            vm.pagesArray.last = vm.pagesArray.current;
            vm.pagesArray.current = temp;
        }

        //------------------verify mail---------------------
        if ($location.search().verifymail)
        {
            //start loading
            $rootScope.isLoadingRegister = true;

            var param = { user_id: $location.search().verifymail };

            userAccount.verifyMail.verifyMail(param,
                function(response) {
                    //validarea a avut succes
                    vm.messageSuccessRegistration = response.message;
                    vm.messageFailedRegistration = '';

                    //stop loading
                    $rootScope.isLoadingRegister = false;
                },

                function(error) {
                    //validarea nu a avut succes
                    vm.messageFailedRegistration = error.message;
                    vm.messageSuccessRegistration = '';

                    //stop loading
                    $rootScope.isLoadingRegister = false;
                });
        }
        else if ($location.search().poll) {
            vm.isQuery = true;
            vm.changePage(vm.changeID($location.search().poll));
        }
            //change page using url
        else if ($location.url()) {
            vm.changePage($location.url());
        }
    };
})();