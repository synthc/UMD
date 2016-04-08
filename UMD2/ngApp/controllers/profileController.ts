namespace MyApp.Controllers {

    export class ProfileController {
        public owner;

        constructor(private MediaService: MyApp.Services.MediaService, private $routeParams: ng.route.IRouteParamsService) {
            this.MediaService.getUserById(this.$routeParams['id']).then((data) => {
                this.owner = data;
                console.log(this.owner);
            });
        }
    }

}