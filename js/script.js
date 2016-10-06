  var map;
  // Create a new blank array for all the listing markers.
  var infoWindow;

  var markers = [];

  var locations = [
  {
    title: 'Andalous Mediterranean Grill', 
    location: {lat: 32.897176, lng: -96.95809}
  },
  {
    title: 'Arabian Bites', 
    location: {lat: 32.919733, lng: -96.957101}
  },
  {
    title: 'Chipotle Mexican Grill', 
    location: {lat: 32.912365, lng: -96.959327}
  },
  {
    title: 'Dimassi Mediterranean Buffet', 
    location: {lat: 32.897087, lng: -96.960853}
  },
  {
    title: 'Inchin Bamboo Garden', 
    location: {lat: 32.897052, lng: -96.961571}
  },
  {
    title: 'Kebabs To Go', 
    location: {lat: 32.942257, lng: -96.952823}
  }
  ];
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    mapTypeControl: false
  });

  infoWindow = new google.maps.InfoWindow();
  var defaultIcon = createMarkerIcon('0091ff');
  //color change when user mouses over marker
  var highlightedIcon = createMarkerIcon('09871e');
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
     var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      loadInfoWindow(this, infoWindow);
    });
// Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

  displayMarker();

}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function loadInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  // var $url: "https://api.foursquare.com/v2/venues/search";
  // var $contactNumb: 
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}
// This function will loop through the markers array and display them all.
function displayMarker() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}


// This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
function createMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

var ViewModel = function() {
  var self= this;

  this.locations = ko.observableArray(locations),
  this.query = ko.observable(''),

  this.computedLocations = ko.computed(function() {
    return ko.utils.arrayFilter(self.locations(), function(item) {
      var comparedResult= item.title.toLowerCase().indexOf(self.query().toLowerCase());
      if(comparedResult>=0){
        for(var i=0; i<locations.length; i++) {
          if(locations[i].title==item.title){
            showHideMarker(i,true);
          }
        }
      } 
      else {
        for(var i=0; i<locations.length; i++) {
          if(locations[i].title==item.title){
            showHideMarker(i,false);
          }
        }
      }
      return item.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });
  
  this.itemClicked = function(itemText) {
    var index;
    for(var i=0; i<locations.length; i++) {
      if(locations[i].title==itemText.title){
        index = i;
      }
    }

    // function getFourSquare() {
      // var fourSquareUrl = "https://api.foursquare.com/v2/venues/search?ll="+lat+","+lng+"&limit=1&oauth_token=E0L0WENNP3BDOVJFQMPLCF0G0W0NTDUPTXHC15MYAB0BHAPH&v=20161005";
      // https://api.foursquare.com/v2/venues/search?ll=32.912365,-96.959327&limit=1&oauth_token=E0L0WENNP3BDOVJFQMPLCF0G0W0NTDUPTXHC15MYAB0BHAPH&v=20161005


      // "https://api.foursquare.com/v2/venues/search?ll="+lat+","+lng+",
  // $.getJSON(fourSquareUrl, function(data) {
  //     console.log(data);

  //   });

    function selectMarker(id) {
      $.each(markers, function() {
        if(this.id == id) {
          // largeInfowindow.close();
          infoWindow.setContent('<div>' + this.title + '</div>');
          infoWindow.open(map,this);
        }

        infoWindow.addListener('closeclick', function() {
          infoWindow.marker = null;
        });
      });
    }
    selectMarker(index);
  }

  function showHideMarker(id, showHide) {
    $.each(markers, function() {
      if (this.id == id && showHide === true)
        this.setVisible(true);

      if (this.id == id && showHide === false)
        this.setVisible(false);
    });
  }
}
 
$(document). ready(function() {
  ko.applyBindings(new ViewModel());
});
