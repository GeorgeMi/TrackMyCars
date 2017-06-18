(function () {
    "use strict";
    angular
        .module("formManagement")
        .controller("FormResultController", ["formResource", "$cookies", "$rootScope", FormResultController]);

    function FormResultController(formResource, $cookies, $rootScope) {
        var vm = this;

        var param = { form_id: $cookies.get('my_poll_result') };
        $rootScope.isLoading = true; //loading gif

        formResource.getFormResult.getFormResult(param,
            function (response) {

                $cookies.remove('my_poll_result');
                vm.results = response;
                
                var i, j, k;
                vm.chartResult = [];

                //prelucrare pentru afisare statistica
                for (i = 0; i < vm.results.Questions.length; i++) {
                    vm.results.Questions[i].nrCrt = i;
                    vm.chartResult[i] = [];
                    vm.chartResult[i].chartLabels = [];
                    vm.chartResult[i].chartData = [];

                    for (j = 0; j < vm.results.Questions[i].Answers.length; j++) {

                        vm.chartResult[i].chartLabels.push(vm.results.Questions[i].Answers[j].Answer);
                        vm.chartResult[i].chartData.push(vm.results.Questions[i].Answers[j].AnswerNrVotes);
                    }
                }

                $rootScope.isLoading = false;
            },
             function (error) {
                 vm.message = error.data.message;
                 $rootScope.isLoading = false; //loading gif
             });

    }
}());
