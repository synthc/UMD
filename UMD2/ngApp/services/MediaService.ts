namespace MyApp.Services {

    export class MediaService {
        private mediaResource;
        public lastCreated; //the last media created
        public user;
        public token;
        public idContainer;

        public searchTransport; //transports search results between pages
        //public mediaTransport;

        constructor(private $resource: ng.resource.IResourceService) {
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

        public getMedia() {
            var data = this.mediaResource.query().$promise;
            return data;
        }

        public getMediaById(id: number) {
            return this.mediaResource.get({ id: id }).$promise;
        }

        public getContributorById(id: number) {
            this.idContainer.errorCode = id; //update this name and/or consolidate these into the GenericVm
            return this.mediaResource.getContributorById(this.idContainer).$promise;
        }

        public getCurrentUser() {
            return this.user;
        }

        public getUserById(id: string) {
            this.idContainer.message = id;
            return this.mediaResource.getUserById(this.idContainer).$promise;
        }

        public getUserId() {
            return this.mediaResource.getUserId().$promise;
        }

        public getUser(userName: string) {
            return this.mediaResource.get({ userName: userName }).$promise;
        }

        public createMedia(media) {
            return this.mediaResource.addToDb(media).$promise;
        }

        public search(query) {
            return this.mediaResource.search(query).$promise;
        }

        public changeList(addToListVm) {
            return this.mediaResource.changeList(addToListVm).$promise;
        }

        public checkMasterlist(checkListVm) {
            return this.mediaResource.checkMasterlist(checkListVm).$promise;
        }

        public updateUserMedia(userMedia) {
            return this.mediaResource.updateUserMedia(userMedia).$promise;
        }

        public addContributor(contributorVm) {
            return this.mediaResource.addContributor(contributorVm).$promise;
        }

        public removeContributor(contributorVm) {
            return this.mediaResource.removeContributor(contributorVm).$promise;
        }

        public editContributor(contributor) {
            return this.mediaResource.editContributor(contributor).$promise;
        }

        public deleteContributor(genericVm) {
            return this.mediaResource.deleteContributor(genericVm).$promise;
        }

        public addReview(review) {
            return this.mediaResource.addReview(review).$promise;
        }

        public getReviews(reviewVm) {
            return this.mediaResource.getReviews(reviewVm).$promise;
        }

        public deleteReview(reviewVm) {
            return this.mediaResource.deleteReview(reviewVm).$promise;
        }

        public deleteMedia(id) {
            this.mediaResource.delete({id: id});
        }

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

        public debugSeed() {
            this.mediaResource.debugSeed();
        }
        
    }


    angular.module("MyApp").service("MediaService", MediaService);

}