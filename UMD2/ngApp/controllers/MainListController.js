var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var MainListController = (function () {
            function MainListController(MediaService, $location) {
                var _this = this;
                this.MediaService = MediaService;
                this.$location = $location;
                this.MediaService.getUser("thisUser").then(function (data) {
                    _this.query = {};
                    _this.user = data;
                    _this.masterList = _this.user.masterList;
                    _this.query.userName = _this.user.userName;
                    console.log(_this.user);
                });
            }
            MainListController.prototype.addToList = function () {
                this.query.query = this.titleToAdd;
                console.log(this.query.query);
                this.MediaService.addMediaByQuery(this.query);
                window.location.reload();
            };
            return MainListController;
        })();
        Controllers.MainListController = MainListController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=MainListController.js.map