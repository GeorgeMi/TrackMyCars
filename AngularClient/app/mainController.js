(function () {
    "use strinct";
    angular
        .module("app")
        .controller("MainController", ["userAccount", "$cookies", "$routeParams", "$location", "$rootScope", MainController])
    
    function MainController(userAccount, $cookies, $routeParams, $location, $rootScope)
    {
        var vm = this;

        vm.isLoggedIn = false;
        $rootScope.isLoading = false; //loading gif
        $rootScope.isLoadingRegister = false; //loading gif
        vm.isQuery = false;

        vm.messageSuccessRegistration = '';
        vm.messageFailedRegistration = '';
        vm.messageLogIn = '';
        vm.message = '';
        vm.role = '';

        //data for login
        vm.userData = {
            username: $cookies.get('username'),
            password: ''
        };

        vm.pagesArray = {
            current: '',
            last: ''
        };
        //app pages
        vm.pages = {
            my_cars: true,
            utilities: false,
            new_car: false,
            manage_users: false,
            manage_cars: false,
            update_cars: false,
            manage_utilities: false,
            utility_forms: false,
            contact: false,
            contact_admin: false,
            contact_admin_redirect: false
        };

        vm.confirm_password = '';
        vm.tokenDataRegistration = $cookies.get('token');

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
                        vm.changePage('my_cars');

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
                            vm.changePage('my_cars');
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

            vm.pages.utilities = false;
            vm.pages.new_car = false;
            vm.pages.my_cars = false;
            vm.pages.manage_users = false;
            vm.pages.manage_cars = false;
            vm.pages.update_cars = false;
            vm.pages.manage_utilities = false;
            vm.pages.utility_forms = false;
            vm.pages.contact = false;
            vm.pages.contact_admin = false;
            vm.pages.contact_admin_redirect = false;
        }

        //------------------change page-----------------------

        vm.changePage = function (mypage) {
           //inchide sideBar la smartphone
            $(".mobileSideBarVisible").addClass("sideBarHidden");
            vm.ok = 1; // mypage este valid
            vm.pages.utilities = false;
            vm.pages.new_car = false;
            vm.pages.my_cars = false;
            vm.pages.manage_users = false;
            vm.pages.manage_cars = false;
            vm.pages.update_cars = false;
            vm.pages.manage_utilities = false;
            vm.pages.utility_forms = false;
            vm.pages.contact = false;
            vm.pages.contact_admin = false;
            vm.pages.contact_admin_redirect = false;


            if (mypage == 'utilities') {
                vm.pages.utilities = true;
                vm.ok = 1;
            }
           else if (mypage == 'new_car') {
                vm.pages.new_car = true;
                vm.ok = 0;
           }
           else if (mypage == 'my_cars') {
                vm.pages.my_cars = true;
                vm.ok = 1;
            }
            else if (mypage == 'manage_users') {
                vm.pages.manage_users = true;
                vm.ok = 1;
            }
            else if (mypage == 'manage_cars') {
                vm.pages.manage_cars = true;
                vm.ok = 1;
            }
            else if (mypage == 'update_cars') {
                vm.pages.update_cars = true;
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
        vm.changePage('my_cars');

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