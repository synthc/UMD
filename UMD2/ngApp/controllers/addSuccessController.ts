namespace MyApp.Controllers {

    export class AddSuccessController {
        public lastCreated;

        constructor(private MediaService: MyApp.Services.MediaService) {
            this.lastCreated = this.MediaService.lastCreated;
        }
    }

}