goog.require('rememberme.geo.Locator');
goog.require('rememberme.webgl.CardDeck');
goog.require('rememberme.cssviz.CardTorus');



/********************************
 * CRUD functions start here
 ********************************/
/**
 * Show the create card panel
 */
function showCreatePanel() {
	goog.soy.renderElement(document.querySelector('#cardData'), rememberme.template.createCardPanel);
	document.querySelector('#desktopDisplay').style.display = 'none';
	document.querySelector('#cardData').style.display = 'block';
	
	// Get the location of the user
	statusMessage('Acquiring location; your browser may request authorization.', false);
	rememberme.geo.Locator.acquireGeoLocation(statusMessage);
}

/**
 * Handle the creation of a card
 */
function handleCreate() {
  // Hide the form submit
  document.querySelector('#cardPanel').style.display = 'none';
  statusMessage('Adding card ...', false);
  workUpdate(true);
  
	var lat = rememberme.geo.Locator.latitude;
	var lng = rememberme.geo.Locator.longitude;
	
    // 3-part operation
	var uploadUrl = '';
	
	// Step 1: Get the Blobstore URL by calling a servlet
	var http1 = new goog.net.XhrIo();
	http1.send('/uploadUrl', 'GET');
	goog.events.listen(http1, goog.net.EventType.COMPLETE, function(e) {
	  if (this.isSuccess()) {
		  var x = this.getResponseJson();
		  uploadUrl = x.uploadUrl;
		  if (uploadUrl == '') {
			  statusMessage('Failed to add card to deck, BlobStore upload URL failed [' + this.getLastError() + ']', true);
			  document.querySelector('#cardPanel').style.display = 'block';
			  workUpdate(false);
			  return;
		  }
		  
		  // Step 2: Send the file to Blobstore
		  var http = new goog.net.XhrIo();
		  var blob = new Blob(
				  [document.getElementById('img').src], {type: 'image/png'});
		  
		  var formData = new FormData();
		  var input = document.querySelector('input[type=file]');
		  if (input.files.length > 0) {
			  var file = input.files[0];
			  formData.append("myFile", file);
			  http.send(uploadUrl, 'POST', formData);
			  
			  goog.events.listen(http, goog.net.EventType.COMPLETE, function(e) {
				  if (this.isSuccess()) {
					  var x = this.getResponseJson();
					  
					  // Step 3: Store the card details using the API
					  var card = {
						  'name': document.querySelector('#cardName').value,
						  'thumbnailUrl': x.thumbnailUrl,
						  'fullUrl': x.fullUrl,
						  'latitude': lat,
						  'longitude': lng
					  };
					  gapi.client.businesscard.create(card).execute(function(resp) {
						  statusMessage('Successfully added card to deck', false);
						  handleList();
					  });
				  } else {
					  statusMessage('Failed to add card to deck, API call failed [' + this.getLastError() + ']', true);
					  document.querySelector('#cardPanel').style.display = 'block';
				  }
			  });
		  }
	  } else {
		  statusMessage('Failed to add card to deck, image upload failed [' + this.getLastError() + ']', true);
		  document.querySelector('#cardPanel').style.display = 'block';
	  }
	});
	
	workUpdate(false);
}

/**
 * Show the card deck
 */
function handleList() {
	statusMessage('Loading Business Cards ...', false);
	document.querySelector('#cardData').style.display = 'none';
    document.querySelector('#desktopDisplay').style.display = 'block';
    goog.soy.renderElement(document.querySelector('#desktopDisplay'), rememberme.template.cardDisplayPanel);
    gapi.client.businesscard.list({}).execute(displayBusinessCards);
}

/**
 * Handle an update to a card
 */
