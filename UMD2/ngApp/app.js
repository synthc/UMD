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
            .when('/addsuccess', {
            templateUrl: 'ngApp/views/addSuccess.html',
            controller: MyApp.Controllers.AddSuccessController,
            controllerAs: 'vm'
        })
            .when('/debug/dblist', {
            templateUrl: '/ngApp/views/databaseList.html',
            controller: MyApp.Controllers.DbListController,
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
            redirectTo: '/ngApp/views/notFound.html'
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
//# sourceMappingURL=app.js.map