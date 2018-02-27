from = {lat: 49.269355, lng: -122.958724};
to = {lat: 49.2266034, lng: -123.0048016};
var map;
var directionsService;
var directionsDisplay;
var searchRange = 0.05;
var waypts;

function initMap()
{
    switchView(0);
    initAutocomplete();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: from
    });
}

function updateMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: from
    });

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });

    setOriginMarker(from);
    setDestinationMarker(to);

    directionsDisplay.addListener('directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    switchView(1);
}

function displayRoute(service, display, waypointFeasible)
{
    waypts = [];
    for (var i = 0; i < waypointFeasible.length; i++) {
        waypts.push({
            location: waypointFeasible[i],
            stopover: true
        });
    }

    service.route({
        origin: from,
        destination: to,
        waypoints: waypts,
        travelMode: transMode,
        avoidTolls: false
    }, function(response, status) {
        if (status === 'OK') {
            display.setDirections(response);
        } else {
            alert('Could not display directions due to: ' + status);
        }
    });
}


function timeParser(value)
{
  return parseFloat(value) * 3600;
}

function computeTotalDistance(result)
{
    var total = 0;
    var timeCostSec = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
        timeCostSec += myroute.legs[i].duration.value;
    }
    total = total / 1000;
    document.getElementById('total-dist').innerHTML = total + ' km';

    if (timeCostSec < 3600) {
        var accurateTimeCost = timeCostSec / 60;
        document.getElementById('total-time').innerHTML = accurateTimeCost.toPrecision(4) + ' mins';
    } else {
        var accurateTimeCost = timeCostSec / 3600;
        document.getElementById('total-time').innerHTML = accurateTimeCost.toPrecision(4) + ' hours';
    }

    var timeSpare = timeParser(timeAvailable) - timeCostSec;

    if (timeSpare < 3600) {
        var accurateTimeCost = timeSpare / 60;
        document.getElementById('total-time-spare').innerHTML = accurateTimeCost.toPrecision(4) + ' mins';
    } else {
        var accurateTimeCost = timeSpare / 3600;
        document.getElementById('total-time-spare').innerHTML = accurateTimeCost.toPrecision(4) + ' hours';
    }
}
