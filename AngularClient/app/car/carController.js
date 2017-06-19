(function () {
    "use strict";
    angular
        .module("carManagement")
        .controller("CarController", ["carResource", "$cookies", "$rootScope", "$window", CarController]);

    function CarController(carResource, $cookies, $rootScope, $window) {
        var vm = this;

        vm.created = false;
        vm.page_nr = 0; //numarul paginii
        vm.per_page = 10; //numarul de elemente de pe pagina
        vm.state = 'open'; //open, closed, all
        vm.Prev = false; // se afiseaza "prev page" la paginare
        vm.Next = true; // se afiseaza "next page" la paginare
        vm.message = null;
        $rootScope.isLoading = true; //loading gif

        //data form to send
        vm.addCar = {
            username: $cookies.get('username'),
            title: '',
            category: '',
            createdDate: '',
            deadline: '',
            id: 0,
            state: 'open',
            //  answer: {id:1,answer:"a"}
            questions: [{ id: 1, question: '', answers: [{ id: 1, answer: '' }] }]
        };

        vm.addCarMessage = '';
        //max vals
        vm.maxQuestionCount = 20;
        vm.maxAnswerCount = 6;

        //<-----------------add question---------------------->
        vm.addNewQuestion = function () {

            var questionID = vm.addCar.questions.length + 1;

            if (questionID <= vm.maxQuestionCount) {
                vm.addCar.questions.push({ 'id': questionID, 'question': '', 'answers': [{ 'id': 1, 'answer': '' }] });
            }
            else {
                alert("Maximum Number of Questions Allowed is " + vm.maxQuestionCount);
            }
        };

        //<-----------------delete question----------------------> 
        vm.deleteQuestion = function (questionID) {

            if (vm.addCar.questions.length > 1) {
                vm.addCar.questions.splice(questionID - 1, 1);
                var count = 1;
                var i;

                //rewrite id foreach element in array
                for (i = 0; i <= vm.addCar.questions.length; i++) {
                    if (vm.addCar.questions[i] !== undefined) {
                        vm.addCar.questions[i].id = count;
                        count++;
                    }
                }
            } else {
                alert("Minimum Number of Questions Allowed is 1");
            }
        }

        //<-----------------load page----------------------> 
        var param = { state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };
        carResource.get.getcars(param,

            function (response) {
                vm.cars = response.data;
                $rootScope.isLoading = false; //loading gif
                vm.message = null;

                if (vm.cars.length < vm.per_page) {
                    vm.Next = false;
                }
                else {
                    vm.Next = true;
                }

            },

            function (error) {
                vm.message = error.data.message;
                vm.Next = false;
                $rootScope.isLoading = false; //loading gif
                if (vm.message == "Invalid Authorization Key") {
                    $window.location.reload();
                }
            }
        );


        //<-----------------add form----------------------> 
        vm.sendCarDetails = function () {
            // alert(vm.addCar);

            if (vm.addCar.title != '' && vm.addCar.category != '' && vm.addCar.deadline != '') {

                vm.addCar.title = vm.addCar.title.trim()
                vm.addCar.category = vm.addCar.category.trim()

            }

            if (vm.addCar.title != '' && vm.addCar.category != '' && vm.addCar.deadline != '') {
                $rootScope.isLoading = true;
                var x = JSON.stringify(vm.addCar);

                carResource.add.sendCarDetails(x,
                    //s-a creat cu succes
                    function (response) {
                        vm.addCar.title = '';
                        vm.addCar.category = '';
                        vm.addCar.createdDate = '';
                        vm.addCar.deadline = '';
                        vm.addCar.questions = [{ id: 1, question: '', answers: [{ id: 1, answer: '' }] }];

                        vm.messageForm = response.message;
                        vm.created = response.status;
                        $rootScope.isLoading = false;
                    },

                   //nu s-a creat

            function (error) {
                vm.messageForm = error.data.message;
                vm.created = error.data.status;
                $rootScope.isLoading = false; //loading gif
            });

            }
        }

        //<-----------------delete form----------------------> 
        vm.deleteCar = function (formID) {
            var r = confirm("Are you sure that you want to permanently delete this form?");
            if (r == true) {
                $rootScope.isLoading = true;

                var param = { form_id: formID };
                var i;
                // alert(formID);

                carResource.delete.deleteCar(param,
                    function (data) {

                        for (i = 0; i < vm.cars.length ; i++) {

                            if (vm.cars[i].Id === formID) {
                                vm.cars.splice(i, 1);
                            }
                        }
                    });
                $rootScope.isLoading = false;
            }
        }

        //<-----------------change items per page----------------------> 
        vm.itemsPerPage = vm.per_page;
        vm.chosePerPage = function () {
            //schimba numarul de elemente de pe pagina

            if (vm.itemsPerPage != vm.per_page) {

                $rootScope.isLoading = true;
                vm.per_page = vm.itemsPerPage;
                vm.page_nr = 0;
                var param = { page_nr: 0, per_page: vm.itemsPerPage, state: vm.state };
                carResource.get.getcars(param,

                    function (response) {
                        vm.cars = response.data;
                        $rootScope.isLoading = false; //loading gif
                        vm.message = null;

                        if (vm.cars.length < vm.per_page) {
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
        //<-----------------change page----------------------> 
        vm.chosePageNr = function (id) {
            //schimba numarul paginii
            $rootScope.isLoading = true;
            vm.page_nr = id;
            var param = { state: vm.state, page_nr: id, per_page: vm.itemsPerPage };

            if (vm.page_nr <= 0) {
                vm.Prev = false;
            }
            else {
                vm.Prev = true;
            }

            carResource.get.getcars(param,

               function (response) {
                   vm.cars = response.data;
                   $rootScope.isLoading = false; //loading gif
                   vm.message = null;

                   if (vm.cars.length < vm.per_page) {
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
}());
