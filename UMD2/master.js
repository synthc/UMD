var MyApp;
(function (MyApp) {
    angular.module('MyApp', ['ngRoute', 'ngResource', 'ui.bootstrap']).config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
            templateUrl: '/ngApp/views/home.html',
            controller: MyApp.Controllers.HomeController,
            controllerAs: 'vm'
        })
            .when('/entry/:id', {
            templateUrl: '/ngApp/views/entry.html',
            controller: MyApp.Controllers.EntryController,
            controllerAs: 'vm'
        })
            .when('/search', {
            templateUrl: '/ngApp/views/search.html',
            controller: MyApp.Controllers.SearchController,
            controllerAs: 'vm'
        })
            .when('/profile/:id', {
            templateUrl: '/ngApp/views/profile.html',
            controller: MyApp.Controllers.ProfileController,
            controllerAs: 'vm'
        })
            .when('/contributor/:id', {
            templateUrl: '/ngApp/views/contributor.html',
            controller: MyApp.Controllers.ContributorController,
            controllerAs: 'vm'
        })
            .when('/mylist', {
            templateUrl: '/ngApp/views/myList.html',
            controller: MyApp.Controllers.MainListController,
            controllerAs: 'vm'
        })
            .when('/addtodb', {
            templateUrl: '/ngApp/views/addToDatabase.html',
            controller: MyApp.Controllers.AddToDbController,
            controllerAs: 'vm'
        })
            .when('/review/:id', {
            templateUrl: '/ngApp/views/review.html',
            controller: MyApp.Controllers.ReviewController,
            controllerAs: 'vm'
        })
            .when('/addsuccess', {
            templateUrl: 'ngApp/views/addSuccess.html',
            controller: MyApp.Controllers.AddSuccessController,
            controllerAs: 'vm'
        })
            .when('/login', {
            templateUrl: '/ngApp/views/login.html',
            controller: MyApp.Controllers.LoginController,
            controllerAs: 'controller'
        })
            .when('/register', {
            templateUrl: '/ngApp/views/register.html',
            controller: MyApp.Controllers.RegisterController,
            controllerAs: 'controller'
        })
            .when('/registersuccess', {
            templateUrl: '/ngApp/views/registerSuccess.html',
            controller: MyApp.Controllers.regSuccessController,
            controllerAs: 'vm'
        })
            .when('/about', {
            templateUrl: '/ngApp/views/about.html',
            controller: MyApp.Controllers.AboutController,
            controllerAs: 'vm'
        })
            .when('/tour', {
            templateUrl: '/ngApp/views/tour.html',
        })
            .when('/debug/dblist', {
            templateUrl: '/ngApp/views/databaseList.html',
            controller: MyApp.Controllers.DbListController,
            controllerAs: 'vm'
        })
            .when('/movies', {
            templateUrl: '/ngApp/views/movies.html',
            controller: MyApp.Controllers.MoviesController,
            controllerAs: 'vm'
        })
            .when('/series', {
            templateUrl: '/ngApp/views/series.html',
            controller: MyApp.Controllers.SeriesController,
            controllerAs: 'vm'
        })
            .when('/games', {
            templateUrl: '/ngApp/views/games.html',
            controller: MyApp.Controllers.GamesController,
            controllerAs: 'vm'
        })
            .when('/books', {
            templateUrl: '/ngApp/views/books.html',
            controller: MyApp.Controllers.BooksController,
            controllerAs: 'vm'
        })
            .when('/music', {
            templateUrl: '/ngApp/views/music.html',
            controller: MyApp.Controllers.MusicController,
            controllerAs: 'vm'
        })
            .when('/art', {
            templateUrl: '/ngApp/views/art.html',
            controller: MyApp.Controllers.ArtController,
            controllerAs: 'vm'
        })
            .when('/externalLogin', {
            templateUrl: '/ngApp/views/externalLogin.html',
            controller: MyApp.Controllers.ExternalLoginController,
            controllerAs: 'controller'
        })
            .when('/externalRegister', {
            templateUrl: '/ngApp/views/externalRegister.html',
            controller: MyApp.Controllers.ExternalRegisterController,
            controllerAs: 'controller'
        })
            .when('/confirmEmail', {
            templateUrl: '/ngApp/views/confirmEmail.html',
            controller: MyApp.Controllers.ConfirmEmailController,
            controllerAs: 'controller'
        })
            .otherwise({
            templateUrl: '/ngApp/views/notFound.html'
        });
        $locationProvider.html5Mode(true);
    });
    angular.module('MyApp').factory('authInterceptor', function ($q, $window, $location) {
        return ({
            request: function (config) {
                config.headers = config.headers || {};
                var token = $window.sessionStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                }
                return response || $q.when(response);
            }
        });
    });
    angular.module('MyApp').config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
})(MyApp || (MyApp = {}));
/// <reference path="ngapp/app.ts" /> 
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AboutController = (function () {
            function AboutController() {
            }
            return AboutController;
        })();
        Controllers.AboutController = AboutController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AccountController = (function () {
            function AccountController(accountService, MediaService, $location) {
                var _this = this;
                this.accountService = accountService;
                this.MediaService = MediaService;
                this.$location = $location;
                this.getExternalLogins().then(function (results) {
                    _this.externalLogins = results;
                });
            }
            AccountController.prototype.getClaim = function (type) {
                return this.accountService.getClaim(type);
            };
            AccountController.prototype.isLoggedIn = function () {
                return this.accountService.isLoggedIn();
            };
            AccountController.prototype.logout = function () {
                this.accountService.logout();
                this.MediaService.user.isLoggedIn = false;
            };
            AccountController.prototype.getExternalLogins = function () {
                return this.accountService.getExternalLogins();
            };
            return AccountController;
        })();
        Controllers.AccountController = AccountController;
        angular.module('MyApp').controller('AccountController', AccountController);
        var LoginController = (function () {
            function LoginController($uibModalInstance, accountService, $location) {
                this.$uibModalInstance = $uibModalInstance;
                this.accountService = accountService;
                this.$location = $location;
            }
            LoginController.prototype.login = function () {
                var _this = this;
                this.previousLocation = window.location.pathname;
                this.accountService.login(this.loginUser).then(function () {
                    _this.$location.path(_this.previousLocation);
                }).catch(function (results) {
                    _this.validationMessages = results;
                });
            };
            LoginController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
            };
            return LoginController;
        })();
        Controllers.LoginController = LoginController;
        var RegisterController = (function () {
            function RegisterController(accountService, $location) {
                this.accountService = accountService;
                this.$location = $location;
            }
            RegisterController.prototype.register = function () {
                var _this = this;
                this.accountService.register(this.registerUser).then(function () {
                    _this.$location.path('/registersuccess');
                }).catch(function (results) {
                    _this.validationMessages = results;
                });
            };
            return RegisterController;
        })();
        Controllers.RegisterController = RegisterController;
        var ExternalLoginController = (function () {
            function ExternalLoginController($http, $location, accountService) {
                this.$location = $location;
                this.accountService = accountService;
                // if the user is already registered then redirect home else register
                var response = accountService.parseOAuthResponse($location.hash());
                var externalAccessToken = response['access_token'];
                accountService.getUserInfo(externalAccessToken).then(function (userInfo) {
                    if (userInfo.hasRegistered) {
                        accountService.storeUserInfo(response);
                        $location.path('/');
                    }
                    else {
                        $location.path('/externalRegister');
                    }
                });
            }
            return ExternalLoginController;
        })();
        Controllers.ExternalLoginController = ExternalLoginController;
        var ExternalRegisterController = (function () {
            function ExternalRegisterController(accountService, $location) {
                this.accountService = accountService;
                this.$location = $location;
                var response = accountService.parseOAuthResponse($location.hash());
                this.externalAccessToken = response['access_token'];
            }
            ExternalRegisterController.prototype.register = function () {
                var _this = this;
                this.accountService.registerExternal(this.registerUser.email, this.externalAccessToken)
                    .then(function (result) {
                    _this.$location.path('/login');
                }).catch(function (result) {
                    _this.validationMessages = result;
                });
            };
            return ExternalRegisterController;
        })();
        Controllers.ExternalRegisterController = ExternalRegisterController;
        var ConfirmEmailController = (function () {
            function ConfirmEmailController(accountService, $http, $routeParams, $location) {
                var _this = this;
                this.accountService = accountService;
                this.$http = $http;
                this.$routeParams = $routeParams;
                this.$location = $location;
                var userId = $routeParams['userId'];
                var code = $routeParams['code'];
                accountService.confirmEmail(userId, code)
                    .then(function (result) {
                    _this.$location.path('/');
                }).catch(function (result) {
                    _this.validationMessages = result;
                });
            }
            return ConfirmEmailController;
        })();
        Controllers.ConfirmEmailController = ConfirmEmailController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AddSuccessController = (function () {
            function AddSuccessController(MediaService) {
                this.MediaService = MediaService;
                this.lastCreated = this.MediaService.lastCreated;
            }
            return AddSuccessController;
        })();
        Controllers.AddSuccessController = AddSuccessController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var AddToDbController = (function () {
            function AddToDbController(MediaService, $location, $uibModal) {
                this.MediaService = MediaService;
                this.$location = $location;
                this.$uibModal = $uibModal;
                this.contributorCounter = 0;
                //Switches:
                this.manualAdd = false;
                this.contributorCreated = false;
                this.cont = true;
                this.validationError = false;
                this.contributorValidationError = false;
                this.dateRangeError = false;
                this.contributorSelected = false;
                this.searchContributions = false;
                this.showMResults = false;
                this.media = {};
                this.contributor = {};
                this.contributor.contributions = [];
                this.media.contributors = [];
                this.query = {};
                this.query.query = "";
                this.contributionQuery = {};
                this.contributionQuery.query = "";
                this.contributionQuery.searchFor = "All";
                this.contributionQuery.searchBy = "Title";
                //Define contributor object:
                this.clearContributorFields();
            }
            AddToDbController.prototype.createMedia = function () {
                var _this = this;
                //Check to make sure there are no unsubmitted contributors:
                if (this.manualAdd && !this.contributorCreated) {
                    this.cont = confirm("Your contributor will not be saved unless you click the 'submit contributor' button. \n\nContinue?");
                }
                else {
                    this.cont = true;
                }
                if (this.cont) {
                    this.year = Number(this.year);
                    this.month = Number(this.month) - 1;
                    this.day = Number(this.day);
                    //Validate dates:
                    if (this.year > 2100 || this.year < 1753) {
                        this.dateRangeError = true;
                    }
                    else if (this.month > 11 || this.month < 1) {
                        this.dateRangeError = true;
                    }
                    else if (this.day > 31 || this.day < 1) {
                        this.dateRangeError = true;
                    }
                    else {
                        this.dateRangeError = false;
                    }
                    if (!this.dateRangeError) {
                        this.media.type = this.selectedType;
                        this.media.isAnimation = JSON.parse(this.isAnimation);
                        this.media.releaseDate = new Date(this.year, this.month, this.day);
                        this.media.duration = Number(this.duration);
                        this.media.isActive = true;
                        this.MediaService.createMedia(this.media).then(function (data) {
                            _this.MediaService.lastCreated = data;
                            _this.$location.path('/addsuccess');
                        });
                    }
                }
            };
            AddToDbController.prototype.submitContributor = function () {
                //Validate contributor fields:
                if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                    this.contributorValidationError = true;
                }
                else {
                    this.contributorValidationError = false;
                    this.manualAdd = false;
                    this.addContributor();
                }
            };
            AddToDbController.prototype.addContributor = function () {
                this.contributor.doB = new Date(this.contributorBYear, this.contributorBMonth - 1, this.contributorBDay);
                this.contributor.isActive = true;
                this.media.contributors[this.contributorCounter] = this.contributor;
                this.clearContributorFields();
                this.contributorCreated = true;
                this.contributorCounter++;
            };
            AddToDbController.prototype.addAnotherContributor = function () {
                //Validate contributor fields:
                if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                    this.contributorValidationError = true;
                }
                else {
                    this.contributorValidationError = false;
                    this.addContributor();
                    this.clearContributorFields();
                    this.contributorCreated = false;
                }
            };
            AddToDbController.prototype.cancelContributor = function () {
                this.manualAdd = false;
            };
            AddToDbController.prototype.searchForContributor = function () {
                var _this = this;
                this.query.searchFor = "People";
                this.MediaService.search(this.query).then(function (data) {
                    _this.cResults = data.cResults;
                    //Mark items that have already been added:
                    for (var i = 0; i < _this.cResults.length; i++) {
                        for (var j = 0; j < _this.media.contributors.length; j++) {
                            if (_this.cResults[i].id == _this.media.contributors[j].id) {
                                _this.cResults[i].added = true;
                            }
                        }
                    }
                });
            };
            AddToDbController.prototype.addContributorFromDb = function (index) {
                if (!this.manualAdd) {
                    this.contributor = this.cResults[index];
                    this.media.contributors[this.contributorCounter] = this.contributor;
                    this.contributorCounter++;
                    this.cResults[index].added = true;
                }
                else {
                    alert("You must complete or cancel adding a contributor manually first.");
                }
            };
            AddToDbController.prototype.removeContributor = function (index) {
                this.media.contributors[index].added = false;
                this.media.contributors.splice(index, 1);
                this.contributorCounter--;
            };
            AddToDbController.prototype.setSearchParams = function (parameter, value) {
                if (parameter == 0) {
                    this.contributionQuery.searchFor = value;
                }
                else {
                    this.contributionQuery.searchBy = value;
                }
            };
            AddToDbController.prototype.searchContribution = function () {
                var _this = this;
                this.MediaService.search(this.contributionQuery).then(function (data) {
                    _this.mResults = data.results;
                    _this.showMResults = true;
                });
            };
            AddToDbController.prototype.addContribution = function (index) {
                this.contributor.contributions.push(this.mResults[index]);
                this.mResults[index].added = true;
            };
            AddToDbController.prototype.removeContribution = function (index) {
                this.contributor.contributions[index].added = false;
                this.contributor.contributions.splice(index, 1);
            };
            AddToDbController.prototype.setManualAdd = function () {
                this.manualAdd = true;
                this.clearContributorFields();
            };
            AddToDbController.prototype.showValidationErrors = function () {
                this.validationError = true;
            };
            AddToDbController.prototype.clearContributorFields = function () {
                this.contributor = {};
                this.contributorBDay = "";
                this.contributorBMonth = "";
                this.contributorBYear = "";
                this.contributor.roles = "";
                this.contributor.givenName = "";
                this.contributor.surname = "";
                this.contributor.nationality = "";
                this.contributor.websiteUrl = "";
                this.contributor.description = "";
                this.contributor.contributions = [];
            };
            return AddToDbController;
        })();
        Controllers.AddToDbController = AddToDbController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ArtController = (function () {
            function ArtController() {
            }
            return ArtController;
        })();
        Controllers.ArtController = ArtController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var BooksController = (function () {
            function BooksController() {
            }
            return BooksController;
        })();
        Controllers.BooksController = BooksController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ContributorController = (function () {
            function ContributorController(MediaService, accountService, $routeParams, $uibModal) {
                var _this = this;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$routeParams = $routeParams;
                this.$uibModal = $uibModal;
                this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                this.notFound = false;
                this.showInactiveMessage = false;
                this.showInactiveIndicator = false;
                this.setUserInfo();
                this.MediaService.getContributorById(this.$routeParams['id']).then(function (data) {
                    _this.contributor = data;
                    //If contributor exists:
                    if (_this.contributor.id != undefined) {
                        //If inactive and not admin, hide the page:
                        if (!_this.contributor.isActive && !_this.isAdmin) {
                            _this.showInactiveMessage = true;
                        }
                        else {
                            //If inactive and admin, show an inactive indicator:
                            if (!_this.contributor.isActive) {
                                _this.showInactiveIndicator = true;
                            }
                            _this.dob = new Date(_this.contributor.dob);
                            _this.dob = _this.months[_this.dob.getMonth() - 1] + " " + (_this.dob.getDate()) + ", " + _this.dob.getFullYear();
                        }
                    }
                    else {
                        _this.notFound = true;
                    }
                });
            }
            ContributorController.prototype.edit = function () {
                this.openEditModal(this.contributor.id);
            };
            ContributorController.prototype.openEditModal = function (id) {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/Modals/contributorEditModal.html',
                    controller: Controllers.ContributorEditController,
                    controllerAs: 'vm',
                    resolve: {
                        contributorId: function () { return id; }
                    },
                    backdrop: 'static',
                    keyboard: false,
                    size: "lg"
                });
            };
            ContributorController.prototype.setUserInfo = function () {
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
            };
            return ContributorController;
        })();
        Controllers.ContributorController = ContributorController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ContributorEditController = (function () {
            function ContributorEditController(contributorId, MediaService, accountService, $uibModalInstance, $location) {
                var _this = this;
                this.contributorId = contributorId;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$uibModalInstance = $uibModalInstance;
                this.$location = $location;
                this.isAdmin = false;
                this.addContributions = false;
                this.showMResults = false;
                this.MediaService.getContributorById(this.contributorId).then(function (data) {
                    _this.contributor = data;
                    _this.dob = new Date(_this.contributor.dob);
                    _this.year = _this.dob.getFullYear();
                    _this.month = _this.dob.getMonth();
                    _this.day = _this.dob.getDate();
                });
                this.setUserInfo();
                this.genericVm = {};
                this.contributionQuery = {};
                this.contributionQuery.query = "";
                this.contributionQuery.searchFor = "All";
                this.contributionQuery.searchBy = "Title";
            }
            ContributorEditController.prototype.setUserInfo = function () {
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
            };
            ContributorEditController.prototype.saveChanges = function () {
                this.contributor.dob = new Date(this.year, this.month, this.day);
                this.MediaService.editContributor(this.contributor).then(function () {
                    window.location.reload();
                });
            };
            ContributorEditController.prototype.delete = function (mode) {
                var _this = this;
                this.genericVm.string1 = mode;
                this.genericVm.int1 = this.contributor.id;
                if (mode == 'soft') {
                    this.MediaService.deleteContributor(this.genericVm).then(function () {
                        window.location.reload();
                    });
                }
                else {
                    var cont = confirm("This entry will be permanently deleted from the database. Continue?");
                    if (cont) {
                        this.MediaService.deleteContributor(this.genericVm).then(function () {
                            _this.closeModal();
                            window.history.back();
                            window.location.reload();
                        });
                    }
                }
            };
            ContributorEditController.prototype.setSearchParams = function (parameter, value) {
                if (parameter == 0) {
                    this.contributionQuery.searchFor = value;
                }
                else {
                    this.contributionQuery.searchBy = value;
                }
            };
            ContributorEditController.prototype.searchContribution = function () {
                var _this = this;
                this.MediaService.search(this.contributionQuery).then(function (data) {
                    _this.mResults = data.results;
                    //Mark existing contributions to prevent them from showing up in the search results:
                    for (var i = 0; i < _this.mResults.length; i++) {
                        for (var j = 0; j < _this.contributor.contributions.length; j++) {
                            if (_this.mResults[i].id == _this.contributor.contributions[j].id) {
                                _this.mResults[i].added = true;
                            }
                        }
                    }
                    _this.showMResults = true;
                });
            };
            ContributorEditController.prototype.addContribution = function (index) {
                this.contributor.contributions.push(this.mResults[index]);
                this.mResults[index].added = true;
            };
            ContributorEditController.prototype.removeContribution = function (index) {
                this.contributor.contributions[index].added = false;
                this.contributor.contributions.splice(index, 1);
            };
            ContributorEditController.prototype.addToDb = function () {
                //if (form was touched or contributors were changed)
                var cont = confirm("Your changes will be lost. Continue?");
                if (cont) {
                    this.closeModal();
                    this.$location.path("/addtodb");
                }
            };
            ContributorEditController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
            };
            return ContributorEditController;
        })();
        Controllers.ContributorEditController = ContributorEditController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
