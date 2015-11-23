var latlon_ddmm = document.getElementById("latlon_ddmm");
var latlon_dec = document.getElementById("latlon_dec");
var accuracy = document.getElementById("accuracy");
var timestamp = document.getElementById("timestamp");
var altitude = document.getElementById("altitude");
var altitudeAccuracy = document.getElementById("altitudeAccuracy");
var contentListGroup = document.getElementById("contentListGroup");
var spinner = document.getElementById("spinner");

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    return 'ios';

  }
  else if( userAgent.match( /Android/i ) )
  {

    return 'android';
  }
  else
  {
    return 'unknown';
  }
}

var mobileOperatingSystem = getMobileOperatingSystem();

function showSpinner(show){
  if (show){
    spinner.classList.remove("hidden");
    contentListGroup.classList.add("hidden");
  }
  else{
    spinner.classList.add("hidden");
    contentListGroup.classList.remove("hidden");
  }
}

function setSMSLink(element,text,d){
  element.innerHTML = text;
  if (mobileOperatingSystem === 'ios'){
    element.setAttribute("href", "sms:&body="+text + ' ['+d.toLocaleTimeString()+']');
  }else {
    element.setAttribute("href", "sms:?body="+text + ' ['+d.toLocaleTimeString()+']');
  }
}

function onSuccess(pos) {
  showSpinner(false);
  var coords = pos.coords;
  var latLon = new LatLon(coords.latitude, coords.longitude);
  var d = new Date();

  setSMSLink(latlon_ddmm,latLon.toString('dm', 4),d);
  setSMSLink(latlon_dec,parseFloat(coords.latitude).toFixed(6) +' '+parseFloat(coords.longitude).toFixed(7), d);
  accuracy.innerHTML = '±'+parseFloat(coords.accuracy).toFixed(0) +'m';
  altitude.innerHTML = coords.altitude ? parseFloat(coords.altitude).toFixed(1) +'m' : '';
  altitudeAccuracy.innerHTML = coords.altitudeAccuracy ? '±'+parseFloat(coords.altitudeAccuracy).toFixed(0)+'m' : '';
  timestamp.innerHTML = d.toLocaleString();
};

function onError(err) {
  showSpinner(false);
  console.warn('ERROR(' + err.code + '): ' + err.message);
};
function onProgress(){
  showSpinner(true);
}

showSpinner(true);
navigator.geolocation.getAccurateCurrentPosition(onSuccess, onError, onProgress, {desiredAccuracy:20, maxWait:15000});
