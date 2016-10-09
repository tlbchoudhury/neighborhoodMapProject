var map;

var infoWindow;

var markers = [];

var highlightedIcon;

var defaultIcon;

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

var fourSquareContact;

function getFourSquare(lat, lng, marker, infowindow) {
    var fourSquareUrl = "https://api.foursquare.com/v2/venues/search?ll=" + lat + "," + lng + "&limit=1&oauth_token=E0L0WENNP3BDOVJFQMPLCF0G0W0NTDUPTXHC15MYAB0BHAPH&v=20161005";

    $.getJSON(fourSquareUrl, function(data) {
        fourSquareContact = data.response.venues[0].contact.formattedPhone;

        if (fourSquareContact == undefined) {
            fourSquareContact = "Failed to retrieve phone number from FOURSQUARE";
        }

        infowindow.setContent('<div>' + marker.title + ': '+'<br>' + fourSquareContact + '</div>');
        infowindow.open(map, marker);
    }).fail(function(err) {
        fourSquareContact = "Failed to connect to FOURSQUARE";
        infowindow.setContent('<div>' + marker.title + ': '+'<br>' + fourSquareContact + '</div>');
        infowindow.open(map, marker);
    });
}

var locations = [{
    title: 'Andalous Mediterranean Grill',
    location: {
        lat: 32.897176,
        lng: -96.95809
    }
}, {
    title: 'Starbucks',
    location: {
        lat: 32.918566,
        lng: -96.959224
    }
}, {
    title: 'Chipotle Mexican Grill',
    location: {
        lat: 32.912365,
        lng: -96.959327
    }
}, {
    title: 'Dimassi Mediterranean Buffet',
    location: {
        lat: 32.897087,
        lng: -96.960853
    }
}, {
    title: 'Inchin Bamboo Garden',
    location: {
        lat: 32.897052,
        lng: -96.961571
    }
}, {
    title: 'Kebabs To Go',
    location: {
        lat: 32.942257,
        lng: -96.952823
    }
}];

function googleMapErrorFunction() {
    alert("Unable to load Google Maps API");
}

function initMap() {
    //Creates a new map 
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 32.814018,
            lng: -96.948894
        },
        zoom: 13,
        mapTypeControl: false,
        styles: [{
            elementType: 'geometry',
            stylers: [{
                color: '#242f3e'
            }]
        }, {
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#242f3e'
            }]
        }, {
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#746855'
            }]
        }, {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        }, {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{
                color: '#263c3f'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#6b9a76'
            }]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{
                color: '#38414e'
            }]
        }, {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#212a37'
            }]
        }, {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#9ca5b3'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{
                color: '#746855'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#1f2835'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#f3d19c'
            }]
        }, {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{
                color: '#2f3948'
            }]
        }, {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        }, {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{
                color: '#17263c'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#515c6d'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#17263c'
            }]
        }]
    });

    infoWindow = new google.maps.InfoWindow();
    defaultIcon = createMarkerIcon('0091ff');
    //Color change when user mouses over marker
    highlightedIcon = createMarkerIcon('09871e');
    //Create an array of markers on initialize
    for (var i = 0; i < locations.length; i++) {
        //Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        //Create a marker for each location, and push them into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        //Inserts marker into array of markers.
        markers.push(marker);
        //Open infowindow on click event 

        marker.addListener('click', function() {
            markers.forEach(function(marker) {
                marker.setIcon(defaultIcon);
                marker.setAnimation(null);
            });
            this.setAnimation(google.maps.Animation.BOUNCE);
            loadInfoWindow(this, infoWindow);
        });
        // Event listeners to change marker color back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }

    displayMarker();
}


//Displays one infowindow when a marker is clicked with marker title and phone number from FOURSQUARE 
function loadInfoWindow(marker, infowindow) {
    // Check if the infowindow is open on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        getFourSquare(marker.getPosition().lat(), marker.getPosition().lng(), marker, infowindow);

        // close infowindow when the "x" is clicked on infowindow
        infowindow.addListener('closeclick', function() {
            marker.setAnimation(null);
            infowindow.marker = null;
        });
    }
}
//This function loops through the markers array and displays them.
function displayMarker() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

//Gives color to marker icon. The icon is 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function createMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

var ViewModel = function() {
        var self = this;

        self.locations = ko.observableArray(locations),
        self.query = ko.observable(''),

        //Filters location list and markers based on query in the search box
        this.computedLocations = ko.computed(function() {
            return ko.utils.arrayFilter(self.locations(), function(item) {
                var comparedResult = item.title.toLowerCase().indexOf(self.query().toLowerCase());
                if (comparedResult >= 0) {
                    for (var i = 0; i < locations.length; i++) {
                        if (locations[i].title == item.title) {
                            showHideMarker(i, true);
                        }
                    }
                } else {
                    for (var i = 0; i < locations.length; i++) {
                        if (locations[i].title == item.title) {
                          markers.forEach(function(marker) {
                            marker.setIcon(defaultIcon);
                            marker.setAnimation(null);
                          });
                          showHideMarker(i, false);
                        }
                    }
                }
                return item.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            });
        });

    this.itemClicked = function(itemText) {
            var index;
            markers.forEach(function(marker) {
                marker.setIcon(defaultIcon);
                marker.setAnimation(null);
            });
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].title == itemText.title) {
                    index = i;
                }
            }

            //Displays infowindow for given marker id
            function selectMarker(id) {
                $.each(markers, function() {
                    var that;
                    if (this.id == id) {
                        that = this;
                        getFourSquare(itemText.location.lat, itemText.location.lng, this, infoWindow);
                        this.setIcon(highlightedIcon);
                        toggleBounce(this);
                        infoWindow.open(map, this);
                    }

                    infoWindow.addListener('closeclick', function() {
                        markers.forEach(function(marker) {
                            marker.setIcon(defaultIcon);
                            marker.setAnimation(null);
                        });
                        infoWindow.marker = null;
                    });
                });
            }
            selectMarker(index);
        };
        //Displays & hides marker based on marker id 
    function showHideMarker(id, showHide) {
        $.each(markers, function() {
            if (this.id == id && showHide === true)
                this.setVisible(true);

            if (this.id == id && showHide === false) {
                this.setVisible(false);
                infoWindow.close();
            }                
        });
    }
}

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
});