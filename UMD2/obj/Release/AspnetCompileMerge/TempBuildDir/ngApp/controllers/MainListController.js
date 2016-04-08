var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var MainListController = (function () {
            function MainListController($uibModal, MediaService, $location) {
                var _this = this;
                this.$uibModal = $uibModal;
                this.MediaService = MediaService;
                this.$location = $location;
                this.changeListVm = {};
                this.MediaService.getUser("thisUser").then(function (data) {
                    _this.user = data;
                    _this.masterList = _this.user.masterList;
                    if (_this.masterList.length == 0) {
                        _this.listEmpty = true;
                    }
                    //Get UserMedia for each media in the user's masterlist and add its data to the view model:
                    for (var j = 0; j < _this.masterList.length; j++) {
                        var i = 0;
                        var quit = false;
                        while (!quit && i < _this.masterList[j].userMedias.length) {
                            if (_this.masterList[j].userMedias[i].ownerId == _this.user.id) {
                                _this.masterList[j].rating = _this.masterList[j].userMedias[i].rating;
                                //let defaultDate = new Date(1800, 1, 1);
                                var startDate = new Date(_this.masterList[j].userMedias[i].startDate);
                                if (startDate.getFullYear() != 1800) {
                                    _this.masterList[j].startDateYear = startDate.getFullYear();
                                    _this.masterList[j].startDateMonth = startDate.getMonth() + 1;
                                    _this.masterList[j].startDateDay = startDate.getDate();
                                }
                                var endDate = new Date(_this.masterList[j].userMedias[i].endDate);
                                if (endDate.getFullYear() != 1800) {
                                    _this.masterList[j].endDateYear = endDate.getFullYear();
                                    _this.masterList[j].endDateMonth = endDate.getMonth() + 1;
                                    _this.masterList[j].endDateDay = endDate.getDate();
                                }
                                _this.masterList[j].tags = _this.masterList[j].userMedias[i].tags;
                                _this.masterList[j].reValue = _this.masterList[j].userMedias[i].reValue;
                                _this.masterList[j].reCount = _this.masterList[j].userMedias[i].reCount;
                                if (_this.masterList[j].type == "movie" || _this.masterList[j].type == "series") {
                                    _this.statusVerb = "Watch";
                                }
                                else if (_this.masterList[j].type == "game") {
                                    _this.statusVerb = "Play";
                                }
                                else if (_this.masterList[j].type == "book") {
                                    _this.statusVerb = "Read";
                                }
                                if (_this.masterList[j].userMedias[i].status == "past") {
                                    _this.masterList[j].status = "Completed";
                                }
                                else if (_this.masterList[j].userMedias[i].status == "present") {
                                    _this.masterList[j].status = _this.statusVerb + "ing";
                                }
                                else if (_this.masterList[j].userMedias[i].status == "future") {
                                    _this.masterList[j].status = "Plan to " + _this.statusVerb;
                                }
                                quit = true;
                            }
                            i++;
                        }
                    }
                });
            }
            MainListController.prototype.edit = function (mediaId) {
                var _this = this;
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/masterlistEditModal.html',
                    controller: MyApp.Controllers.MasterlistEditController,
                    controllerAs: 'vm',
                    resolve: {
                        mediaId: function () { return mediaId; },
                        userId: function () { return _this.user.id; }
                    },
                    backdrop: 'static',
                    size: 'lg',
                });
            };
            MainListController.prototype.remove = function (mediaId) {
                this.changeListVm.mediaId = mediaId;
                this.changeListVm.mode = "remove";
                this.MediaService.changeList(this.changeListVm).then(function (data) {
                    window.location.reload();
                });
            };
            return MainListController;
        })();
        Controllers.MainListController = MainListController;
        var MasterlistEditController = (function () {
            function MasterlistEditController(mediaId, userId, $uibModalInstance, MediaService) {
                var _this = this;
                this.mediaId = mediaId;
                this.userId = userId;
                this.$uibModalInstance = $uibModalInstance;
                this.MediaService = MediaService;
                this.media = {};
                this.media.userMedias = [];
                this.MediaService.getMediaById(mediaId).then(function (data) {
                    _this.media = data;
                    if (_this.media.type == "movie" || _this.media.type == "series") {
                        _this.statusVerb = "Watch";
                    }
                    else if (_this.media.type == "game") {
                        _this.statusVerb = "Play";
                    }
                    else if (_this.media.type == "book") {
                        _this.statusVerb = "Read";
                    }
                    var i = 0;
                    var quit = false;
                    while (!quit && i < _this.media.userMedias.length) {
                        if (_this.media.userMedias[i].ownerId == _this.userId) {
                            _this.userMedia = _this.media.userMedias[i];
                            quit = true;
                        }
                        i++;
                    }
                    //If inactive, set default values:
                    if (!_this.userMedia.isActive) {
                        _this.startDateYear = 2015;
                        _this.startDateMonth = 1;
                        _this.startDateDay = 1;
                        _this.endDateYear = 2015;
                        _this.endDateMonth = 1;
                        _this.endDateDay = 1;
                    }
                    else {
                        _this.rating = _this.userMedia.rating.toString();
                        _this.status = _this.userMedia.status;
                        var startDate = new Date(_this.userMedia.startDate);
                        _this.startDateYear = startDate.getFullYear();
                        _this.startDateMonth = startDate.getMonth() + 1;
                        _this.startDateDay = startDate.getDate();
                        var endDate = new Date(_this.userMedia.endDate);
                        _this.endDateYear = endDate.getFullYear();
                        _this.endDateMonth = endDate.getMonth() + 1;
                        _this.endDateDay = endDate.getDate();
                        _this.tags = _this.userMedia.tags;
                        _this.reValue = _this.userMedia.reValue.toString();
                        _this.reCount = _this.userMedia.reCount;
                    }
                });
            }
            MasterlistEditController.prototype.submit = function () {
                this.userMedia = {};
                this.userMedia.mediaId = this.media.id;
                this.userMedia.rating = Number(this.rating);
                this.userMedia.status = this.status;
                this.userMedia.tags = this.tags;
                this.userMedia.startDate = new Date(this.startDateYear, this.startDateMonth - 1, this.startDateDay);
                this.userMedia.endDate = new Date(this.endDateYear, this.endDateMonth - 1, this.endDateDay);
                this.userMedia.reCount = Number(this.reCount);
                this.userMedia.reValue = Number(this.reValue);
                this.MediaService.updateUserMedia(this.userMedia).then(function () {
                    window.location.reload();
                });
            };
            MasterlistEditController.prototype.close = function () {
                this.$uibModalInstance.close();
            };
            return MasterlistEditController;
        })();
        Controllers.MasterlistEditController = MasterlistEditController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=MainListController.js.map