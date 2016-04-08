var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AddSuccessController = (function () {
            function AddSuccessController(MediaService) {
                this.MediaService = MediaService;
                this.lastCreated = this.MediaService.lastCreated;
                console.log(this.MediaService.lastCreated);
                console.log(this.lastCreated);
            }
            return AddSuccessController;
        })();
        Controllers.AddSuccessController = AddSuccessController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=addSuccessController.js.map