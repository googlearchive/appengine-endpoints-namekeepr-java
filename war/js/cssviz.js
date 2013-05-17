goog.provide('rememberme.cssviz.CardTorus');

/**
 * @constructor
 */
rememberme.cssviz.CardTorus = function(element, data, w, h) {
	this.instance = null;
	this.showCardDetailCallback = null;
	this.showCardCreateCallback = null;
	this.domElement = element;
	this.businessCards = data;
	this.width = w;
	this.height = h;
	
	this.state = {
		rotation : 0,
		startX: 0,
		endX: 0,
		mouseMoving: false,
		mouseClicked: false,
		swiping: false
	};

	this.transformPropertyNames = [
		'-ms-transform',
		'-moz-transform',
		'-webkit-transform',
		'-o-transform',
		'transform'
	];
	
	this.numCards = data.length;
	if (data.length < 3) {
		this.numCards = 4;
	}

	this.degBetweenCards = 360 / this.numCards;
	this.radius = Math.round(this.width / 2);
	this.cardWidth = this.width / this.numCards + 50;
	this.cardBeingViewed = null;
}

/**
 * Initialise the card torus
 */
rememberme.cssviz.CardTorus.prototype.init = function() {
	// Delete any existing cards - recreate each time
	if (this.domElement.childNodes.length > 0) {
		for (var i = 0; i < this.domElement.childNodes.length; i++) {
			this.domElement.removeChild(this.domElement.childNodes[i]);
		}
	}
	
	// Event listeners to handle scroll by keyboard, mouse and touch
	document.addEventListener('keydown', this.scrollDeck, false);
	document.addEventListener('mousedown', this.startMouseMove, false);
	document.addEventListener('mousemove', this.moveMouse, false);
	document.addEventListener('mouseup', this.stopMouseMove, false);
	this.domElement.addEventListener('touchstart', this.startSwipe, false);
	this.domElement.addEventListener('touchmove', this.endSwipe, false);
	window.addEventListener('resize', this.onWindowResize, false);
	
	var len = this.businessCards.length;
	var i = len;
	if (len < 3) {	
		// Add blank cards to fill to 3
		for (; i < 3; i++) {
			var tmp = {
				id: -1,
				thumbnailUrl: '/images/card-place-holder.png',
				fullUrl: '/images/card-place-holder.png',
				created: '2013-04-12T18:00:50.300+02:00',
				lastModified: '2013-04-12T18:00:50.300+02:00',
				name: 'moarcard' + i
			};
			this.businessCards.push(tmp);
		}
		
	}
	// Always put a card for adding other cards
	var tmp = {
			id : -1,
			thumbnailUrl : '/images/card-place-holder.png',
			fullUrl : '/images/card-place-holder.png',
			created : '2013-04-12T18:00:50.300+02:00',
			lastModified : '2013-04-12T18:00:50.300+02:00',
			name : 'moarcard' + (i++)
	};
	this.businessCards.push(tmp);
	
  this.numCards = this.businessCards.length;
  this.degBetweenCards =  360 / this.numCards;
	
	for (var i = 0; i < this.businessCards.length; i++) {
		// Create the card elements and rotate them
		var card = this.businessCards[i];
		var img = document.createElement('img');
		var a = document.createElement('a');
		a.setAttribute('href', '#');
		a.addEventListener('click', rememberme.cssviz.CardTorus.stopMouseMove, false);
		
		var cardAngle = this.degBetweenCards * i;
		
		img.src = card.thumbnailUrl;
		img.dataset.cardId = card.id;
		
		img.style.width = Math.round(this.cardWidth) + 'px';
		img.style.height = Math.round(this.cardWidth / (4 / 3)) + 'px';
		this.domElement.style.width = Math.round(this.cardWidth) + 20 + 'px';
		this.domElement.style.height = Math.round(this.cardWidth / (img.style.width / img.style.height)) + 20 + 'px';
		
		if (this.cardWidth < 100) {
			img.style.width = '100px';
			img.style.height = '75px';
			this.domElement.style.width  = '120px';
			this.domElement.style.height  = '95px';
		}
		
		for ( var j = 0; j < this.transformPropertyNames.length; j++) {
			var pn = this.transformPropertyNames[j];
			img.style[pn] = ' rotateY(' + cardAngle + 'deg)' +
				' translateZ(' + this.radius + 'px) ';
		}
		
		a.appendChild(img);
		this.domElement.appendChild(a);
		
	}

	// Update the rotation of the main element
	this.updateRotation();
};

