"use strict";

var baseUrl = "http://localhost:8091/TourPe/api/";


angular.module("yapp", ["ui.router", "ngAnimate"])
  .config(["$stateProvider", "$urlRouterProvider", function (r, t) {
    t.when("/dashboard", "/dashboard/overview"), t.otherwise("/login"), r.state("base", {
      "abstract": !0,
      url: "",
      templateUrl: "views/base.html"
    }).state("login", {
      url: "/login",
      parent: "base",
      templateUrl: "views/login.html",
      controller: "LoginCtrl"
    }).state("dashboard", {
      url: "/dashboard",
      parent: "base",
      templateUrl: "views/dashboard.html",
      controller: "DashboardCtrl"
    }).state("overview", {
      url: "/overview",
      parent: "dashboard",
      templateUrl: "views/dashboard/overview.html"
    }).state("reports", {url: "/reports", parent: "dashboard", templateUrl: "views/dashboard/reports.html"})
  }]),

  angular.module("yapp").controller("LoginCtrl", ["$rootScope", "$scope", "$location", "$http", "$window", function ($rootScope, $scope, $location, $http, $window) {

    $scope.login = function (form) {
      $("#loading_div").oLoader({
        backgroundColor: '#fff',
        image: 'images/chefs_hat.png',
        fadeInTime: 500,
        fadeOutTime: 1000,
        fadeLevel: 0.8
      });
      $http.post(baseUrl + "login", {
        username: form.signInEmail,
        password: form.signInPassword,
      }).success(function (data) {


        console.log("-----" + JSON.stringify(data));
        console.log('authentication token: ' + data.access_token);

        if (data.error) {
          $("#loading_div").oLoader('hide');
          return alert("Incorrect username and password!");
        }
        if (!(data && data.access_token)) {
          $("#loading_div").oLoader('hide');
          return alert("It seems that you are not a valid user.");
        }

        localStorage["authToken"] = data.access_token;

        console.log("-------------111---------------------" + localStorage["authToken"]);

        //$rootScope.chef = data;
        //$window.localStorage['chef'] = JSON.stringify($rootScope.chef);
        $("#loading_div").oLoader('hide');
        return $location.path("/dashboard"), !1


      }).error(function (data) {
        alert("Something went wrong!");

        console.log('login error: ' + data);
        $rootScope.$broadcast('event:auth-loginFailed', data);

        $("#loading_div").oLoader('hide');
      });
    }
  }]),


  angular.module("yapp").controller("DashboardCtrl", ["$rootScope", "$scope", "$state", "$window", "$location", "$http", function ($rootScope, $scope, $state, $window, $location, $http) {

    if (localStorage["authToken"]) {
      $scope.logout = function () {
        console.log('logOut called');
        $http.post(baseUrl + 'logout', {}, getHttpConfig()).success(function () {
          console.log('logout success');
          localStorage.clear();
          $location.path("/");
        }).error(function (data) {
          console.log('logout error: ' + JSON.stringify(data));
        });
      };
    } else {
      localStorage.clear();
      $location.path("/");
    }
  }]);

function getLocalToken() {
  return localStorage["authToken"];
}

function getHttpConfig() {
  return {
    headers: {
      'Authorization': 'Bearer ' + getLocalToken()
    }
  };
}

function getAuthenticateHttpConfig() {
  return {
    ignoreAuthModule: true
  };
}
