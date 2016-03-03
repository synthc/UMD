namespace MyApp.Controllers {

    export class NavController {
        public loggedIn: boolean;
        public userInfo;
        public userName;

        public query;
        public results;

        constructor(private $uibModal: angular.ui.bootstrap.IModalService, private $location: ng.ILocationService, private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService) { 
            this.isLoggedIn();
            //this.accountService.getUserInfo(this.accountService.isLoggedIn()).then((data) => {
            //    this.userInfo = data;
            //    this.userName = this.userInfo.email;
            //    this.MediaService.user = data;
            //    this.MediaService.user.isLoggedIn = this.loggedIn;
            //    console.log(this.MediaService.user);
            //});

            this.MediaService.getUser("thisUser").then((data) => {
                this.userInfo = data;
                this.userName = this.userInfo.userName;
                this.MediaService.user = data;
                this.MediaService.user.isLoggedIn = this.loggedIn;
            });

            this.query = {};
            this.query.searchFor = "All";
            this.query.searchBy = "Title";
            this.query.query = "";
        }

        public logout() {
            this.accountService.logout();
            this.loggedIn = false;
        }

        public isLoggedIn() {
            if (this.accountService.isLoggedIn() == null) {
                this.loggedIn = false;
            }
            else {
                this.loggedIn = true;
            }
        }

        public openLoginModal() {
            this.$uibModal.open({
                templateUrl: 'ngApp/views/login.html',
                controller: MyApp.Controllers.LoginController,
                controllerAs: 'controller',
            });
        }

        public setParams(parameter: number, value: string) {
            if (parameter == 0) {
                this.query.searchFor = value;
            }
            else {
                this.query.searchBy = value;
            }
        } 

        public search (){
            this.MediaService.search(this.query).then((data) => {
                this.results = data.results;
                this.MediaService.searchTransport = this.results;
                console.log(this.results);
                if (window.location.pathname != '/search') {
                    this.$location.path('/search');
                }
            })
        }
    }

    angular.module('MyApp').controller('NavController', NavController);

    //export class LoginModalController { //already a login controller in accountController.ts
    //    constructor(private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {

    //    }

        
    }