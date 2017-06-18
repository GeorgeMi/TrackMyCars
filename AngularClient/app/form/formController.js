(function () {
    "use strict";
    angular
        .module("formManagement")
        .controller("FormController", ["formResource", "$cookies", "$rootScope", "$window", FormController]);

    function FormController(formResource, $cookies, $rootScope, $window) {
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
        vm.sendForm = {
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

        vm.sendFormMessage = '';
        //max vals
        vm.maxQuestionCount = 20;
        vm.maxAnswerCount = 6;

        //<-----------------add question---------------------->
        vm.addNewQuestion = function () {

            var questionID = vm.sendForm.questions.length + 1;

            if (questionID <= vm.maxQuestionCount) {
                vm.sendForm.questions.push({ 'id': questionID, 'question': '', 'answers': [{ 'id': 1, 'answer': '' }] });
            }
            else {
                alert("Maximum Number of Questions Allowed is " + vm.maxQuestionCount);
            }
        };

        //<-----------------add answer----------------------> 
        vm.addNewAnswer = function (questionID) {

            var answerID = vm.sendForm.questions[questionID - 1].answers.length + 1;

            if (answerID <= vm.maxAnswerCount) {
                vm.sendForm.questions[questionID - 1].answers.push({ id: answerID, 'answer': '' });
            }
            else {
                alert("Maximum Number of Answers Allowed is " + vm.maxAnswerCount);
            }
        };

        //<-----------------delete question----------------------> 
        vm.deleteQuestion = function (questionID) {

            if (vm.sendForm.questions.length > 1) {
                vm.sendForm.questions.splice(questionID - 1, 1);
                var count = 1;
                var i;

                //rewrite id foreach element in array
                for (i = 0; i <= vm.sendForm.questions.length; i++) {
                    if (vm.sendForm.questions[i] !== undefined) {
                        vm.sendForm.questions[i].id = count;
                        count++;
                    }
                }
            } else {
                alert("Minimum Number of Questions Allowed is 1");
            }
        }

        //<-----------------delete answer----------------------> 
        vm.deleteAnswer = function (questionID, answerID) {
            // alert('q: ' + questionID + ', a: ' + answerID);
            if (vm.sendForm.questions[questionID - 1].answers.length > 1) {
                vm.sendForm.questions[questionID - 1].answers.splice(answerID - 1, 1);
                var count = 1;
                var i;

                //rewrite id foreach element in array
                for (i = 0; i <= vm.sendForm.questions[questionID - 1].answers.length; i++) {
                    if (vm.sendForm.questions[questionID - 1].answers[i] !== undefined) {
                        vm.sendForm.questions[questionID - 1].answers[i].id = count;
                        count++;
                    }

                }
            } else {
                alert("Minimum Number of Answers Allowed is 1");
            }
        }

        //<-----------------load page----------------------> 
        var param = { state: vm.state, page_nr: vm.page_nr, per_page: vm.per_page };
        formResource.get.getForms(param,

            function (response) {
                vm.forms = response.data;
                $rootScope.isLoading = false; //loading gif
                vm.message = null;

                if (vm.forms.length < vm.per_page) {
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
        vm.addForm = function () {
            // alert(vm.sendForm);

            if (vm.sendForm.title != '' && vm.sendForm.category != '' && vm.sendForm.deadline != '') {

                vm.sendForm.title = vm.sendForm.title.trim()
                vm.sendForm.category = vm.sendForm.category.trim()

            }

            if (vm.sendForm.title != '' && vm.sendForm.category != '' && vm.sendForm.deadline != '') {
                $rootScope.isLoading = true;
                var x = JSON.stringify(vm.sendForm);

                formResource.add.addForm(x,
                    //s-a creat cu succes
                    function (response) {
                        vm.sendForm.title = '';
                        vm.sendForm.category = '';
                        vm.sendForm.createdDate = '';
                        vm.sendForm.deadline = '';
                        vm.sendForm.questions = [{ id: 1, question: '', answers: [{ id: 1, answer: '' }] }];

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
        vm.deleteForm = function (formID) {
            var r = confirm("Are you sure that you want to permanently delete this form?");
            if (r == true) {
                $rootScope.isLoading = true;

                var param = { form_id: formID };
                var i;
                // alert(formID);

                formResource.delete.deleteForm(param,
                    function (data) {

                        for (i = 0; i < vm.forms.length ; i++) {

                            if (vm.forms[i].Id === formID) {
                                vm.forms.splice(i, 1);
                            }
                        }
                    });
                $rootScope.isLoading = false;
            }
        }

        //<-----------------view results----------------------> 
        vm.viewResults = function (id) {
            //alert("cookie");
            $cookies.put('my_poll_result', id);
            return 'my_poll_result';
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
                formResource.get.getForms(param,

                    function (response) {
                        vm.forms = response.data;
                        $rootScope.isLoading = false; //loading gif
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

            formResource.get.getForms(param,

               function (response) {
                   vm.forms = response.data;
                   $rootScope.isLoading = false; //loading gif
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
                param = { page_nr: 0, per_page: vm.per_page, state: vm.itemsState };

                formResource.get.getForms(param,

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
