//sync profile data
var user_position_data = {
  'lat': '',
  'lng': '',
  'city': '',
  'state': '',
  'country': ''
};

//murital murhamed airport
var lastgps = '6.5779976,3.3288193';

if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
					_location = position.coords.latitude + "," + position.coords.longitude;
					console.log("Detected gps via browser is "+_location);

          gps_location(_location);
				});
} else {
	console.log("Unable to detect gps via browser");
}

//receive gps location from device
function gps_location(loc) {

  if (loc != lastgps) {
    location_changed();
  }

  lastgps = loc;
}

//location changed handler
function location_changed() {
  if (typeof(applet) != 'undefined' && typeof(applet.acceptLocation) == 'function') {

    user_position_data.lat = lastgps.split(',')[0];
    user_position_data.lng = lastgps.split(',')[1];

    latlng = new google.maps.LatLng(user_position_data.lat, user_position_data.lng);
    geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      'latLng': latlng
    }, function(results, status) {

      city = '';
      state = '';
      country = '';

      if (status == google.maps.GeocoderStatus.OK && results[1]) {

        loc1 = results[0];
        //console.log(loc1);

        $.each(loc1, function(k1, v1) {
          if (k1 == "address_components") {
            for (var i = 0; i < v1.length; i++) {
              for (k2 in v1[i]) {
                if (k2 == "types") {
                  var types = v1[i][k2];
                  if (types[0] == "administrative_area_level_1") {
                    state = v1[i].long_name;
                  }
                  if (types[0] == "locality") {
                    city = v1[i].long_name;
                  }
                  if (types[0] == "country") {
                    country = v1[i].long_name;
                  }

                }

              }

            }
          }
        });

        if (typeof(city) == 'undefined') {
          city = '';
        }
        if (typeof(state) == 'undefined') {
          state = '';
        }
      } else {
      }

      //add city, state and country
      user_position_data.city = city;
      user_position_data.state = state;
      user_position_data.country = country;

      applet.acceptLocation(user_position_data, true);
    });

    applet.acceptLocation(user_position_data, false);
  }
}