function handleUpdate() {
	var elt = document.querySelector('#cardName');
	if (elt.disabled) {
		// First step is to allow editing of the input field
		elt.disabled = false;
		document.querySelector('#updateCardButton').value = 'Save Changes';
	} else {
		// Update the Business Card
		document.querySelector('#cardPanel').style.display = 'none';
		var name = elt.value;
		var fullUrl = document.querySelector('#fullUrl').value;
		var latitude = document.querySelector('#latitude').value;
		var longitude = document.querySelector('#longitude').value;
		var thumbnailUrl = document.querySelector('#thumbnailUrl').value;
		var id = document.querySelector('#cardId').value;

		var updateObject = {id: id, name: name, thumbnailUrl: thumbnailUrl, fullUrl: fullUrl, latitude: latitude, longitude: longitude};
		document.querySelector('#updateCardButton').value = 'Update card';
		
		workUpdate(true);
		gapi.client.businesscard.update(updateObject).execute(showCardUpdateResult);
	}
}

/**
 * Handle deletion of a card
 */
function handleDelete(state) {
	var name = document.querySelector('#cardName').value
	var fullUrl = document.querySelector('#fullUrl').value;
	var longitude = document.querySelector('#longitude').value;
	var latitude = document.querySelector('#latitude').value;
	var created = document.querySelector('#created').value;
	var modified = document.querySelector('#lastModified').value;
	var thumbnailUrl = document.querySelector('#thumbnailUrl').value;
	var id = document.querySelector('#cardId').value;
	var deleteObject = {id: id, name: name, thumbnailUrl: thumbnailUrl, fullUrl: fullUrl, location: location};

	if (state == 1) {
		// Starting point - show confirmation buttons
		goog.soy.renderElement(document.querySelector('#cardData'), rememberme.template.deleteCardConfirmationPanel, {businessCard: deleteObject});
	} else if (state == 2) {
		// User confirms deletion
		workUpdate(true);
		document.querySelector('#deleteCardConfirmationPanel').style.display = 'none';
		gapi.client.businesscard.remove({id: id}).execute(showCardDeleteResult);
	} else if (state == 3) {
		// User cancels deletion
		goog.soy.renderElement(document.querySelector('#cardData'), rememberme.template.businessCard, {businessCard: deleteObject});
	}
}

/********************************
 * CRUD Results functions start here
 ********************************/

/**
 * Show the result of an update operation
 * @param resp The response from the API call
 */
function showCardUpdateResult(resp) {
	if (resp) {
		statusMessage('Successfully updated card', false);
	} else {
		statusMessage('Failed to update card', true);
		document.querySelector('#cardPanel').style.display = 'block';
	}
	workUpdate(false);
	handleList();
}

/**
 * Indicate the result of the card deletion
 * @param resp The response from the API call
 */
function showCardDeleteResult(resp) {
	if (resp) {
		statusMessage('Successfully deleted card', false);
	} else {
		statusMessage('Failed to delete card', true);
		document.querySelector('#deleteCardConfirmationPanel').style.display = 'block';
	}
	workUpdate(false);
	handleList();
}

/********************************
 * Utility functions start here
 ********************************/

/**
 * Show a preview of the card image
 */
