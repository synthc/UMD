namespace MyApp.Controllers {

    export class SearchController {
        public isLoggedIn;
        public isAdmin;
        //public changeListVm;
        //public addStatus;
        //public hasInList = false;
        //public showListLink;

        constructor(private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService) {
            this.setUserInfo();
            //this.changeListVm = {};
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

        //public addToList(mediaId) {
        //    this.changeListVm.mediaId = mediaId;
        //    this.changeListVm.mode = "add";
        //    this.MediaService.changeList(this.changeListVm).then((data) => {
        //        this.addStatus = data.message;
        //        if (this.addStatus == "Success.") {
        //            this.hasInList = true;
        //            this.showListLink = true;
        //        }
        //    });
        //}
    }

}