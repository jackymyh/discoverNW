// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var autocompleteFrom;
var autocompleteTo;

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocompleteFrom = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocompleteFrom')),
        {types: ['geocode']});
    autocompleteTo = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocompleteTo')),
        {types: ['geocode']});


    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocompleteFrom.addListener('place_changed', getFromAddress);
    autocompleteTo.addListener('place_changed', getToAddress);
}

function getFromAddress() {
    // Get the place details from the autocomplete object.
    var place = autocompleteFrom.getPlace();

    if (place != undefined)
    {
        var pos = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
        from = pos;
    }
}

function getToAddress() {
    // Get the place details from the autocomplete object.
    var place = autocompleteTo.getPlace();

    if (place != undefined)
    {
        var pos = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
        to = pos;
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocompleteFrom.setBounds(circle.getBounds());
            autocompleteTo.setBounds(circle.getBounds());
        });
    }
}