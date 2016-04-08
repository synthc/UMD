namespace MyApp.Controllers {

    export class ReviewController {
        public media;
        public userId;
        public existingReview;
        public reviewWritten = false;
        public content;
        public review;
        
        constructor(private MediaService: MyApp.Services.MediaService, private $location: angular.ILocationService, private $routeParams: ng.route.IRouteParamsService) {
            this.review = {};
            this.MediaService.getMediaById(this.$routeParams['id']).then((data) => {
                this.media = data;

                this.MediaService.getUserId().then((data) => {
                    this.userId = data.message;
                    //If editing review, load old review data:
                    for (let i = 0; i < this.media.reviews.length; i++) {
                        if (this.media.reviews[i].ownerId == this.userId) {
                            this.existingReview = this.media.reviews[i];
                            this.content = this.existingReview.content;
                            this.review.score = this.existingReview.score.toString();
                            this.reviewWritten = true;
                        }
                    }
                    //If not editing review, check for an existing rating:
                    if (this.reviewWritten == false) {
                        for (let i = 0; i < this.media.userMedias.length; i++) {
                            if (this.media.userMedias[i].ownerId == this.userId) {
                                this.review.score = this.media.userMedias[i].rating.toString();
                            }
                        }
                    }
                });
            });
        }

        public submit() {
                this.review.content = this.content;
                this.review.mediaId = this.media.id;
                this.MediaService.addReview(this.review).then(() => {
                    this.$location.path('/entry/' + this.media.id);
                });
        }

        public cancel() {
            //if textarea is touched, warn and confirm
            this.$location.path('/entry/' + this.media.id);
        }
    }

}