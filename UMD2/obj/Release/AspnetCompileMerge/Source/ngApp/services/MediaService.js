var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        var MediaService = (function () {
            //public mediaTransport;
            function MediaService($resource) {
                this.$resource = $resource;
                this.user = {};
                this.user.isLoggedIn = false;
                this.user.isAdmin = false;
                this.idContainer = {};
                this.mediaResource = $resource('api/media/:id', null, {
                    addToDb: {
                        url: "/api/media/addToDb",
                        method: "POST"
                    },
                    search: {
                        url: "/api/media/search",
                        method: "POST"
                    },
                    changeList: {
                        url: "/api/media/changeList",
                        method: "POST"
                    },
                    checkMasterlist: {
                        url: "/api/media/checkMasterlist",
                        method: "POST"
                    },
                    updateUserMedia: {
                        url: "/api/media/updateUserMedia",
                        method: "POST"
                    },
                    addContributor: {
                        url: "/api/media/addContributor",
                        method: "POST"
                    },
                    addReview: {
                        url: "/api/media/addReview",
                        method: "POST"
                    },
                    getReviews: {
                        url: "/api/media/getReviews",
                        method: "POST"
                    },
                    deleteReview: {
                        url: "/api/media/deleteReview",
                        method: "DELETE"
                    },
                    removeContributor: {
                        url: "/api/media/removeContributor",
                        method: "POST"
                    },
                    editContributor: {
                        url: "/api/media/editContributor",
                        method: "POST"
                    },
                    deleteContributor: {
                        url: "/api/media/deleteContributor",
                        method: "POST"
                    },
                    getUserId: {
                        url: "/api/media/getUserId",
                        method: "GET"
                    },
                    getUserById: {
                        url: "/api/media/getUserById",
                        method: "POST"
                    },
                    getContributorById: {
                        url: "/api/media/getContributorById",
                        method: "POST"
                    },
                    delete: {
                        url: "/api/media/delete",
                        method: "DELETE"
                    },
                    debugSeed: {
                        url: "/api/media/debugSeed",
                        method: "POST"
                    }
                });
            }
            MediaService.prototype.getMedia = function () {
                var data = this.mediaResource.query().$promise;
                return data;
            };
            MediaService.prototype.getMediaById = function (id) {
                return this.mediaResource.get({ id: id }).$promise;
            };
            MediaService.prototype.getContributorById = function (id) {
                this.idContainer.errorCode = id;
                return this.mediaResource.getContributorById(this.idContainer).$promise;
            };
            MediaService.prototype.getCurrentUser = function () {
                return this.user;
            };
            MediaService.prototype.getUserById = function (id) {
                this.idContainer.message = id;
                return this.mediaResource.getUserById(this.idContainer).$promise;
            };
            MediaService.prototype.getUserId = function () {
                return this.mediaResource.getUserId().$promise;
            };
            MediaService.prototype.getUser = function (userName) {
                return this.mediaResource.get({ userName: userName }).$promise;
            };
            MediaService.prototype.createMedia = function (media) {
                return this.mediaResource.addToDb(media).$promise;
            };
            MediaService.prototype.search = function (query) {
                return this.mediaResource.search(query).$promise;
            };
            MediaService.prototype.changeList = function (addToListVm) {
                return this.mediaResource.changeList(addToListVm).$promise;
            };
            MediaService.prototype.checkMasterlist = function (checkListVm) {
                return this.mediaResource.checkMasterlist(checkListVm).$promise;
            };
            MediaService.prototype.updateUserMedia = function (userMedia) {
                return this.mediaResource.updateUserMedia(userMedia).$promise;
            };
            MediaService.prototype.addContributor = function (contributorVm) {
                return this.mediaResource.addContributor(contributorVm).$promise;
            };
            MediaService.prototype.removeContributor = function (contributorVm) {
                return this.mediaResource.removeContributor(contributorVm).$promise;
            };
            MediaService.prototype.editContributor = function (contributor) {
                return this.mediaResource.editContributor(contributor).$promise;
            };
            MediaService.prototype.deleteContributor = function (genericVm) {
                return this.mediaResource.deleteContributor(genericVm).$promise;
            };
            MediaService.prototype.addReview = function (review) {
                return this.mediaResource.addReview(review).$promise;
            };
            MediaService.prototype.getReviews = function (reviewVm) {
                return this.mediaResource.getReviews(reviewVm).$promise;
            };
            MediaService.prototype.deleteReview = function (reviewVm) {
                return this.mediaResource.deleteReview(reviewVm).$promise;
            };
            MediaService.prototype.deleteMedia = function (id) {
                this.mediaResource.delete({ id: id });
            };
            //public storeMedia(media) {
            //    return localStorage.setItem("mediaTransport", media);
            //}
            //public getMediaTransport() {
            //    return localStorage.getItem("mediaTransport").$promise;
            //}
            //public sortStaff(array) {
            //    for (let i = 0; i < array.length; i++) {
            //        if (array[i] == "director") {
            //            //move to front
            //        }
            //    }
            //}
            MediaService.prototype.debugSeed = function () {
                this.mediaResource.debugSeed();
            };
            return MediaService;
        })();
        Services.MediaService = MediaService;
        angular.module("MyApp").service("MediaService", MediaService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=MediaService.js.map