var transMode;
var timeAvailable;

function switchView(index) {
    if (index == 0) {
        $("#user-input").show();
        $("#candidate-choose").hide();
        $("#display-result").hide();
    } else if (index == 1) {
        $("#user-input").hide();
        $("#candidate-choose").show();
        $("#display-result").hide();
    } else if (index == 2) {
        $("#user-input").hide();
        $("#candidate-choose").hide();
        $("#display-result").show();
    }
}

$("#search-btn").click(function() {
    transMode = $("#transMode").val();
    updateMap();
    // drawSearchingScope();

    timeAvailable = $("#hourEstimate").val();

    $.get('/libraries', function(data) {
        var librariesArray = data;
        addMarker(librariesArray.libraries, "library");
    });

    $.get('/parks', function(data) {
        var parksArray = [];
        var features = data.features;
        var parkCoords = [];
        features.forEach(function(feature) {
            var properties = feature.properties;
            var park = {};
            park.name = properties.Name;
            park.location = properties.StrNum+" "+properties.StrName;

            if (properties.Site_Area > 50000) {
                if (feature.geometry.type === "MultiPolygon") {
                    var polygons = feature.geometry.coordinates;
                    var polygonCoords = [];
                    polygons.forEach(function(polygon) {
                        polygonCoords.push(polygon[0]);
                    });
                    parkCoords.push(polygonCoords);
                    park.position = polygonCoords[0][0][1]+","+polygonCoords[0][0][0];
                } else {
                    var coords = feature.geometry.coordinates[0];
                    var polygonCoords = [];
                    polygonCoords.push(coords);
                    parkCoords.push(polygonCoords);
                    park.position = coords[0][1]+","+coords[0][0];
                }
                parksArray.push(park);
            }
        });

        drawPolygon(parkCoords);
        addMarker(parksArray, "park");
    });
});

$("#library-check-btn").click(function() {
    var checkbox = this.children[0];
    if (checkbox.className == "fa fa-check-square") {
        checkbox.className = "fa fa-square";
        hideMarker("library");
    } else {
        checkbox.className = "fa fa-check-square";
        showMarker("library");
    }
});

$("#park-check-btn").click(function() {
    var checkbox = this.children[0];
    if (checkbox.className == "fa fa-check-square") {
        checkbox.className = "fa fa-square";
        hideMarker("park");
    } else {
        checkbox.className = "fa fa-check-square";
        showMarker("park");
    }
});

$("#restaurant-check-btn").click(function() {
    var checkbox = this.children[0];
    if (checkbox.className == "fa fa-check-square") {
        checkbox.className = "fa fa-square";
    } else {
        checkbox.className = "fa fa-check-square";
    }
});

$("#activity-check-btn").click(function() {
    var checkbox = this.children[0];
    if (checkbox.className == "fa fa-check-square") {
        checkbox.className = "fa fa-square";
    } else {
        checkbox.className = "fa fa-check-square";
    }
});

$("#route-button").click(function() {
    originMarker.setMap(null);
    destinationMarker.setMap(null);

    var waypoints = [];

    for (var i = 0; i < markerSet.length; i++) {
        if (markerSet[i].currState == 1) {
            waypoints.push({lat: markerSet[i].position.lat(), lng:markerSet[i].position.lng()});
        }
    }

    for (var i = 0; i < markerHiddenSet.length; i++) {
        if (markerHiddenSet[i].currState == 1) {
            waypoints.push({lat: markerHiddenSet[i].position.lat(), lng:markerHiddenSet[i].position.lng()});
        }
    }

    waypoints.sort(compareDistance);
    displayRoute(directionsService, directionsDisplay, waypoints);
});