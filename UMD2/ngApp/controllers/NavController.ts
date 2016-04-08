namespace MyApp.Controllers {

    export class NavController {
        public isLoggedIn;
        public isAdmin;
        public userInfo;
        public userName;

        public query;
        public searchForPerson = false;
        public sbLastSet = "Title";
        public mouseHover = false;

        constructor(private $uibModal: angular.ui.bootstrap.IModalService, private $location: ng.ILocationService, private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService) {
            this.setUserInfo();

            this.MediaService.getUser("thisUser").then((data) => {
                this.userInfo = data;
                this.userName = this.userInfo.userName;
                this.MediaService.user = data;
                this.MediaService.user.isLoggedIn = this.isLoggedIn;
            });

            this.query = {};
            this.query.searchFor = "All";
            this.query.searchBy = "Title";
            this.query.query = "";
            this.query.includeDeleted = false;
            this.query.onlyDeleted = false;
            this.MediaService.searchTransport = {};
        }

        public logout() {
            this.accountService.logout();
            this.isLoggedIn = false;
        }

        public setUserInfo() {
            if (this.accountService.isLoggedIn() == null) {
                this.isLoggedIn = false;
                this.isAdmin = false;
            }
            else {
                this.isLoggedIn = true;
                if (this.accountService.getClaim("Admin") == null) {
                    this.isAdmin = false;
                }
                else {
                    this.isAdmin = true;
                }
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

                if (value == "People" || value == "Users") {
                    this.query.searchBy = "Name";
                    this.searchForPerson = true;
                }
                else {
                    if (this.query.searchBy == "Name") {
                        this.query.searchBy = this.sbLastSet;
                    }
                    this.searchForPerson = false;
                }
            }
            else {
                this.query.searchBy = value;
                this.sbLastSet = value;
            }
        }

        public search() {
            this.MediaService.search(this.query).then((data) => {
                if (this.query.searchFor == "People") {
                    console.log(data);
                    this.MediaService.searchTransport = data.cResults;
                    this.MediaService.searchTransport.dataType = "People";
                }
                else if (this.query.searchFor == "Users") {
                    this.MediaService.searchTransport = data.uResults;
                    this.MediaService.searchTransport.dataType = "Users";
                }
                else {
                    this.MediaService.searchTransport = data.results;
                    this.MediaService.searchTransport.dataType = "Media";
                }
                if (window.location.pathname != '/search') {
                    this.$location.path('/search');
                }
            })
        }

        public setMouseHover(hover: boolean) {
            this.mouseHover = hover;
        }
    }

    angular.module('MyApp').controller('NavController', NavController);
}