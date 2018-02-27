const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(__dirname + '/front-end'));
var fs = require('fs');

var getLibraryInfo = function(request, response)
{
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'public, max-age=1800');
    fs.readFile(__dirname + '/data/library.json', function(err, data) {
        response.end(data);
    });
};

var getParkInfo = function(request, response)
{
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'public, max-age=1800');
    fs.readFile(__dirname + '/data/PARKS.json', function(err, data) {
        response.end(data);
    });
};

var getGreyMarker = function(request, response)
{
    response.statusCode = 200;
    response.setHeader('Content-Type', 'image/png');
    response.setHeader('Cache-Control', 'public, max-age=1800');
    fs.readFile(__dirname + '/resources/grey-marker.png', function(err, data) {
        response.end(data);
    });
};

var getRedMarker = function(request, response)
{
    response.statusCode = 200;
    response.setHeader('Content-Type', 'image/png');
    response.setHeader('Cache-Control', 'public, max-age=1800');
    fs.readFile(__dirname + '/resources/red-marker.png', function(err, data) {
        response.end(data);
    });
};

app.get('/libraries', getLibraryInfo);
app.get('/parks', getParkInfo);
app.get('/grey-marker.png', getGreyMarker);
app.get('/red-marker.png', getRedMarker);

app.listen(8080, function () {
    console.log('The server is listening on port 8080!')
});