function previewPicture() {
  var input = document.querySelector('input[type=file]');
  var file = input.files[0];

  var reader = new FileReader();

  reader.onload = function(e) {
    var dataURL = e.target.result;
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    var img = document.getElementById('img');

    img.onload = function() {
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    img.src = dataURL;
    img.width = 320;
    img.height = 240;
  };

  reader.readAsDataURL(file);
}

/**
 * Show a message that fades away
 * @param message The message to show
 */
function statusMessage(message, isError) {
	if (isError) {
		document.querySelector('#status').style.color = '#ff0000';
	} else {
		document.querySelector('#status').style.color = '#00ff00';
	}
	
	document.querySelector('#status').innerHTML = message;
	
	// Fade back to white after 500ms (same amount of time as the CSS transition)
	setTimeout( function() {
		document.querySelector('#status').style.color = '#ffffff'
	}, 4000);
}

/**
 * Start or stop the work indicator
 * @param toggle True to start the indicator, false to stop
 */
function workUpdate(toggle) {
	if (toggle) {
		document.querySelector('#status').style.backgroundImage = "url('/images/ajax-loader.gif')";
		document.querySelector('#status').style.backgroundRepeat = 'no-repeat';
		document.querySelector('#status').style.backgroundPosition = 'right';
	} else {
		setTimeout( function() {
			document.querySelector('#status').style.backgroundImage = 'none';
			document.querySelector('#status').style.backgroundRepeat = '';
			document.querySelector('#status').style.backgroundPosition = '';
		}, 2000);
	}
}

/**
 * Determine the WebGL capabilities of the browser
 **/
function browserSupportsWebGL() {
  try {
	var canvas = document.createElement('canvas');
	var canvasSupportsWebGl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
	var browserHasGlContext = window.WebGLRenderingContext;
	return (canvasSupportsWebGl && browserHasGlContext);
  } catch(e) {
    return false;
  }
}

/********************************
 * Visualisation and callbacks
 ********************************/

/**
 * Show the business cards using WebGL
 */
function displayBusinessCards(data) {
  workUpdate(true);
	
  if (!data) {
	statusMessage('There was an error calling the API', true);
	workUpdate(false);
    return;
  }

  var businessCards = data.items;
  if (!businessCards || businessCards.length == 0) {
	  businessCards = [];
  }

  var deckElement = document.querySelector('#rolodex');
  var width = deckElement.offsetWidth;
  var height = deckElement.offsetWidth * 3 / 4;
  
  if (browserSupportsWebGL()) {
	  var deck = new rememberme.webgl.CardDeck(deckElement, businessCards, width, height);
	  deck.showCardDetailCallback = showCardDetailCallback;
	  deck.showCardCreateCallback = showCardCreateCallback;
	  rememberme.webgl.CardDeck.instance = deck;
	  deck.init();

  } else {
	  var tmpData = {items: businessCards, showCardDetailCallback: 'showCardDetailCallback'};
	  goog.soy.renderElement(deckElement, rememberme.template.businessCardsNonWebGl, tmpData);
	  
	  var deck = new rememberme.cssviz.CardTorus(document.querySelector('#businessCardsNonWebGl'), businessCards, width, height);
	  deck.showCardDetailCallback = showCardDetailCallback;
	  deck.showCardCreateCallback = showCardCreateCallback;
	  rememberme.cssviz.CardTorus.instance = deck;
	  deck.init();
  }
  statusMessage('Loaded Business Cards', false);
  workUpdate(false);
}

/**
 * The card detail callback - used by the visualisation classes
 */
function showCardDetailCallback(data) {
	goog.soy.renderElement(document.querySelector('#cardData'), rememberme.template.businessCard, data);
	document.querySelector('#cardData').style.display = 'block';
	document.querySelector('#desktopDisplay').style.display = 'none';
	
	// Show the location on a map
	var mapDiv = document.querySelector('#mapdiv');
	var lng = data.businessCard.longitude;
	var lat = data.businessCard.latitude;
	if (lat != 'Unknown' && lng != 'Unknown') {
		mapDiv.style.height = '240px';
		mapDiv.style.width = '320px';
		mapDiv.style.margin = '0 auto';
		var mapObj = new google.maps.Map(mapDiv, {
			center: new google.maps.LatLng(lat, lng),
			zoom: 14, 
			mapTypeControl: false,
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		var mapPoint = new google.maps.LatLng(lat, lng);
		var marker = new google.maps.Marker({
		    position: mapPoint,
		    map: mapObj
		});
		mapObj.panTo(mapPoint);
	} else {
		mapDiv.innerHTML = 'No geolocation data available.';
		mapDiv.style.textAlign = 'center';
		mapDiv.style.clear = 'both';
	}
}

/**
 * The card creation callback - used by the visualisation classes
 */
function showCardCreateCallback() {
  showCreatePanel();
}
