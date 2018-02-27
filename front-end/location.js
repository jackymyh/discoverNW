var searchRangeShape;
var markerSet = [];
var markerHiddenSet = [];
var originMarker;
var destinationMarker;

function hideMarker(type)
{
    for (var i = 0; i < markerSet.length; i++) {
        if (markerSet[i].placeType == type) {
            markerSet[i].setMap(null);
            markerHiddenSet.push(markerSet[i]);
        }
    }
}

function showMarker(type)
{
    for (var i = 0; i < markerHiddenSet.length; i++) {
        if (markerHiddenSet[i].placeType == type) {
            markerHiddenSet[i].setMap(map);
            markerSet.push(markerHiddenSet[i]);
        }
    }
}

function setOriginMarker(pos)
{
    originMarker = new google.maps.Marker({
        position: pos,
        map: map,
        title: "origin",
        label: 'A'
    });
    originMarker.setMap(map);
}

function setDestinationMarker(pos)
{
    destinationMarker = new google.maps.Marker({
        position: pos,
        map: map,
        title: "destination",
        label: 'B'
    });
    destinationMarker.setMap(map);
}

function addMarker(objArray, type)
{
    var objArrayFiltered = getWayPointsFeasible(objArray);

    for (var i = 0; i < objArrayFiltered.length; i++)
    {
        var infowindow = new google.maps.InfoWindow({
            content: objArrayFiltered[i].name
        });

        var marker = new google.maps.Marker({
            position: objArrayFiltered[i],
            map: map,
            icon: 'grey-marker.png'
        });

        marker.placeType = type;
        marker.window = infowindow;
        marker.currState = 0;

        marker.addListener('click', function() {
            if (this.currState == 1) {
                this.currState = 0;
                this.setIcon('grey-marker.png');
            } else {
                this.currState = 1;
                this.setIcon('red-marker.png');
            }
        });

        marker.addListener('dblclick', function() {
            this.window.open(map, this);
        });

        marker.setMap(map);
        markerSet.push(marker);
    }
}

function clearMarker()
{
    for (var i = 0; i < markerSet.length; i++) {
        markerSet[i].setMap(null);
    }
}

function getDistance(pos1, pos2)
{
    const latDiff = Math.abs(pos1.lat - pos2.lat);
    const lngDiff = Math.abs(pos1.lng - pos2.lng);
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

function getEllipseCoord()
{
    const diffLat = to.lat - from.lat;
    const diffLng = to.lng - from.lng;
    var angle = Math.atan2(diffLat, diffLng);

    const c = getDistance(from, to) / 2;
    const b = searchRange;
    const a = Math.sqrt(b * b + c * c);
    var parametricResults = [];

    for (var i = 0; i < 360; i++)
    {
        parametricResults.push((b * b) / (a - c * Math.cos(i/180 * Math.PI - angle)));
    }

    var results = [];
    for (var i = 0; i < parametricResults.length; i++)
    {
        var res = {};
        res.lat = from.lat + Math.sin(i/180 * Math.PI) * parametricResults[i];
        res.lng = from.lng + Math.cos(i/180 * Math.PI) * parametricResults[i];
        results.push(res);
    }

    return results;
}

function drawSearchingScope()
{
    var coords = getEllipseCoord(searchRange);

    searchRangeShape = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    searchRangeShape.setMap(map);
}

function compareDistance(pos1, pos2)
{
    return getDistance(pos1, from) - getDistance(pos2, from);
}

function getWayPointsFeasible(posArray)
{
    var wayPointsFeasible = [];

    var diffLat = to.lat - from.lat;
    var diffLng = to.lng - from.lng;
    var angle = -Math.atan(diffLat / diffLng);

    if (to.lng < from.lng)
    {
        angle = angle - Math.PI;
    }

    const c = getDistance(from, to) / 2;
    const b = searchRange;
    const a = Math.sqrt(b * b + c * c);
    var parametricResults = [];

    for (var i = 0; i < 360; i++)
    {
        parametricResults[i] = (b * b) / (a - c * Math.cos(i/180 * Math.PI + angle));
    }

    for (var j = 0; j < posArray.length; j++)
    {
        var string = posArray[j].position;
        var array = string.split(',');
        var pos = {lat: parseFloat(array[0]), lng: parseFloat(array[1])};
        pos.name = posArray[j].name;
        diffLat = pos.lat - from.lat;
        diffLng = pos.lng - from.lng;
        var angle2 = Math.round(Math.atan2(diffLat, diffLng) / Math.PI * 180);
        if (angle2 < 0)
        {
            angle2 = angle2 + 360;
        }

        if (getDistance(from, pos) < parametricResults[angle2])
        {
            wayPointsFeasible.push(pos);
        }
    }

    return wayPointsFeasible;
}

function drawPolygon(parks)
{
    parks.forEach(function(park) {
        park.forEach(function(coords){
            var coordObjects = [];
            coords.forEach(function(coord) {
                var coordObject = {};
                coordObject.lng = coord[0];
                coordObject.lat = coord[1];
                coordObjects.push(coordObject);
            });
            var polygon = new google.maps.Polygon({
                paths: coordObjects,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#33cc33',
                fillOpacity: 0.35
            });
            polygon.setMap(map);
        });
    });

}




