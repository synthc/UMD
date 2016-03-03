var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var DbListController = (function () {
            function DbListController(MediaService, $uibModal, $location) {
                this.MediaService = MediaService;
                this.$uibModal = $uibModal;
                this.$location = $location;
                this.medias = this.MediaService.getMedia();
            }
            DbListController.prototype.openEditModal = function (id) {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/Modals/dbEditModal.html',
                    controller: DbEditController,
                    controllerAs: 'vm',
                    resolve: {
                        mediaId: function () { return id; }
                    },
                    size: "lg"
                });
            };
            return DbListController;
        })();
        Controllers.DbListController = DbListController;
        angular.module('MyApp').controller('DbListController', DbListController);
        var DbEditController = (function () {
            function DbEditController(mediaId, MediaService, $uibModalInstance) {
                var _this = this;
                this.mediaId = mediaId;
                this.MediaService = MediaService;
                this.$uibModalInstance = $uibModalInstance;
                this.MediaService.getMediaById(this.mediaId).$promise.then(function (data) {
                    _this.media = data;
                    //Need logic to do initialized appropriate properties based on media type
                    _this.selectedType = _this.media.type;
                    _this.releaseDate = new Date(_this.media.releaseDate);
                    _this.year = _this.releaseDate.getFullYear();
                    _this.month = _this.releaseDate.getMonth();
                    _this.day = _this.releaseDate.getDay();
                    _this.isAnimation = _this.media.isAnimation.toString();
                    _this.duration = _this.media.duration;
                });
            }
            DbEditController.prototype.updateEntry = function () {
                this.media.type = this.selectedType;
                this.media.isAnimation = JSON.parse(this.isAnimation);
                this.media.Year = Number(this.year);
                this.media.Month = Number(this.month);
                this.media.Day = Number(this.day);
                this.media.duration = Number(this.duration);
                this.media.isActive = true;
                this.MediaService.createMedia(this.media);
                this.closeModal();
                window.location.reload();
            };
            DbEditController.prototype.deleteRestore = function () {
                this.media.deleteRestore = true;
                this.MediaService.createMedia(this.media);
                this.closeModal();
                window.location.reload();
            };
            DbEditController.prototype.hardDelete = function () {
                var cont = confirm("This entry will be permanently deleted from the database. Continue?");
                if (cont) {
                    this.MediaService.deleteMedia(this.media.id);
                    window.location.reload();
                }
            };
            DbEditController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
            };
            return DbEditController;
        })();
        Controllers.DbEditController = DbEditController;
        angular.module('MyApp').controller('DbEditController', DbEditController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=dbListController.js.map