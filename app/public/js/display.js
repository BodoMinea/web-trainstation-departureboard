var socket = io();
jQuery(document).ready(function($){
	var clock;
			
	clock = $('.clock').FlipClock({
		clockFace: 'TwentyFourHourClock',
		showSeconds: false
	});

    var scope = angular.element($("#gett")).scope();

    socket.on('name', function (data) {
        document.getElementById('title').innerHTML = data;
});
	
    socket.on('data', function (data) {
        console.log(data);
        scope.$apply(function() {
            scope.data = data;
        }); 
});

});

var myApp = angular.module('display', []);
		
        myApp.controller('StopDisplay', ['$scope', function ($scope) {

}]);