//namespace MyApp.Controllers {
//    export class HomeController {
//        public movies;
//        constructor
//        (
//            private movieService: MyApp.Services.MovieService,
//            private $location: angular.ILocationService
//        ) {
//            this.movies = this.movieService.listMovies();
//        }
//    }
//    export class AboutController {
//    }
//} 
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        //This controller is currently unused:
        var DbListController = (function () {
            function DbListController(MediaService, $uibModal, $location) {
                var _this = this;
                this.MediaService = MediaService;
                this.$uibModal = $uibModal;
                this.$location = $location;
                this.MediaService.getMedia().then(function (data) {
                    _this.medias = data;
                });
            }
            DbListController.prototype.openEditModal = function (id) {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/Modals/dbEditModal.html',
                    controller: DbEditController,
                    controllerAs: 'vm',
                    resolve: {
                        mediaId: function () { return id; }
                    },
                    backdrop: 'static',
                    keyboard: false,
                    size: "lg"
                });
            };
            return DbListController;
        })();
        Controllers.DbListController = DbListController;
        angular.module('MyApp').controller('DbListController', DbListController);
        //TODO: move this controller into its own file
        var DbEditController = (function () {
            function DbEditController(mediaId, MediaService, accountService, $uibModalInstance, $routeParams) {
                var _this = this;
                this.mediaId = mediaId;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$uibModalInstance = $uibModalInstance;
                this.$routeParams = $routeParams;
                this.contributorCounter = 0;
                //Switches:
                this.manualAdd = false;
                this.contributorCreated = false;
                this.cont = true;
                this.validationError = false;
                this.contributorValidationError = false;
                this.dateRangeError = false;
                this.contributorSelected = false;
                this.searchContributions = false;
                this.showMResults = false;
                this.media = {};
                this.contributor = {};
                this.media.contributors = [];
                this.query = {};
                this.query.query = "";
                this.contributionQuery = {};
                this.contributionQuery.query = "";
                this.contributionQuery.searchFor = "All";
                this.contributionQuery.searchBy = "Title";
                this.setUserInfo();
                //Define contributor object:
                this.clearContributorFields();
                this.MediaService.getMediaById(this.mediaId).then(function (data) {
                    _this.media = data;
                    //Need logic to initialize appropriate properties based on media type
                    _this.selectedType = _this.media.type;
                    _this.releaseDate = new Date(_this.media.releaseDate);
                    _this.year = _this.releaseDate.getFullYear();
                    _this.month = _this.releaseDate.getMonth();
                    _this.day = _this.releaseDate.getDate();
                    _this.isAnimation = _this.media.isAnimation.toString();
                    _this.duration = _this.media.duration;
                    _this.contributorCounter = _this.media.contributors.length;
                });
            }
            DbEditController.prototype.updateEntry = function () {
                this.media.type = this.selectedType;
                this.media.isAnimation = JSON.parse(this.isAnimation);
                this.media.year = Number(this.year);
                this.media.month = Number(this.month);
                this.media.day = Number(this.day);
                this.media.releaseDate = new Date(this.media.year, this.media.month, this.media.day);
                this.media.duration = Number(this.duration);
                this.media.contributorCreated = this.contributorCreated;
                this.media.isActive = true;
                this.MediaService.createMedia(this.media).then(function () {
                    window.location.reload();
                });
            };
            DbEditController.prototype.setUserInfo = function () {
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
            };
            DbEditController.prototype.deleteRestore = function () {
                this.media.deleteRestore = true;
                this.MediaService.createMedia(this.media);
                this.closeModal();
                window.location.reload();
            };
            DbEditController.prototype.hardDelete = function () {
                var cont = confirm("This entry will be permanently deleted from the database. Continue?");
                if (cont) {
                    this.MediaService.deleteMedia(this.media.id);
                    this.closeModal();
                    window.history.back();
                    window.location.reload();
                }
            };
            DbEditController.prototype.closeModal = function () {
                this.$uibModalInstance.close();
            };
            DbEditController.prototype.submitContributor = function () {
                //Validate contributor fields:
                if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                    console.log(this.contributor);
                    this.contributorValidationError = true;
                }
                else {
                    this.contributorValidationError = false;
                    this.manualAdd = false;
                    this.addContributor();
                }
            };
            DbEditController.prototype.addContributor = function () {
                this.contributor.doB = new Date(this.contributorBYear, this.contributorBMonth - 1, this.contributorBDay);
                this.contributor.isActive = true;
                this.media.contributors[this.contributorCounter] = this.contributor;
                this.clearContributorFields();
                this.contributorCreated = true;
                this.contributorCounter++;
            };
            DbEditController.prototype.addAnotherContributor = function () {
                //Validate contributor fields:
                if (this.contributor.roles == "" || this.contributor.givenName == "" || this.contributor.surname == "" || this.contributorBYear == "" || this.contributorBMonth == "" || this.contributorBDay == "" || this.contributor.nationality == "") {
                    console.log(this.contributor);
                    this.contributorValidationError = true;
                }
                else {
                    this.contributorValidationError = false;
                    this.addContributor();
                    this.clearContributorFields();
                    this.contributorCreated = false;
                }
            };
            DbEditController.prototype.cancelContributor = function () {
                this.manualAdd = false;
            };
            DbEditController.prototype.searchForContributor = function () {
                var _this = this;
                this.query.searchFor = "People";
                this.MediaService.search(this.query).then(function (data) {
                    _this.cResults = data.cResults;
                    //Mark items that have already been added:
                    for (var i = 0; i < _this.cResults.length; i++) {
                        for (var j = 0; j < _this.media.contributors.length; j++) {
                            if (_this.cResults[i].id == _this.media.contributors[j].id) {
                                _this.cResults[i].added = true;
                            }
                        }
                    }
                });
            };
            DbEditController.prototype.addContributorFromDb = function (index) {
                if (!this.manualAdd) {
                    this.contributor = this.cResults[index];
                    this.media.contributors[this.contributorCounter] = this.contributor;
                    this.contributorCounter++;
                    this.cResults[index].added = true;
                }
                else {
                    alert("You must complete or cancel adding a contributor manually first.");
                }
            };
            DbEditController.prototype.removeContributor = function (index) {
                this.media.contributors[index].added = false;
                this.media.contributors.splice(index, 1);
                this.contributorCounter--;
            };
            DbEditController.prototype.setSearchParams = function (parameter, value) {
                if (parameter == 0) {
                    this.contributionQuery.searchFor = value;
                }
                else {
                    this.contributionQuery.searchBy = value;
                }
            };
            DbEditController.prototype.searchContribution = function () {
                var _this = this;
                this.MediaService.search(this.contributionQuery).then(function (data) {
                    _this.mResults = data.results;
                    _this.showMResults = true;
                });
            };
            DbEditController.prototype.addContribution = function (index) {
                this.contributor.contributions.push(this.mResults[index]);
                this.mResults[index].added = true;
            };
            DbEditController.prototype.removeContribution = function (index) {
                this.contributor.contributions[index].added = false;
                this.contributor.contributions.splice(index, 1);
            };
            DbEditController.prototype.setManualAdd = function () {
                this.manualAdd = true;
                this.clearContributorFields();
            };
            DbEditController.prototype.showValidationErrors = function () {
                this.validationError = true;
            };
            DbEditController.prototype.clearContributorFields = function () {
                this.contributor = {};
                this.contributorBDay = "";
                this.contributorBMonth = "";
                this.contributorBYear = "";
                this.contributor.roles = "";
                this.contributor.givenName = "";
                this.contributor.surname = "";
                this.contributor.nationality = "";
                this.contributor.websiteUrl = "";
                this.contributor.description = "";
                this.contributor.contributions = [];
            };
            return DbEditController;
        })();
        Controllers.DbEditController = DbEditController;
        angular.module('MyApp').controller('DbEditController', DbEditController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var EntryController = (function () {
            function EntryController(MediaService, accountService, $routeParams, $uibModal, $location) {
                var _this = this;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.$routeParams = $routeParams;
                this.$uibModal = $uibModal;
                this.$location = $location;
                this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                this.cast = [];
                this.roles = [];
                this.directors = [];
                this.writers = [];
                this.otherContributors = [];
                this.notFound = false;
                this.showInactiveMessage = false;
                this.showInactiveIndicator = false;
                this.changeListVm = {};
                this.checkListVm = {};
                this.reviewVm = {};
                this.setUserInfo();
                this.MediaService.getMediaById(this.$routeParams['id']).then(function (data) {
                    _this.media = data;
                    //If media exists:
                    if (_this.media.id != undefined) {
                        if (_this.isLoggedIn) {
                            _this.checkMasterlist();
                        }
                        //If media is inactive and the user is not admin, hide the page:
                        if (!_this.media.isActive && !_this.isAdmin) {
                            _this.showInactiveMessage = true;
                        }
                        else {
                            if (!_this.media.isActive) {
                                _this.showInactiveIndicator = true;
                            }
                            _this.releaseDate = new Date(_this.media.releaseDate);
                            _this.releaseDate = _this.months[_this.releaseDate.getMonth()] + " " + _this.releaseDate.getDate() + ", " + _this.releaseDate.getFullYear();
                            //Separate contributors by type:
                            for (var i = 0; i < _this.media.contributors.length; i++) {
                                if (_this.media.contributors[i].roles == "Actor") {
                                    _this.cast.push(_this.media.contributors[i]);
                                    _this.roles.push("Add Role");
                                }
                                else if (_this.media.contributors[i].roles == "Director") {
                                    _this.directors.push(_this.media.contributors[i]);
                                    _this.hasStaff = true;
                                }
                                else if (_this.media.contributors[i].roles == "Writer") {
                                    _this.writers.push(_this.media.contributors[i]);
                                    _this.hasStaff = true;
                                }
                                else {
                                    _this.otherContributors.push(_this.media.contributors[i]);
                                }
                            }
                        }
                    }
                    else {
                        _this.notFound = true;
                    }
                });
            }
            EntryController.prototype.setUserInfo = function () {
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
            };
            EntryController.prototype.openEditModal = function (id) {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/Modals/dbEditModal.html',
                    controller: Controllers.DbEditController,
                    controllerAs: 'vm',
                    resolve: {
                        mediaId: function () { return id; }
                    },
                    backdrop: 'static',
                    keyboard: false,
                    size: "lg"
                });
            };
            EntryController.prototype.checkMasterlist = function () {
                var _this = this;
                this.checkListVm.mediaId = this.media.id;
                this.MediaService.checkMasterlist(this.checkListVm).then(function (data) {
                    _this.hasInList = data.result;
                    _this.hasReviewed = data.secondaryResult;
                });
            };
            EntryController.prototype.addToList = function () {
                var _this = this;
                this.changeListVm.mediaId = this.media.id;
                this.changeListVm.mode = "add";
                this.MediaService.changeList(this.changeListVm).then(function (data) {
                    _this.addStatus = data.message;
                    if (_this.addStatus == "Success.") {
                        _this.hasInList = true;
                        _this.showListLink = true;
                    }
                });
            };
            EntryController.prototype.removeFromList = function () {
                var _this = this;
                this.changeListVm.mediaId = this.media.id;
                this.changeListVm.mode = "remove";
                this.MediaService.changeList(this.changeListVm).then(function (data) {
                    if (!data.error) {
                        _this.hasInList = false;
                        _this.showListLink = false;
                    }
                });
            };
            EntryController.prototype.writeReview = function () {
                if (!this.isLoggedIn) {
                    this.$location.path('/register');
                }
                else if (!this.hasInList) {
                    this.showReviewError = true;
                }
                else {
                    this.$location.path('/review/' + this.media.id);
                }
            };
            EntryController.prototype.editReview = function () {
                this.$location.path('/review/' + this.media.id);
            };
            EntryController.prototype.deleteReview = function () {
                this.reviewVm.mediaId = this.media.id;
                var cont = confirm("Are you sure?");
                if (cont) {
                    this.MediaService.deleteReview(this.reviewVm).then(function () {
                        window.location.reload();
                    });
                }
            };
            return EntryController;
        })();
        Controllers.EntryController = EntryController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var GamesController = (function () {
            function GamesController() {
            }
            return GamesController;
        })();
        Controllers.GamesController = GamesController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var HomeController = (function () {
            function HomeController(MediaService, accountService) {
                var _this = this;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.setUserInfo();
                this.MediaService.getMedia().then(function (data) {
                    _this.medias = data;
                });
            }
            HomeController.prototype.setUserInfo = function () {
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
            };
            HomeController.prototype.debugSeed = function () {
                var cont = confirm("Are you sure?");
                if (cont) {
                    this.MediaService.debugSeed();
                }
            };
            return HomeController;
        })();
        Controllers.HomeController = HomeController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
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
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var MoviesController = (function () {
            function MoviesController() {
            }
            return MoviesController;
        })();
        Controllers.MoviesController = MoviesController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var MusicController = (function () {
            function MusicController() {
            }
            return MusicController;
        })();
        Controllers.MusicController = MusicController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var NavController = (function () {
            function NavController($uibModal, $location, MediaService, accountService) {
                var _this = this;
                this.$uibModal = $uibModal;
                this.$location = $location;
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.searchForPerson = false;
                this.sbLastSet = "Title";
                this.mouseHover = false;
                this.setUserInfo();
                this.MediaService.getUser("thisUser").then(function (data) {
                    _this.userInfo = data;
                    _this.userName = _this.userInfo.userName;
                    _this.MediaService.user = data;
                    _this.MediaService.user.isLoggedIn = _this.isLoggedIn;
                });
                this.query = {};
                this.query.searchFor = "All";
                this.query.searchBy = "Title";
                this.query.query = "";
                this.query.includeDeleted = false;
                this.query.onlyDeleted = false;
                this.MediaService.searchTransport = {};
            }
            NavController.prototype.logout = function () {
                this.accountService.logout();
                this.isLoggedIn = false;
            };
            NavController.prototype.setUserInfo = function () {
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
            };
            NavController.prototype.openLoginModal = function () {
                this.$uibModal.open({
                    templateUrl: 'ngApp/views/login.html',
                    controller: MyApp.Controllers.LoginController,
                    controllerAs: 'controller',
                });
            };
            NavController.prototype.setParams = function (parameter, value) {
                if (parameter == 0) {
                    this.query.searchFor = value;
                    if (value == "People" || value == "Users") {
                        this.query.searchBy = "Name";
                        this.searchForPerson = true;
                    }
                    else {
                        if (this.query.searchBy == "Name") {
                            this.query.searchBy = this.sbLastSet;
                        }
                        this.searchForPerson = false;
                    }
                }
                else {
                    this.query.searchBy = value;
                    this.sbLastSet = value;
                }
            };
            NavController.prototype.search = function () {
                var _this = this;
                this.MediaService.search(this.query).then(function (data) {
                    if (_this.query.searchFor == "People") {
                        console.log(data);
                        _this.MediaService.searchTransport = data.cResults;
                        _this.MediaService.searchTransport.dataType = "People";
                    }
                    else if (_this.query.searchFor == "Users") {
                        _this.MediaService.searchTransport = data.uResults;
                        _this.MediaService.searchTransport.dataType = "Users";
                    }
                    else {
                        _this.MediaService.searchTransport = data.results;
                        _this.MediaService.searchTransport.dataType = "Media";
                    }
                    if (window.location.pathname != '/search') {
                        _this.$location.path('/search');
                    }
                });
            };
            NavController.prototype.setMouseHover = function (hover) {
                this.mouseHover = hover;
            };
            return NavController;
        })();
        Controllers.NavController = NavController;
        angular.module('MyApp').controller('NavController', NavController);
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var ProfileController = (function () {
            function ProfileController(MediaService, $routeParams) {
                var _this = this;
                this.MediaService = MediaService;
                this.$routeParams = $routeParams;
                this.MediaService.getUserById(this.$routeParams['id']).then(function (data) {
                    _this.owner = data;
                    console.log(_this.owner);
                });
            }
            return ProfileController;
        })();
        Controllers.ProfileController = ProfileController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var regSuccessController = (function () {
            function regSuccessController(accountService, $location) {
                this.accountService = accountService;
                this.$location = $location;
                this.setUserInfo();
                //If the user logs in, redirect to home:
                if (this.isLoggedIn) {
                    this.$location.path('/');
                }
            }
            regSuccessController.prototype.setUserInfo = function () {
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
            };
            return regSuccessController;
        })();
        Controllers.regSuccessController = regSuccessController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
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
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var SearchController = (function () {
            //public changeListVm;
            //public addStatus;
            //public hasInList = false;
            //public showListLink;
            //search results are gotten directly from the media service
            function SearchController(MediaService, accountService) {
                this.MediaService = MediaService;
                this.accountService = accountService;
                this.setUserInfo();
                //this.changeListVm = {};
            }
            SearchController.prototype.setUserInfo = function () {
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
            };
            return SearchController;
        })();
        Controllers.SearchController = SearchController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var searchModalController = (function () {
            function searchModalController() {
            }
            return searchModalController;
        })();
        Controllers.searchModalController = searchModalController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Controllers;
    (function (Controllers) {
        var SeriesController = (function () {
            function SeriesController() {
            }
            return SeriesController;
        })();
        Controllers.SeriesController = SeriesController;
    })(Controllers = MyApp.Controllers || (MyApp.Controllers = {}));
})(MyApp || (MyApp = {}));
var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        var AccountService = (function () {
            function AccountService($q, $http, $window, MediaService) {
                this.$q = $q;
                this.$http = $http;
                this.$window = $window;
                this.MediaService = MediaService;
            }
            // Store access token and claims in browser session storage
            AccountService.prototype.storeUserInfo = function (userInfo) {
                // store auth token
                this.$window.sessionStorage.setItem('token', userInfo.access_token);
                // store claims
                for (var prop in userInfo) {
                    if (prop.indexOf('claim_') == 0) {
                        this.$window.sessionStorage.setItem(prop, userInfo[prop]);
                    }
                }
            };
            AccountService.prototype.getClaim = function (type) {
                return this.$window.sessionStorage.getItem('claim_' + type);
            };
            AccountService.prototype.login = function (loginUser) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var data = "grant_type=password&username=" + loginUser.userName + "&password=" + loginUser.password;
                    _this.$http.post('/Token', data, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function (result) {
                        _this.storeUserInfo(result);
                        _this.MediaService.token = _this.isLoggedIn();
                        // redirect to home
                        window.location.reload();
                        resolve();
                    }).error(function (result) {
                        reject(result);
                    });
                });
            };
            AccountService.prototype.register = function (userLogin) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    _this.$http.post('/api/account/register', userLogin)
                        .then(function (result) {
                        resolve(result);
                    })
                        .catch(function (result) {
                        // flatten error messages
                        var messages = [];
                        for (var prop in result.data.modelState) {
                            messages = messages.concat(result.data.modelState[prop]);
                        }
                        reject(messages);
                    });
                });
            };
            AccountService.prototype.logout = function () {
                // clear all of session storage (including claims)
                this.$window.sessionStorage.clear();
                this.MediaService.token = this.isLoggedIn();
                window.location.reload();
            };
            AccountService.prototype.isLoggedIn = function () {
                return this.$window.sessionStorage.getItem('token');
            };
            // associate external login (e.g., Twitter) with local user account 
            AccountService.prototype.registerExternal = function (email, token) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    _this.$http.post('/api/account/registerExternal', { email: email }, { headers: { Authorization: 'Bearer ' + token } })
                        .then(function (result) {
                        resolve(result);
                    })
                        .catch(function (result) {
                        // flatten error messages
                        var messages = [];
                        for (var prop in result.data.modelState) {
                            messages = messages.concat(result.data.modelState[prop]);
                        }
                        reject(messages);
                    });
                });
            };
            // get email, registration status, and provider for current user 
            AccountService.prototype.getUserInfo = function (externalAccessToken) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    _this.$http.get('/api/account/userinfo', { headers: { Authorization: 'Bearer ' + externalAccessToken } })
                        .then(function (result) {
                        resolve(result.data);
                    })
                        .catch(function (result) {
                        // flatten error messages
                        var messages = [];
                        for (var prop in result.data.modelState) {
                            messages = messages.concat(result.data.modelState[prop]);
                        }
                        return messages;
                    });
                });
            };
            AccountService.prototype.getExternalLogins = function () {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var url = "api/Account/ExternalLogins?returnUrl=%2FexternalLogin&generateState=true";
                    _this.$http.get(url).then(function (result) {
                        resolve(result.data);
                    }).catch(function (result) {
                        reject(result);
                    });
                });
            };
            AccountService.prototype.confirmEmail = function (userId, code) {
                var _this = this;
                return this.$q(function (resolve, reject) {
                    var data = {
                        userId: userId,
                        code: code
                    };
                    _this.$http.post('/api/account/confirmEmail', data).then(function (result) {
                        resolve(result.data);
                    }).catch(function (result) {
                        reject(result);
                    });
                });
            };
            // extract access token from response
            AccountService.prototype.parseOAuthResponse = function (token) {
                var results = {};
                token.split('&').forEach(function (item) {
                    var pair = item.split('=');
                    results[pair[0]] = pair[1];
                });
                return results;
            };
            return AccountService;
        })();
        Services.AccountService = AccountService;
        angular.module('MyApp').service('accountService', AccountService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
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
                this.idContainer.errorCode = id; //update this name and/or consolidate these into the GenericVm
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
var MyApp;
(function (MyApp) {
    var Services;
    (function (Services) {
        //Unused:
        var MovieService = (function () {
            function MovieService($resource) {
                this.MovieResource = $resource('/api/movies/:id');
            }
            MovieService.prototype.listMovies = function () {
                return this.MovieResource.query();
            };
            return MovieService;
        })();
        Services.MovieService = MovieService;
        angular.module('MyApp').service('movieService', MovieService);
    })(Services = MyApp.Services || (MyApp.Services = {}));
})(MyApp || (MyApp = {}));
//# sourceMappingURL=master.js.map