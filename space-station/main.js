let marker = {};
let map = {};

function initMap(lat = 0, long = 0) {
  const myLatLng = { lat: lat, lng: long };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    center: myLatLng,
    mapId: "a2872456102196c6"
  });

  const infowindow = new google.maps.InfoWindow({
    content: `
    <div class="marker-info">
      <h1>International Space Station</h1>
    </div>
    `
  });

  marker = new google.maps.Marker({
    position: myLatLng,
    map,
    title: "International Space Station",
    icon: "launch.png"
  });

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
}



function convertToGoogleLatLng(long, lat) {
  long = parseFloat(long);
  lat = parseFloat(lat)

  return latLong = new google.maps.LatLng(lat, long);
}

function displayCoordsData(long, lat, time) {
  const coordsDiv = document.querySelector('.coords');
  coordsDiv.querySelector('.long').innerText = `Longitude: ${long}`;
  coordsDiv.querySelector('.lat').innerText = `Latitude: ${lat}`;
  coordsDiv.querySelector('.timestamp').innerText = `${new Date(time * 1000)}`;
}

function setMapMarkerPosition(long, lat) {
  latLong = convertToGoogleLatLng(long, lat);
  marker.setPosition(latLong);
}

function centerMarkerOnMap(coordArr) {
  latLong = convertToGoogleLatLng(coordArr[0], coordArr[1]);
  map.panTo(latLong);
}

function convertToJson(response) {
  return response.json();
}

function handleData(data) {
  let { longitude, latitude } = data.iss_position;
  let { timestamp } = data;

  displayCoordsData(longitude, latitude, timestamp);
  setMapMarkerPosition(longitude, latitude);

  return [longitude, latitude];
}

function getSpaceStationCoords() {
  const url = "http://api.open-notify.org/iss-now.json";

  fetch(url).then(convertToJson).then(handleData).then(centerMarkerOnMap);

  setInterval(function() {
    fetch(url).then(convertToJson).then(handleData);
  }, 1000);
}

getSpaceStationCoords();