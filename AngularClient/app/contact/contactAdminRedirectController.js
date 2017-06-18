(function () {
    "use strict";
    angular
        .module("contactManagement")
        .controller("ContactAdminRedirectController", ["contactResource", "$cookies", "$rootScope", ContactAdminRedirectController]);

    function ContactAdminRedirectController(contactResource, $cookies, $rootScope) {
        var vm = this;
        vm.sent = false;
        $rootScope.isLoading = false;
        vm.receiverUsername = $cookies.get('receiver_username');
        
        vm.contact = {
            category: "Message",
            message: "",
            receiver: $cookies.get('receiver_id')
        }
        var x = JSON.stringify(vm.contact);

        vm.sendUserMessage = function () {

            if (vm.contact.message != '') {

                vm.messageContact = '';
                vm.sent = null;
                $rootScope.isLoading = true;
               
                var x = JSON.stringify(vm.contact);

                contactResource.send.sendMessage(x,
                   //s-a trimis cu succes
                   function (response) {

                       vm.contact.message = '';
                       vm.contact.category = '';
                       vm.messageContact = response.message;
                       vm.sent = response.status;
                       $rootScope.isLoading = false;
                   },

                  //nu s-a trimis
                   function (error) {
                       vm.messageContact = error.data.message;
                       vm.sent = error.data.status;
                       $rootScope.isLoading = false;
                   });
            }
        }

    }

}());