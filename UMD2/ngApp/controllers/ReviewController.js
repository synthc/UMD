var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ReviewController = (function () {
            function ReviewController(MediaService, $location, $routeParams) {
                var _this = this;
                this.MediaService = MediaService;
                this.$location = $location;
                this.$routeParams = $routeParams;
                this.reviewWritten = false;
                this.review = {};
                this.MediaService.getMediaById(this.$routeParams['id']).then(function (data) {
                    _this.media = data;
                    _this.MediaService.getUserId().then(function (data) {
                        _this.userId = data.message;
                        //If editing review, load old review data:
                        for (var i = 0; i < _this.media.reviews.length; i++) {
                            if (_this.media.reviews[i].ownerId == _this.userId) {
                                _this.existingReview = _this.media.reviews[i];
                                _this.content = _this.existingReview.content;
                                _this.review.score = _this.existingReview.score.toString();
                                _this.reviewWritten = true;
                            }
                        }
                        //If not editing review, check for an existing rating:
                        if (_this.reviewWritten == false) {
                            for (var i = 0; i < _this.media.userMedias.length; i++) {
                                if (_this.media.userMedias[i].ownerId == _this.userId) {
                                    _this.review.score = _this.media.userMedias[i].rating.toString();
                                }
                            }
                        }
                        console.log(_this.existingReview);
                    });
                });
            }
            ReviewController.prototype.submit = function () {
                var _this = this;
                this.review.content = this.content;
                this.review.mediaId = this.media.id;
                this.MediaService.addReview(this.review).then(function () {
                    _this.$location.path('/entry/' + _this.media.id);
                });
            };
            ReviewController.prototype.cancel = function () {
                //if textarea is touched, warn and confirm
                this.$location.path('/entry/' + this.media.id);
            };
            return ReviewController;
        })();
        Controllers.ReviewController = ReviewController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=ReviewController.js.map