/**
 * Update the transforms of the cards
 */
rememberme.cssviz.CardTorus.prototype.updateRotation = function() {
	for ( var j = 0; j < this.transformPropertyNames.length; j++) {
		var pn = this.transformPropertyNames[j];
		this.domElement.style[pn] =  ' rotateX(-5deg)' +
			' translateZ(-' + this.radius + 'px)' +
			' rotateY(' + this.state.rotation + 'deg)';
	}
};

/**
 * Scroll the rolodex based on the key pressed
 */
rememberme.cssviz.CardTorus.prototype.scrollDeck = function(event) {
  var deck = rememberme.cssviz.CardTorus.instance;
  switch (event.keyCode) {
  	case 37: 
  	  deck.state.rotation -= deck.degBetweenCards;
  	  deck.updateRotation();
  	  event.preventDefault(); 
  	  break;
  	case 39: 
  	  deck.state.rotation += deck.degBetweenCards;
  	  deck.updateRotation();
  	  event.preventDefault();
  	  break;
  }
};

/**
 * Update the rolodex based on the movement of a swipe
 */
rememberme.cssviz.CardTorus.prototype.endSwipe = function(event) {
  var deck = rememberme.cssviz.CardTorus.instance;

  deck.state.endX = event.touches[0].pageX;
  if (deck.state.swiping) {
	  if (deck.state.endX < deck.state.startX) {
		  // Left swipe
		  deck.state.rotation -= deck.degBetweenCards; 
		  deck.updateRotation();
		  deck.state.swiping = false;
	  } else if (deck.state.endX > deck.state.startX) {
		  // Right swipe
		  deck.state.rotation += deck.degBetweenCards; 
		  deck.updateRotation();
		  deck.state.swiping = false;
	  }
	  event.preventDefault();
  }
};

/**
 * Start recording a swipe gesture
 */
rememberme.cssviz.CardTorus.prototype.startSwipe = function(event) {
	  var deck = rememberme.cssviz.CardTorus.instance;
	  deck.state.startX = event.touches[0].pageX;
	  deck.state.swiping = 1;
};

/**
 * Start of a mouse drag
 */
rememberme.cssviz.CardTorus.prototype.startMouseMove = function(event) {
	var deck = rememberme.cssviz.CardTorus.instance;
	deck.state.startX = event.clientX - event.target.offsetLeft;
	deck.state.mouseClicked = true;
};

/**
 * Mouse drag
 */
rememberme.cssviz.CardTorus.prototype.moveMouse = function(event) {
	var deck = rememberme.cssviz.CardTorus.instance;
	if (deck.state.mouseClicked) {
		
		var curX = event.clientX - event.target.offsetLeft;
		if (deck.state.startX != curX) {
			deck.state.mouseMoving = true;
		} else {
			deck.state.mouseMoving = false;
		}
	}
};

/**
 * End of a drag
 */
rememberme.cssviz.CardTorus.prototype.stopMouseMove = function(event) {
	var deck = rememberme.cssviz.CardTorus.instance;
	
	if (deck.state.mouseClicked && deck.state.mouseMoving) {
		deck.state.endX = event.clientX - event.target.offsetLeft;
		if (deck.state.endX > deck.state.startX) {
			deck.state.rotation += deck.degBetweenCards;
			deck.updateRotation();
		} else if (deck.state.endX < deck.state.startX) {
			deck.state.rotation -= deck.degBetweenCards;
			deck.updateRotation();
		}
		event.preventDefault();
		deck.state.mouseMoving = false;
		deck.state.mouseClicked = false;
	} else {
		// Grab the id of the clicked card
		var deck = rememberme.cssviz.CardTorus.instance;
		var cardId = event.target.dataset.cardId;
		var cardObject = null;
		
		for (var i = 0; i < deck.businessCards.length; i++) {
			if (deck.businessCards[i].id == cardId) {
				cardObject = deck.businessCards[i];
				break;
			}
		}
		
		// Toggle the clicked-card's border if a card was clicked
		if (cardObject) {
			if (deck.cardBeingViewed) {
				deck.cardBeingViewed.style.border = '1px solid black';
			}
			event.target.style.border = '5px solid red';
			deck.cardBeingViewed = event.target;
		
			if (cardObject.id == -1) {
				deck.showCardCreateCallback();
			} else {
				deck.showCardDetailCallback({businessCard: cardObject});
			}
		}
	}
};
