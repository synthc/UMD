namespace MyApp.Services {

    export class MediaService {
        private mediaResource;
        public lastCreated;
        public user;
        public token;

        public searchTransport;

        constructor(private $resource: ng.resource.IResourceService) {
            this.user = {};
            this.user.isLoggedIn = false;
            this.user.isAdmin = false;

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
                removeContributor: {
                    url: "/api/media/removeContributor",
                    method: "POST"
                },
                getUserId: {
                    url: "/api/media/getUserId",
                    method: "GET"
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

        public getCurrentUser() {
            return this.user;
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

        public deleteMedia(id) {
            this.mediaResource.delete({id: id});
        }

        public sortStaff(array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] == "director") {
                    //move to front
                }
            }
        }

        public debugSeed() {
            this.mediaResource.debugSeed();
        }
        
    }


    angular.module("MyApp").service("MediaService", MediaService);

}