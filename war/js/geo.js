goog.provide('rememberme.geo.Locator');

/**
 * This is an example of using a namespace for a collection of "static" functions.
 * In the savePosition method, "this" refers to "window" rather than the object that the function belongs to
 */

rememberme.geo.Locator.latitude = 'Unknown';
rememberme.geo.Locator.longitude = 'Unknown';
rememberme.geo.Locator.statusCallback = null;

/**
 * Acquire the location of the user
 */
rememberme.geo.Locator.acquireGeoLocation = function(callback) {
  rememberme.geo.Locator.statusCallback = callback;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(rememberme.geo.Locator.savePosition, rememberme.geo.Locator.onGeoError);
  } else {
	  rememberme.geo.Locator.statusCallback('Geolocation not supported by browser', true);
  }
};

/**
 * Handle an error with geolocation
 * @param error Details of the error
 */
rememberme.geo.Locator.onGeoError = function(error) {
	rememberme.geo.Locator.statusCallback('Geolocation supported by browser but failed to acquire location', true);
};

/**
 * Store the geolocated position
 * @param position an object containing the co-ordinates
 */
rememberme.geo.Locator.savePosition = function(position) {
	rememberme.geo.Locator.latitude = position.coords.latitude;
	rememberme.geo.Locator.longitude = position.coords.longitude;
	rememberme.geo.Locator.statusCallback('Acquired Geolocation from browser: (' + rememberme.geo.Locator.latitude + ',' + rememberme.geo.Locator.longitude + ')', false);
};