﻿(function () {
    "use strict";
    angular
        .module("formManagement")
        .controller("FormVoteController", ["formResource", "$cookies", "$rootScope", FormVoteController]);

    function FormVoteController(formResource, $cookies, $rootScope, RadarCtrl) {
        var vm = this;

        vm.formID = $cookies.get('last_poll');

        //a votat userul?
        vm.voted = false;
        vm.showResults = false;

        //array pentru raspuns
        vm.voteForm = {
            username: $cookies.get('username'),
            answers: [{ question: 0, answer: 0 }]
        };

        vm.changeID = function (id) {
            // alert("cookie");
            $cookies.put('last_poll', id);
            return 'vote_poll';
        }

        var param = { form_id: vm.formID };

        if (vm.formID) {

            $rootScope.isLoading = true;
            $cookies.remove('last_poll');
            formResource.getForm.getForm(param,
                function (response) {

                    vm.detailedForm = response;
                    $rootScope.isLoading = false;
                    //creez array-ul pentru raspuns
                    if (vm.detailedForm.Questions.length > 0) {
                        var i;

                        vm.voteForm.answers[0].question = vm.detailedForm.Questions[0].QuestionID;

                        for (i = 0; i < vm.detailedForm.Questions.length; i++) {
                            //deja este un rand introdus la initializare

                            if (i >= 1) {
                                vm.voteForm.answers.push({ 'question': vm.detailedForm.Questions[i].QuestionID, 'answer': 0 });
                            }
                            vm.detailedForm.Questions[i].nrCrt = i;
                        }
                    }
                },
                function (error) {
                    vm.messageForm = error.data.message;
                    $rootScope.isLoading = false; //loading gif
                });

        }

        //vote
        vm.vote = function () {
            // alert(vm.sendForm);
            var x = JSON.stringify(vm.voteForm)

            //s-au votat toate intrebarile
            if (x.indexOf(":0") == -1) {
                $rootScope.isLoading = true;
                formResource.vote.voteForm(x,
                    //s-a creat cu succes
                    function (response) {
                        var i;

                        for (i = 0; i < vm.voteForm.answers.length; i++) {
                            //deja este un rand introdus la initializare
                            vm.voteForm.answers[i].answer = 0;
                        }
                        vm.results = response;
                        $rootScope.isLoading = false;
                        vm.voted = true;
                        vm.messageForm = 'Poll voted successfully';

                    },

                   //nu s-a creat
                    function (error) {
                        vm.messageForm = error.data.message;
                        vm.voted = false;
                        $rootScope.isLoading = false;

                    });

            }
        }
        
        vm.viewResults = function () {

            vm.showResults = true;
            var i, j, k;
           // alert(vm.results.NrVotes);
           
            vm.chartResult = [];
            //prelucrare pentru afisare statistica
            for (i = 0; i < vm.results.Questions.length; i++) {

                vm.chartResult[i] = [];
                vm.chartResult[i].chartLabels = [];
                vm.chartResult[i].chartData = [];

                for (j = 0; j < vm.results.Questions[i].Answers.length; j++) {

                    for (k = 0; k < vm.detailedForm.Questions[i].Answers.length; k++) {

                        if (vm.detailedForm.Questions[i].Answers[k].AnswerID == vm.results.Questions[i].Answers[j].AnswerID) {
                            //compar detailed form si id-ul din raspuns 

                            vm.chartResult[i].chartLabels.push(vm.detailedForm.Questions[i].Answers[k].Answer);
                        }
                    }
                    vm.chartResult[i].chartData.push(vm.results.Questions[i].Answers[j].AnswerNrVotes);

                }

            }
        }
    }

}());