(function($) {

  $.fn.gmap = function(options) {
    var _self = this;

    _self.params = $.extend({
      lat: 6.524,
      lng: 3.379,
      fixedpointer: false, //when enabled you cannot drag or double-click to shift pointers
      queryLocationNameWhenLatLngChanges: true,
      queryElevationWhenLatLngChanges: true,
      mapOptions: {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
        zoomControlOptions: true,
        streetViewControl: false,
        panControl: false,
        scrollwheel: false,
        zoom: 17
      },
      strings: {
        markerText: "Drag this Marker",
        error_empty_field: "Couldn't find coordinates for this place",
        error_no_results: "Couldn't find coordinates for this place"
      },
      displayError: function(message) {
        walert(message);
      }
    }, options);


    //internal vars
    _self.vars = {
      map: null,
      service: null,
      infowindow: null,
      marker: null,
      marker2: null,
      position: null, //current position
      LATLNG: null,
      coords: null, //mark coordinate
      route: null, //mark route
      route_start: null,
      route_end: null,
      route_busy: false,
      route_directions: true,
      gmarkers: [],
      icons: {
        start: new google.maps.MarkerImage(
          "dist/assets/img/pegman.png", // "mk/panda-" + i + ".png",
          new google.maps.Size(49, 52), // size
          new google.maps.Point(0, 0), // origin
          new google.maps.Point(25, 36) // anchor
        ),
        car: new google.maps.MarkerImage(
          // URL
          'dist/assets/img/car.png',
          // (width,height)
          new google.maps.Size(24, 24),
          // The origin point (x,y)
          new google.maps.Point(0, 0),
          // The anchor point (x,y)
          new google.maps.Point(22, 32)),
        end: new google.maps.MarkerImage(
          // URL
          'dist/assets/img/package.png',
          new google.maps.Size(24, 24), // (width,height)
          new google.maps.Point(0, 0), // The origin point (x,y)
          new google.maps.Point(20, 20)) // The anchor point (x,y)
      },

      myPano: null,
      panoClient: null,
      nextPanoId: null,
      timerHandle: null,
      polyline: null,
      poly2: null,
      strokeWeight: 10,
      strokeColor: '#0000FF',
      strokeOpacity: 0.5,

      step: 1, // 5; // metres
      tick: 50, // milliseconds
      eol: null,
      k: 0,
      stepnum: 0,
      speed: "",
      lastVertex: 1,
      ver: 1
    };


    //store info here
    _self.details = {
      lat: '',
      lng: '',
      city: '',
      state: '',
      country: ''
    };

    _self.vars.mapOptions = _self.params.mapOptions;

    //get variable from details
    this.get = function(v) {
      return typeof(_self.details[v]) == 'undefined' ? '' : _self.details[v];
    };

    //get address of a point
    this.getDetails = function() {
      position = _self.vars.position;

      var latlng = new google.maps.LatLng(position.lat(), position.lng());
      _self.vars.geocoder.geocode({
        'latLng': latlng
      }, function(results, status) {

        var city = '';
        var state = '';
        var country = '';
        var address = '';
        var place = '';

        if (status == google.maps.GeocoderStatus.OK && results[1]) {

          var loc1 = results[0];
          //console.log(loc1);
          //console.log(results);

          $.each(loc1, function(k1, v1) {
            if (k1 == "address_components") {
              for (var i = 0; i < v1.length; i++) {
                for (k2 in v1[i]) {
                  if (k2 == "types") {
                    var types = v1[i][k2];
                    if (types[0] == "administrative_area_level_1") {
                      state = v1[i].long_name;
                    }
                    if (types[0] == "locality") {
                      city = v1[i].long_name;
                    }
                    if (types[0] == "country") {
                      country = v1[i].long_name;
                    }

                  }

                }

              }
            }
          });

          if (typeof(city) == 'undefined') {
            city = '';
          }
          if (typeof(state) == 'undefined') {
            state = '';
          }

          address = results[1].formatted_address;
          place = results[1].place_id;
        }

        _self.details = {
          lat: _self.vars.position.lat(),
          lng: _self.vars.position.lng(),
          city: city,
          state: state,
          country: country,
          address: address,
          place: place
        };

        $(_self.vars.cssID + ".gllpLongitude").val(_self.details.lat);
        $(_self.vars.cssID + ".gllpLatitude").val(_self.details.lng);

        $(_self.vars.cssID + ".gllpCity").val(city);
        $(_self.vars.cssID + ".gllpState").val(state);
        $(_self.vars.cssID + ".gllpCountry").val(country);

        $(_self.vars.cssID + ".gllpLocationName").val(address);
        $(_self.vars.cssID + ".gllpLocationName2").html(address);
      });

    };

    this.getPlaceDetails = function(placeId) {
      if (typeof(placeId) == 'undefined') {
        placeId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
      }
      request = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'place_id', 'geometry']
      };

      _self.vars.service.getDetails(request, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log('<div><strong>' + place.name + '</strong><br>' +
            'Place ID: ' + place.place_id + '<br>' +
            place.formatted_address + '</div>');
        }
      });
    };

    //put the focus on the map
    this.focusMap = function() {
      var desiredHeight = $(window).height() + 300;
      $('body, html').animate({
        scrollTop: 100
      }, 300);
    };


    //get my location
    this.mylocation = function() {
      lat = lastgps.split(',')[0];
      lng = lastgps.split(',')[1];

      position = new google.maps.LatLng(lat, lng);
      setPosition(position);
    };


    //change map coords
    this.setCoords = function(lat, lng) {
      coords = {
        lat: lat,
        lng: lng
      };
      //if (_.isEqual(coords, _self.vars.coords)) {
      //  return;
      //}
      _self.vars.coords = coords;

      position = new google.maps.LatLng(lat, lng);
      setPosition(position);
    };


    //private methods
    var setPosition = function(position) {
      //store for future use
      _self.vars.position = position;

      _self.vars.marker.setPosition(position);
      _self.vars.map.panTo(position);

      _self.getDetails();
    };

    var nearBySearch = function() {
      startSearch("Search for nearby locations", "Nearby");

      if (typeof(lastgps) == 'undefined') {
        lastgps = "-33.866651,151.195827"; //australia

        //lastgps="36.8508646,-76.1354378";
      }
      p = lastgps.split(',');
      pos = new google.maps.LatLng(p[0], p[1]);

      //pan to new position
      setPosition(pos);

      var request = {
        location: pos,
        radius: '500',
        fields: ['name', 'geometry', 'formatted_address'],
      };


      _self.vars.service.nearbySearch(request, function(results, status) {
        searchResult(results, status);
      });

    };

    this.clearRoute = function() {

      if (_self.vars.timerHandle) {
        clearTimeout(_self.vars.timerHandle);
      }


      if (_self.vars.polyline && typeof(_self.vars.polyline.Clear) == 'function') {
        _self.vars.polyline.Clear();
      }

      if (_self.vars.poly2 && typeof(_self.vars.poly2.Clear) == 'function') {
        _self.vars.poly2.Clear();
      }

      _self.clearMarkers();

      $(_self.vars.cssID + ".gllpDistance").html('').hide();
      $(_self.vars.cssID + ".gllpDirections").html('').hide();

    };

    this.showDirections = function(opt) {
      _self.vars.route_directions = opt;
    };

    this.setRoute = function(route) {

      _self.vars.route_busy = true;

      if (_self.vars.timerHandle) {
        clearTimeout(_self.vars.timerHandle);
      }

      if (_self.vars.marker && typeof(_self.vars.marker.setMap) == 'function') {
        _self.vars.marker.setMap(null);
      }

      if (_self.vars.marker2 && typeof(_self.vars.marker2.setMap) == 'function') {
        _self.vars.marker2.setMap(null);
      }


      _self.vars.polyline = new google.maps.Polyline({
        path: [],
        strokeColor: _self.vars.strokeColor,
        strokeWeight: _self.vars.strokeWeight,
        strokeOpacity: _self.vars.strokeOpacity
      });
      _self.vars.poly2 = new google.maps.Polyline({
        path: [],
        strokeColor: _self.vars.strokeColor,
        strokeWeight: _self.vars.strokeWeight,
        strokeOpacity: _self.vars.strokeOpacity
      });

      _self.vars.polyline.setMap(null);
      _self.vars.poly2.setMap(null);

      _self.vars.route = route;

      _self.clearMarkers();



      origin = new google.maps.LatLng(route[0].lat, route[0].lng);
      destination = new google.maps.LatLng(route[1].lat, route[1].lng);

      if (typeof(route[2]) == "undefined") {
        route[2] = route[1];
      }
      pan = new google.maps.LatLng(route[2].lat, route[2].lng);



      //store markers
      _self.route_start = origin;
      _self.route_end = destination;
      _self.route_pan = pan;

      //last movement point
      _self.last_point = origin;

      //total coverage
      _self.mileage = 0;

      _self.vars.directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
          avoidTolls: true,
          avoidHighways: false,
        },
        function(response, status) {
          if (status === 'OK') {

            var route = response.routes[0];
            _self.vars.startLocation = new Object();
            _self.vars.endLocation = new Object();

            // For each route, display summary information.
            var path = response.routes[0].overview_path;
            var legs = response.routes[0].legs;


            //store legs
            _self.vars.legs = legs;


            //console.log(JSON.stringify(legs));

            for (i = 0; i < legs.length; i++) {
              if (i == 0) {
                _self.vars.startLocation.latlng = legs[i].start_location;
                _self.vars.startLocation.address = legs[i].start_address;
                _self.vars.marker = _self.createMarker(legs[i].start_location, _self.vars.icons.start, "start", legs[i].start_address, "green");
              }


              _self.vars.endLocation.latlng = legs[i].end_location;
              _self.vars.endLocation.address = legs[i].end_address;
              var steps = legs[i].steps;
              for (j = 0; j < steps.length; j++) {


                var nextSegment = steps[j].path;
                for (k = 0; k < nextSegment.length; k++) {
                  _self.vars.polyline.getPath().push(nextSegment[k]);
                }
              }
            }


            //set second marker
            _self.vars.marker2 = _self.createMarker(_self.route_end, _self.vars.icons.end, "Destination", "", "green");


            _self.vars.polyline.setMap(_self.vars.map);


            _self.vars.route_busy = false;

            //drive to pan position
            _self.driveTo(_self.route_pan.lat(), _self.route_pan.lng());

            //_self.panTo(_self.vars.startLocation.latlng);

            //_self.startAnimation();

          } else {
            //console.log('Directions request failed due to ' + status);
          }
        });

    };


    _self.degreesToRadians = function(degrees) {
      return degrees * Math.PI / 180;
    };

    _self.strip_tags = function(str) {
      if ((str === null) || (str === ''))
        return false;
      else
        str = str.toString();
      return str.replace(/(<([^>]+)>)/ig, '');
    };

    //distance is in meters
    _self.formatDistance = function(dist) {
      min = 0.2; //minimum unit


      unit = {
        mls: parseFloat(dist / 1609.34).toFixed(2),
        klm: parseFloat(dist / 1000).toFixed(2),
        ft: parseFloat(dist / 0.3048).toFixed(2),
      }

      //console.log("Distancia: "+dist+" mls: "+unit.mls+"  klm:"+unit.klm+" ft:"+unit.ft);

      symb = 'mls';

      if (unit.mls < min) {
        symb = 'klm';
      }

      if (symb == 'klm' && unit.klm < min) {
        symb = 'ft';
      }

      return unit[symb] + ' ' + symb;
    };


    //find distance between 2 in meters
    _self.distanceBetween = function(latitude1, longitude1, latitude2, longitude2) {
      distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));
      return distance;
    }



    _self.findPoint = function(lat, lng) {
      minDist = null;

      pdata = {
        'leg': null,
        'step': null,
        'path': null,
        'finish': false,
      };

      legs = _self.vars.legs;

      coverage = 0; //distance covered
      maxdistance = 0;

      //calc total distance
      for (i = 0; i < legs.length; i++) {
        maxdistance += legs[i].distance.value;
      }


      for (i = 0; i < legs.length; i++) {
        coverage = 0;

        steps = legs[i].steps;
        for (j = 0; j < steps.length; j++) {

          coverage += steps[j].distance.value;

          //get the steps in a path
          var nextSegment = steps[j].path;


          var instructions = steps[j].instructions;
          var maneuver = steps[j].maneuver;

          for (k = 0; k < nextSegment.length; k++) {

            _lat = nextSegment[k].lat();
            _lng = nextSegment[k].lng();

            markerDist = _self.distanceBetween(lat, lng, _lat, _lng);

            if (minDist == null || minDist > markerDist) {
              minDist = markerDist;

              left = maxdistance - coverage;

              if (i == legs.length - 1 && j == steps.length - 1 && k == nextSegment.length - 1) {
                pdata.finish = true;
                dleft = 0;
              } else {
                pdata.finish = false;
              }

              pdata.lat = _lat;
              pdata.lng = _lng;
              pdata.left = left;
              pdata.distance = _self.formatDistance(left);
              pdata.maxdistance = maxdistance;
              pdata.leg = i;
              pdata.step = j;
              pdata.path = k;
              pdata.maneuver = maneuver;
              pdata.instructions = _self.strip_tags(instructions);
            }
          }
        }
      }

      return pdata;
    };

    //jump to pretty much anywhere
    this.driveTo = function(lat, lng) {
      position = new google.maps.LatLng(lat, lng);

      if (_self.vars.route_busy) {
        _self.route_pan = position;
        return;
      }

      //console.log("Driving to " + lat + "," + lng);

      _self.vars.map.panTo(position);
      _self.vars.marker.setPosition(position);


      if (google.maps.geometry.poly.containsLocation(position, _self.vars.polyline)) {
        ongrid = true;
        //console.log("On za line");
      } else {
        ongrid = false;
        //console.log("Off za line");
      }

      info = _self.findPoint(lat, lng);

      left = _self.distanceBetween(info.lat, info.lng, _self.route_end.lat(), _self.route_end.lng());


      distance = _self.formatDistance(left);

      if (typeof(applet) != 'undefined' && typeof(applet.distance_left) == 'function') {
        applet.distance_left(left);
        return;
      }

      if (info.finish == true) {
        directions = "You are at your destination";
        $(_self.vars.cssID + ".gllpDistance").hide();
      } else {
        directions = info.instructions;
        $(_self.vars.cssID + ".gllpDistance").show().html(distance);
      }

      if (ongrid == false) {

        //check distance off
        points = _self.distanceBetween(info.lat, info.lng, lat, lng);

        if (points > 24) {
          directions = "Please drive back to the path " + points;
        }
      }

      if (_self.vars.route_directions == true) {
        $(_self.vars.cssID + ".gllpDirections").show().html(directions);
      } else {
        $(_self.vars.cssID + ".gllpDirections").hide();
      }


    };

    this.panTo = function(position) {
      _self.vars.map.panTo(position);
      _self.vars.marker.setPosition(position);


      last = _self.last_point;

      _self.last_point = position;


      lat = position.lat();
      lng = position.lng();

      info = _self.findPoint(lat, lng);


      //total coverage
      _self.mileage += _self.distanceBetween(lat, lng, last.lat(), last.lng());

      left = info.maxdistance - _self.mileage;

      distance = _self.formatDistance(left);


      if (info.finish == true) {
        directions = "You are at your destination";
        $(_self.vars.cssID + ".gllpDistance").hide();
      } else {
        directions = info.instructions;
        $(_self.vars.cssID + ".gllpDistance").show().html(distance);
      }

      $(_self.vars.cssID + ".gllpDirections").show().html(directions);


    };

    this.animate = function(d) {
      if (d > _self.vars.eol) {
        _self.panTo(_self.vars.endLocation.latlng);
        return;
      }
      var p = _self.vars.polyline.GetPointAtDistance(d);
      _self.panTo(p);
      _self.updatePoly(d);
      _self.vars.timerHandle = setTimeout(function() {
        _self.animate(d + _self.vars.step);
      }, _self.vars.tick);
    };

    this.updatePoly = function(d) {
      // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
      if (_self.vars.poly2.getPath().getLength() > 20) {
        _self.vars.poly2 = new google.maps.Polyline([_self.vars.polyline.getPath().getAt(_self.vars.lastVertex - 1)]);
        // map.addOverlay(poly2)
      }

      if (_self.vars.polyline.GetIndexAtDistance(d) < _self.vars.lastVertex + 2) {
        if (_self.vars.poly2.getPath().getLength() > 1) {
          _self.vars.poly2.getPath().removeAt(_self.vars.poly2.getPath().getLength() - 1)
        }
        _self.vars.poly2.getPath().insertAt(_self.vars.poly2.getPath().getLength(), _self.vars.polyline.GetPointAtDistance(d));
      } else {
        _self.vars.poly2.getPath().insertAt(_self.vars.poly2.getPath().getLength(), _self.vars.endLocation.latlng);
      }
    };

    this.startAnimation = function() {

      _self.vars.eol = _self.vars.polyline.Distance();
      _self.vars.map.setCenter(_self.vars.polyline.getPath().getAt(0));

      _self.vars.poly2 = new google.maps.Polyline({
        path: [_self.vars.polyline.getPath().getAt(0)],
        strokeColor: _self.vars.strokeColor,
        strokeWeight: _self.vars.strokeWeight,
        strokeOpacity: _self.vars.strokeOpacity
      });

      setTimeout(function() {
        _self.animate(50)
      }, 2000); // Allow time for the initial map display
    };

    /*
    route = [{
        lat: 6.5359805,
        lng: 3.2824264
      },
      {
        lat: 6.6038835,
        lng: 3.3327518
      }
    ]
    */
    this.setRoute2 = function(route) {

      if (_.isEqual(route, _self.vars.route)) {
        return;
      }
      _self.vars.route = route;

      _self.clearMarkers();

      //console.log(route);
      //return;


      origin = new google.maps.LatLng(route[0].lat, route[0].lng);
      destination = new google.maps.LatLng(route[1].lat, route[1].lng);

      //store markers
      _self.route_start = origin;
      _self.route_end = destination;

      _self.vars.directionsService.route({
          origin: origin,
          destination: destination,
          optimizeWaypoints: true,
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC
        },
        function(response, status) {
          if (status === 'OK') {

            _self.vars.directionsRenderer.setDirections(response);

            var leg = response.routes[0].legs[0];

            $(_self.vars.cssID + ".gllpLocationSummary").html(leg['distance']['text'] + ', ' + leg['duration']['text']);

            //route_start:null,
            //route_end:null,

            makeMarker(leg.start_location, _self.vars.icons.start, "Starting point", _self.vars.map);
            makeMarker(leg.end_location, _self.vars.icons.end, 'Destination', _self.vars.map);


            if (leg['distance']['value'] == 0) {
              $(_self.vars.cssID + ".gllpLocationSummary").hide();
              $(_self.vars.cssID + ".gllpDisplay").hide();
            } else {
              $(_self.vars.cssID + ".gllpLocationSummary").show();
              $(_self.vars.cssID + ".gllpDisplay").show();
            }
          } else {
            //console.log('Directions request failed due to ' + status);
          }
        });
    };


    var makeMarker = function(position, icon, title, map) {
      mrk = new google.maps.Marker({
        position: position,
        map: map,
        icon: icon,
        title: title
      });

      _self.vars.gmarkers.push(mrk);

    };

    //show message
    this.showMessage = function(message) {
      //make marker bounce on map
      //_self.vars.marker.setAnimation(google.maps.Animation.BOUNCE);

      _self.vars.infowindow = new google.maps.InfoWindow({
        content: message,
      });
      _self.vars.infowindow.open(_self.vars.map, _self.vars.marker);
    };

    //hide message
    this.hideMessage = function(message) {
      _self.vars.infowindow.close();
    };

    this.clearMarkers = function() {
      for (i = 0; i < _self.vars.gmarkers.length; i++) {
        _self.vars.gmarkers[i].setMap(null);
      }
    };


    this.createMarker = function(latlng, icon, label, html) {
      // alert("createMarker("+latlng+","+label+","+html+","+color+")");
      var contentString = '<b>' + label + '</b><br>' + html;
      var marker = new google.maps.Marker({
        position: latlng,
        map: _self.vars.map,
        icon: icon,
        //title: label,
        zIndex: Math.round(latlng.lat() * -100000) << 5
      });
      marker.myname = label;
      // gmarkers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
      });

      _self.vars.gmarkers.push(marker);

      return marker;
    };

    this.setupMarker = function() {
      _self.clearMarkers();
      _self.vars.marker = new google.maps.Marker({
        position: _self.vars.LATLNG,
        map: _self.vars.map,
        title: _self.params.strings.markerText,
        draggable: _self.params.fixedpointer == true ? false : true
      });

      _self.vars.gmarkers.push(_self.vars.marker);
    };

    // search function
    this.performSearch = function(string) {
      if (string == "") {
        return;
      }
      searchByName(string);
    };

    var searchByName = function(query) {
      startSearch("Search for " + query, "Search");

      request = {
        query: query,
        fields: ['name', 'geometry', 'formatted_address'],
      };


      _self.vars.service.findPlaceFromQuery(request, function(results, status) {
        searchResult(results, status);
      });

    };

    //show search results
    var searchResult = function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        locales = [];

        for (var i = 0; i < results.length; i++) {
          //console.log(results[i]);

          if (typeof(results[i]['formatted_address']) != 'undefined') {
            //name search
            item = {
              'name': results[i]['name'],
              'address': results[i]['formatted_address'],
              'lat': results[i].geometry.location.lat(),
              'lng': results[i].geometry.location.lng(),
            };

          } else {
            //nearby search
            item = {
              'name': results[i]['name'],
              'address': results[i]['vicinity'],
              'lat': results[i].geometry.location.lat(),
              'lng': results[i].geometry.location.lng(),
            };
          }

          locales.push(item);
        }

        //console.log(locales);
        showSearchResult(locales);

      } else {
        //search error
      }
    };

    var startSearch = function(title, subtitle) {
      return;

      $(_self.vars.cssID + '#nearbyview').html(subtitle);

      $(_self.vars.cssID + '.tabheader').removeClass('hide');
      $(_self.vars.cssID + '.tabs').tabs('select', 'nearview');
      $('.gllpNearby').html("<p style='padding:10px;'>" + title + "...</p>");
    };

    var showSearchResult = function(geodata) {
      _self.setCoords(geodata[0]['lat'], geodata[0]['lng']);

      _self.focusMap();


      return false;

      mdl = '<ul class="collection with-header">';
      mdl += '</ul>';


      $('.gllpNearby').html(mdl);


      coll = $('ul.collection');

      coll.empty();

      str = '<li class="collection-header blue" style="color:#fff;">';
      str += '<h6>Select Nearest Location</h6>';
      str += '</li>';

      coll.append(str);

      for (var key in geodata) {
        result = geodata[key];

        gps = result.lat + ',' + result.lng;

        str = '<li class="collection-item pointer" gps="' + gps + '">';
        str += '<div>' + result.address + '</div>';
        str += '</li>';


        coll.append(str);
      };

      $(coll).find('li.pointer').each(function() {
        $(this).bind("click", function() {

          $(_self.vars.cssID + '.tabs').tabs('select', 'mapview');

          gps = $(this).attr('gps');
          _self.vars.LATLNG = new google.maps.LatLng(gps.split(',')[0], gps.split(',')[1]);

          setPosition(_self.vars.LATLNG);

          //console.log(gps);
        });

      });



    };

    //methods
    this.init = function() {

      if (!$(_self).attr("id")) {
        if ($(_self).attr("name")) {
          $(_self).attr("id", $(_self).attr("name"));
        } else {
          $(_self).attr("id", "_MAP_" + Math.ceil(Math.random() * 10000));
        }
      }

      _self.vars.ID = $(_self).attr("id");
      _self.vars.cssID = "#" + _self.vars.ID + " ";

      if ($(_self.vars.cssID + ".gllpMap").length == 0) {
        return;
      }

      //show map area
      //$(_self.vars.cssID + ".map-area").show();




      _self.vars.mapOptions.center = new google.maps.LatLng(_self.params.lat, _self.params.lng);

      _self.vars.infowindow = new google.maps.InfoWindow();

      _self.vars.directionsService = new google.maps.DirectionsService();


      _self.vars.infowindow = new google.maps.InfoWindow({});

      //setup map
      _self.vars.map = new google.maps.Map(
        $(_self.vars.cssID + ".gllpMap").get(0), _self.vars.mapOptions
      );

      //_self.vars.directionsRenderer.setMap(_self.vars.map);



      _render = {
        map: _self.vars.map,
        suppressMarkers: true
      };
      if ($(_self.vars.cssID + ".gllpDisplay").length != 0) {
        _render.panel = $(_self.vars.cssID + ".gllpDisplay").get(0);
      }

      _self.vars.directionsRenderer = new google.maps.DirectionsRenderer(_render);

      _self.vars.geocoder = new google.maps.Geocoder();

      _self.vars.service = new google.maps.places.PlacesService(_self.vars.map);

      _self.vars.LATLNG = new google.maps.LatLng(_self.params.lat, _self.params.lng);


      _self.setupMarker();


      $(_self.vars.cssID + ".tabs").tabs();

      return _self;
    };

    this.reset = function() {
      //clear events
      google.maps.event.clearListeners(_self.vars.map, 'dblclick');
      google.maps.event.clearListeners(_self.vars.map, 'dragend');

      _self.params.fixedpointer = true;
      _self.clearRoute();
    };

    this.show = function() {
      _self.reset();

      // Search function by search button
      $(_self.vars.cssID + ".gllpSearchButton").bind("click", function() {
        _self.performSearch($(_self.vars.cssID + ".gllpSearchField").val(), false);
      });

      // Search function by search button
      $(_self.vars.cssID + ".gllpLocationButton").bind("click", function() {
        nearBySearch();
      });

      $(_self.vars.cssID + ".map-area").show();

      return _self;
    };

    this.select = function() {
      _self.params.fixedpointer = false;


      lat = lastgps.split(',')[0];
      lng = lastgps.split(',')[1];

      //initialize position
      _self.vars.LATLNG = new google.maps.LatLng(lat, lng);

      _self.setupMarker();

      setPosition(_self.vars.LATLNG);

      // Set position on doubleclick
      google.maps.event.addListener(_self.vars.map, 'dblclick', function(event) {
        setPosition(event.latLng);
      });

      // Set position on marker move
      google.maps.event.addListener(_self.vars.marker, 'dragend', function(event) {
        setPosition(_self.vars.marker.position);
      });

    };


    this.pointer = function() {

      _self.setupMarker();

      //initialize position
      setPosition(_self.vars.LATLNG);
    };

    this.hide = function() {
      _self.reset();

      $(_self.vars.cssID + ".map-area").hide();

      return _self;
    };

    return this;
  };

}(jQuery));
