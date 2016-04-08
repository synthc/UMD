var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var SearchController = (function () {
            //public changeListVm;
            //public addStatus;
            //public hasInList = false;
            //public showListLink;
            //Search results are gotten directly from the media service
            function SearchController(MediaService, accountService) {
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.setUserInfo();
                //this.changeListVm = {};
            }
            SearchController.prototype.setUserInfo = function () {
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
            };
            return SearchController;
        })();
        Controllers.SearchController = SearchController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=SearchController.js.map