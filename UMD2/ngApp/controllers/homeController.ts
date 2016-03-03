namespace MyApp.Controllers {

    export class HomeController {
        public medias;
        public isLoggedIn;
        public isAdmin;

        constructor(private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService) {
            this.setUserInfo();

            this.MediaService.getMedia().then((data) => {
                this.medias = data;
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

        public debugSeed() {
            let cont = confirm("Are you sure?");
            if (cont) {
                this.MediaService.debugSeed();
            }
        }
    }

}