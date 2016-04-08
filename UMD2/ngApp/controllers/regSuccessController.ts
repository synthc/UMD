namespace MyApp.Controllers {

    export class regSuccessController {
        public isLoggedIn;
        public isAdmin;

        constructor(public accountService: MyApp.Services.AccountService, public $location: ng.ILocationService) {
            this.setUserInfo();

            //If the user logs in, redirect to home:
            if (this.isLoggedIn) {
                this.$location.path('/');
            }
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