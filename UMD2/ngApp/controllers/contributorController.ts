namespace MyApp.Controllers {
    export class ContributorController {
        public contributor;
        public dob;
        public months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        public isLoggedIn;
        public isAdmin;
        public notFound = false;
        public showInactiveMessage = false;
        public showInactiveIndicator = false;
        
        constructor(private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService, private $routeParams: ng.route.IRouteParamsService, private $uibModal: angular.ui.bootstrap.IModalService) {
            this.setUserInfo();
            this.MediaService.getContributorById(this.$routeParams['id']).then((data) => {
                this.contributor = data;

                //If contributor exists:
                if (this.contributor.id != undefined) {

                    //If inactive and not admin, hide the page:
                    if (!this.contributor.isActive && !this.isAdmin) {
                        this.showInactiveMessage = true;
                    }
                    else {
                        //If inactive and admin, show an inactive indicator:
                        if (!this.contributor.isActive) {
                            this.showInactiveIndicator = true;
                        }
                        this.dob = new Date(this.contributor.dob);
                        this.dob = this.months[this.dob.getMonth() - 1] + " " + (this.dob.getDate()) + ", " + this.dob.getFullYear();
                    }
                }
                else {
                    this.notFound = true;
                }
            });
        }

        public edit() {
            this.openEditModal(this.contributor.id);
        }

        public openEditModal(id) {
            this.$uibModal.open({
                templateUrl: 'ngApp/views/Modals/contributorEditModal.html',
                controller: ContributorEditController,
                controllerAs: 'vm',
                resolve: {
                    contributorId: () => id
                },
                backdrop: 'static',
                keyboard: false,
                size: "lg"
            });
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

    }
}