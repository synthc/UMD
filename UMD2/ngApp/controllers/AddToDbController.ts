namespace MyApp.Controllers {

    export class AddToDbController {
        //Angular Fields for Media:
        public media;
        public selectedType;
        public year: number;
        public month: number;
        public day: number;
        public duration: number;
        public isAnimation;

        //Angular Fields for Contributor:
        public contributor;
        public contributorBYear;
        public contributorBMonth;
        public contributorBDay; 
        public contributorCounter = 0;

        //Switches:
        public manualAdd = false;
        public contributorCreated = false;
        public cont = true;

        //Newly Created Object From DB:
        public lastCreated;

        constructor(private MediaService: MyApp.Services.MediaService, private $location: angular.ILocationService) {
            this.media = {};
            this.contributor = {};
            this.media.contributors = [];

            //Define contributor object:
            this.clearContributorFields();

            //console.log(this.lastCreated);
        }

        public createMedia() {
            if (this.manualAdd && !this.contributorCreated) {
                this.cont = confirm("Your contributor will not be saved unless you click the 'submit contributor' button. \n\nContinue?");
            }
            if (this.cont) {
                //console.log(this.media.contributors);
                this.media.type = this.selectedType;
                this.media.isAnimation = JSON.parse(this.isAnimation);
                this.year = Number(this.year);
                this.month = Number(this.month);
                this.day = Number(this.day);
                this.media.releaseDate = new Date(this.year, this.month, this.day);
                this.media.duration = Number(this.duration);
                this.media.isActive = true;
                console.log(this.media);
                this.MediaService.createMedia(this.media).then((data) => {
                    this.MediaService.lastCreated = data;
                    console.log(this.MediaService.lastCreated);
                    this.$location.path('/addsuccess');
                    //console.log(this.MediaService.lastCreated);
                })
            }
        }

        public addContributorFromDb() {
            //this.contributor = contributor from database
            //this.addContributor();
        }

        public addContribution() {
            var contribution; // = get this from the database
            this.media.contributors[this.contributorCounter].contributions.push(contribution);
        }

        public submitContributor() {
            this.manualAdd = false;
            //clear contributor fields
            this.addContributor();
        }

        public addAnotherContributor() {
            //clear fields
            //this.createContributor();
            this.contributorCreated = false;
        }

        private addContributor() {
            //console.log("c count: " + this.contributorCounter);
            //console.log(this.contributor);
            this.media.contributors[this.contributorCounter] = this.contributor;
            this.media.contributors[this.contributorCounter].doB = new Date(this.contributorBYear, this.contributorBMonth, this.contributorBDay);
            this.clearContributorFields();
            this.contributorCreated = true;
            this.contributorCounter++;
        }

        public clearContributorFields() {
            this.contributor = {};
            this.contributorBDay = "";
            this.contributorBMonth = "";
            this.contributorBYear = "";
            this.contributor.roles = "";
            this.contributor.givenName = "";
            this.contributor.surName = "";
            this.contributor.nationality = "";
            this.contributor.websiteUrl = "";
            this.contributor.description = "";
            this.contributor.contributions = [];
        }

    }

}