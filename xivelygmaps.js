/**
 * Created by inyun2u on 14. 5. 19.
 */// xively-gmaps
// version 0.1.1
// (c) 2013 Xively Ltd (LogMeIn Inc.)
// http://xively.github.com/xively-gmaps/
// BSD 3-Clause license

var xivelyGmaps = (function ($) {
    "use strict";

    var methods,
        APIendpoint = "https://api.xively.com/v2/",
        WSendpoint = "wss://api.xively.com:8080/",
        previousLocation,
        previousValue,
        map,
        marker,
        mapElement = "#map-canvas";


    methods = {
        setKey: function (apiKey) {
            xively.setKey(apiKey);
        },

        setApiEndpoint: function (api_endpoint) {
            xively.setEndpoint(api_endpoint || APIendpoint)
        },

        setWsEndpoint: function (ws_endpoint) {
            xively.setWSEndpoint();
        },

        subscribe: function (feed_id) {
            var self = this;
            xively.feed.get(feed_id, function (feedData) {
                self.renderMap(feedData);
            });

            xively.feed.subscribe(feed_id, function (event, feedData) {
                self.renderMap(feedData);

            });
        },

        setMapElement: function (ele) {
            mapElement = ele;
        },

        renderMap: function (feedData) {
            var self = this;
            var location = feedData.location;
            var cur_value = feedData.datastreams[4].current_value;

            if (feedData) {
                var position = new google.maps.LatLng(location.lat, location.lon);
                var markerTitle = "Feed id: " + feedData.id + "\n" +
                    "Latitude: " + location.lat + "\n" +
                    "Longitude: " + location.lon + "\n" +
                    "value" + feedData.datastreams[4].current_value;

                if (typeof (previousLocation) === 'undefined') {
                    var mapOptions = {
                        center: position,
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROAD_MAP
                    };

                    map = new google.maps.Map($(mapElement)[0], mapOptions);
                    self.setMarker(position, markerTitle, feedData);

                } else if ((previousValue !== cur_value)) { //값의 변화가 있을 경우
                    marker.setMap(null); //현재 마커와 지도의 매핑 해제
                    self.setMarker(position, markerTitle, feedData); //새로운 마커를 생성하여 등록
                }
                previousValue = cur_value;
                previousLocation = location;
            } else {
                $(mapElement).html("Awaiting Location Data");
            }
        },

        checkValidLocation: function (location) {
            return location && location.lat && location.lon;
        },

        setMarker: function (position, title, feedData) {

            marker = new google.maps.Marker({
                position: position,
                map: map,
                zoom: 13,
                title: title,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'red',
                    fillOpacity: 1,
                    scale: Math.log(feedData.datastreams[4].current_value) * 10 / Math.PI,
                    strokeColor: 'white',
                    strokeWeight: .5
                }
            });
            //}

        }
    }

    return methods;
})(jQuery);