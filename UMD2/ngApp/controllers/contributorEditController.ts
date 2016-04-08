namespace MyApp.Controllers {

    export class ContributorEditController {
        public contributor;
        public dob;
        public year;
        public month;
        public day;
        public mResults;
        public contributionQuery;

        public genericVm;

        public isLoggedIn;
        public isAdmin = false;

        public addContributions = false;
        public showMResults = false;

        constructor(private contributorId, private MediaService: MyApp.Services.MediaService, private accountService: MyApp.Services.AccountService, private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, private $location: angular.ILocationService) {
            this.MediaService.getContributorById(this.contributorId).then((data) => {
                this.contributor = data;
                this.dob = new Date(this.contributor.dob);
                this.year = this.dob.getFullYear();
                this.month = this.dob.getMonth();
                this.day = this.dob.getDate();
            });

            this.setUserInfo();
            this.genericVm = {};
            this.contributionQuery = {};
            this.contributionQuery.query = "";
            this.contributionQuery.searchFor = "All";
            this.contributionQuery.searchBy = "Title";
        }

        public setUserInfo() {
            if (this.accountService.isLoggedIn() == null) {
                this.isLoggedIn = false;
                this.isAdmin = false;
            }
            else {
                this.isLoggedIn = true;
                if (this.accountService.getClaim("Admin") == null) {
                    this.isAdmin = false;
                }
                else {
                    this.isAdmin = true;
                }
            }
        }

        public saveChanges() {
            this.contributor.dob = new Date(this.year, this.month, this.day);
            this.MediaService.editContributor(this.contributor).then(() => {
                window.location.reload();
            });
        }

        public delete(mode: string) {
            this.genericVm.string1 = mode;
            this.genericVm.int1 = this.contributor.id;

            if (mode == 'soft') {
                this.MediaService.deleteContributor(this.genericVm).then(() => {
                    window.location.reload();
                });
            }
            else {
                let cont = confirm("This entry will be permanently deleted from the database. Continue?");
                if (cont) {
                    this.MediaService.deleteContributor(this.genericVm).then(() => {
                        this.closeModal();
                        window.history.back();
                        window.location.reload();
                    });
                }
            }
        }

        public setSearchParams(parameter: number, value: string) {
            if (parameter == 0) {
                this.contributionQuery.searchFor = value;
            }
            else {
                this.contributionQuery.searchBy = value;
            }
        }

        public searchContribution() {
            this.MediaService.search(this.contributionQuery).then((data) => {
                this.mResults = data.results;

                //Mark existing contributions to prevent them from showing up in the search results:
                for (let i = 0; i < this.mResults.length; i++) {
                    for (let j = 0; j < this.contributor.contributions.length; j++) {
                        if (this.mResults[i].id == this.contributor.contributions[j].id) {
                            this.mResults[i].added = true;
                        }
                    }
                }

                this.showMResults = true;
            });
        }

        public addContribution(index: number) {
            this.contributor.contributions.push(this.mResults[index]);
            this.mResults[index].added = true;
        }

        public removeContribution(index: number) {
            this.contributor.contributions[index].added = false;
            this.contributor.contributions.splice(index, 1);
        }

        public addToDb() {
            //if (form was touched or contributors were changed)
            let cont = confirm("Your changes will be lost. Continue?");
            if (cont) {
                this.closeModal();
                this.$location.path("/addtodb");
            }
        }

        public closeModal() {
            this.$uibModalInstance.close();
        }
    }

}