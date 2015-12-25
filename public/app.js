'use strict';

var app = angular.module('BuilderApp', ['ngAnimate']);

app.constant('APP', {
        API: 'http://localhost:8080/api/'
});

app.factory('gservice', function($rootScope, $http){
        var googleMapService = {};
        var locations = [];
        var qstart = 0;
        var selectedLat  = 8.5247409;
        var selectedLong = 76.997626;

        var convertToMapPoints = function(projects){
            var locations = [];
            for(var i = 0; i < projects.length; i++){
                var project = projects[i];
                var  contentString = '<p><h4>' + project.name + '</h4>' +
                                     '<img width="200" height="140" src="http://cfi-tp.co.in/uploads/gallery/f646ecb6250be2921bfd0d8c22fa6302.jpg">' +
                                     '<br>' + project.builder +
                                     '<br>' + project.status +
                                     '</p>';
                locations.push(new Location(
                               new google.maps.LatLng(project.location[1], project.location[0]),
                               new google.maps.InfoWindow({
                                    content: contentString,
                                    maxWidth: 320
                              })
                ));
            }
            return locations;
        };

      var Location = function(latlon, message, projectname, builder){
                      this.latlon = latlon;
                      this.message = message;
      };

      var initialize = function(latitude, longitude){
            var myLatLng = {lat: selectedLat, lng: selectedLong};
            if(!map){
                  var map = new google.maps.Map(document.getElementById('map'),{
                      zoom: 13,
                      center: myLatLng
                  });
            }
          locations.forEach(function(loc, i){
                var marker = new google.maps.Marker({
                    position: loc.latlon,
                    map: map,
                    title: loc.projectname,
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });

                google.maps.event.addListener(marker, 'click', function(e){
                    loc.message.open(map, marker);
                });
          });
         var cityCircle = new google.maps.Circle({
               strokeColor: '#FF0000',
               strokeOpacity: 0.8,
               strokeWeight: 2,
               fillColor: '#FF0000',
               fillOpacity: 0.35,
               map: map,
               center: myLatLng,
               radius: 5000,
               editable: true
             });
        cityCircle.setMap(map);
     }

    googleMapService.refresh = function(filteredResults){

          locations = [];
          if(filteredResults){
              locations = convertToMapPoints(filteredResults);
          }
          initialize(selectedLat,selectedLong, true);
        };

    google.maps.event.addDomListener(window, 'load', googleMapService.refresh());

    return googleMapService;
});

app.controller('BuilderCtrl', ['$scope', 'APP', 'gservice', function($scope, APP, gservice){

        $scope.allprojects = [];
        $scope.oneBHKquery  = true;
        $scope.twoBHKquery  = true;
        $scope.threeBHKquery= true;
        $scope.fourBHKquery = true;
        $scope.qstart = 0;

    $scope.updateqstart = function(num){
        $scope.qstart = $scope.qstart + num;
    };

    $scope.resetForm = function(){
        $scope.oneBHKquery = true;
        $scope.twoBHKquery = true;
        $scope.threeBHKquery = true;
        $scope.fourBHKquery = true;
        $scope.builderquery = '';
        $scope.projectquery = '';
        $scope.sqft1query = '';
        $scope.sqft2query = '';
    };

    $scope.findProjects = function(){
        var url = APP.API + "projects";
        var payload = { 'builder': $scope.builderquery,
                        'project': $scope.projectquery,
                        'sqft1': $scope.sqft1query,
                        'sqft2': $scope.sqft2query,
                        'oneBHK': $scope.oneBHKquery,
                        'twoBHK': $scope.twoBHKquery,
                        'threeBHK': $scope.threeBHKquery,
                        'fourBHK': $scope.fourBHKquery,
                     };

        $.getJSON(url, payload)
         .done(function(projects){
               $scope.$apply(function(){
                    $scope.allprojects = projects;
                    gservice.refresh(projects);
               });
          })
         .fail(function(jqxhr, textStatus, error){
            //TODO
         });
    };
}]);
