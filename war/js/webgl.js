goog.provide('rememberme.webgl.CardDeck');

/**
 * @constructor
 */
rememberme.webgl.CardDeck = function(element, data, width, height) {
	this.params = {
		CONTAINER_WIDTH : width,
		CONTAINER_HEIGHT : height,
		CARD_LENGTH : 20,
		CARD_WIDTH : 15,
		ROTATE_TIC : 0.1,
	};

	this.state = {
		targetRotation : 0,
		finishedRotating : false,
		inMotion : false,
		startX: -31415,
		endX: -31415,
		mouseMoving: false,
		mouseClicked: false,
		swiping: false
	};

	this.instance = null;
	this.businessCards = data
	this.domElement = element;
	this.rolodexObject = null;
	this.container = null;
	this.camera = null;
	this.scene = null;
	this.renderer = null;
	this.baseObject = null;
	this.showCardDetailCallback = null;
	this.showCardCreateCallback = null;
	this.degBetweenCards = 0;
};

/**
 * Translate degrees to radians
 * 
 * @param The
 *            number of degrees to convert to radians
 */
rememberme.webgl.CardDeck.prototype.d2r = function(degree) {
	return degree * (Math.PI / 180);
};

/**
 * Get a string representation of an x, y, z tuple
 * 
 * @param x
 * @param y
 * @param z
 */
rememberme.webgl.CardDeck.prototype.pts = function(x, y, z) {
	return '(' + x + ', ' + y + ', ' + z + ')';
};

/**
 * Animate the scene
 */
rememberme.webgl.CardDeck.prototype.animate = function() {
	requestAnimationFrame(this.animate.bind(this));
	this.render();
};

/**
 * Check if a number is in range. true iff base+allowance < num > base -
 * allowance
 */
rememberme.webgl.CardDeck.prototype.inRange = function(num, base, allowance) {
	var res = false;

	if (num == base) {
		res = true;
	}
	if (num > base - allowance && num < base + allowance) {
		res = true;
	}

	return res;
};

/**
 * Add a shape to the scene with an image
 */
rememberme.webgl.CardDeck.prototype.addCardToDeck = function(businessCard, rotation) {
	// Load an image texture for the front of the object
	var imageUrl = businessCard.thumbnailUrl.replace('127.0.0.1', 'localhost');
	var imTexture = THREE.ImageUtils.loadTexture(imageUrl);
	var material = new THREE.MeshBasicMaterial({
		map : imTexture,
	});
	material.map.needsUpdate = true;

	// Map faces to materials
	var materials = [ material, material ];

	// Make the front face and rotate the back face
	var face1 = new THREE.PlaneGeometry(this.params.CARD_LENGTH,
			this.params.CARD_WIDTH);
	var face2 = new THREE.PlaneGeometry(this.params.CARD_LENGTH,
			this.params.CARD_WIDTH);
	var hs = new THREE.Matrix4();
	face2.applyMatrix(hs.makeRotationY(Math.PI));
	THREE.GeometryUtils.merge(face1, face2);

	// Assign material to each face
	face1.materials = materials;
	face1.faces[0].materialIndex = 0;
	face1.faces[1].materialIndex = 1;

	var mesh = new THREE.Mesh(face1, new THREE.MeshFaceMaterial(materials));
	mesh.position.set(0, 0, 0);

	// We want the object to be aligned with the tube
	mesh.applyMatrix(new THREE.Matrix4().makeTranslation(0,
			(this.params.CARD_WIDTH / 2) + 1, 0));

	// Create a rectangular shape for the outline
	var rectShape = new THREE.Shape();
	rectShape.moveTo(0, 0);
	rectShape.lineTo(0, this.params.CARD_WIDTH);
	rectShape.lineTo(this.params.CARD_LENGTH, this.params.CARD_WIDTH);
	rectShape.lineTo(this.params.CARD_LENGTH, 0);
	rectShape.lineTo(0, 0);

	var lgeometry = rectShape.createPointsGeometry();
	var lmaterial = new THREE.LineBasicMaterial({
		linewidth : 2,
		color : 0x000000
	});

	var line = new THREE.Line(lgeometry, lmaterial);
	line.position.set(0, 0, 0);
	line.applyMatrix(new THREE.Matrix4().makeTranslation(
			this.params.CARD_LENGTH / -2, 1, 0));

	// Add to the scene
	var pa = new THREE.Object3D();
	pa.add(mesh);
	pa.add(line);
	pa.rotation.set(0, rotation, 0);
	pa.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, Math
			.round(this.params.CONTAINER_WIDTH / 2)));
	pa.applyMatrix(new THREE.Matrix4().makeRotationY(rotation));
	pa.name = businessCard.id;
	this.rolodexObject.add(pa);
};

/**
 * Initialise the scene
 */
rememberme.webgl.CardDeck.prototype.init = function() {
	// Create the container for the scene
	this.container = document.createElement('div');
	this.container.setAttribute('style', 'width: '
			+ this.params.CONTAINER_WIDTH + 'px; height: '
			+ this.params.CONTAINER_HEIGHT + 'px; '
			+ 'position: relative; top: -100px');

	// Remove the container if it exists
	if (this.domElement.childNodes.length == 1) {
		this.domElement.removeChild(this.domElement.childNodes[0]);
	}
	this.domElement.appendChild(this.container);

	// Event listeners to handle scroll by keyboard, mouse and touch
	document.addEventListener('keydown', this.scrollDeck, false);
	document.addEventListener('mousedown', this.startMouseMove, false);
	document.addEventListener('mousemove', this.moveMouse, false);
	document.addEventListener('mouseup', this.stopMouseMove, false);
	this.container.addEventListener('touchstart', this.startSwipe, false);
	this.container.addEventListener('touchmove', this.endSwipe, false);
	window.addEventListener('resize', this.onWindowResize, false);

	// Set up the renderer
	this.renderer = new THREE.WebGLRenderer({
		antialias : true
	});
	this.renderer.setSize(this.params.CONTAINER_WIDTH,
			this.params.CONTAINER_HEIGHT);
	this.renderer.physicallyBasedShading = true;
	this.renderer.sortObjects = false;
	this.renderer.sortElements = false;
	this.container.appendChild(this.renderer.domElement);

	// Set up the scene
	this.scene = new THREE.Scene();

	// Set up the camera
	this.camera = new THREE.PerspectiveCamera(100, this.params.CONTAINER_WIDTH
			/ this.params.CONTAINER_HEIGHT, 1, 10000);
	
	var aspect = (this.params.CONTAINER_WIDTH / this.params.CONTAINER_HEIGHT) * 3 / 4;
	this.camera.position.set(0, 130 * aspect, 500 * aspect);
	this.camera.lookAt(this.scene.position);

	this.baseObject = new THREE.Object3D();
	this.scene.add(this.baseObject);
	
	// Add blank cards to fill to 3
	var len = this.businessCards.length;
	var i = len;
	if (len < 3) {
		for (; i < 3; i++) {
			var tmp = {
				id : -1,
				thumbnailUrl : '/images/card-place-holder.png',
				fullUrl : '/images/card-place-holder.png',
				created : '2013-04-12T18:00:50.300+02:00',
				lastModified : '2013-04-12T18:00:50.300+02:00',
				name : 'moarcard' + i
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

	this.degBetweenCards = 360 / this.businessCards.length;
	this.addObjects(this.businessCards);
	this.animate();
};

/**
 * Add objects to the scene
 */
rememberme.webgl.CardDeck.prototype.addObjects = function() {
	this.rolodexObject = new THREE.Object3D();
	var numCards = this.businessCards.length;

	// Set the size of the card based on the size of the container
	this.params.CARD_LENGTH = ((this.params.CONTAINER_WIDTH / numCards) + 50);

	// Keep an aspect of 4:3 for the card
	this.params.CARD_WIDTH = this.params.CARD_LENGTH * 3 / 4;

	// Add the cards to the scene
	for ( var i = 0; i < numCards; i++) {
		this.addCardToDeck(this.businessCards[i], this.d2r(i * (this.degBetweenCards)));
	}

	this.baseObject.add(this.rolodexObject);
};

/**
 * Render the scene
 */
rememberme.webgl.CardDeck.prototype.render = function() {
	if (!this.state.inMotion) {
		this.updateRotation();
	}
	this.renderer.render(this.scene, this.camera);
};

/**
 * Make sure that the size of things scales with window size
 */
rememberme.webgl.CardDeck.prototype.onWindowResize = function() {
	var deck = rememberme.webgl.CardDeck.instance;
	
	deck.params.CONTAINER_WIDTH = deck.domElement.offsetWidth;
	deck.params.CONTAINER_HEIGHT = deck.params.CONTAINER_WIDTH * 3 /4;

	deck.container.setAttribute('style', 'width: '
			+ deck.params.CONTAINER_WIDTH + 'px; height: '
			+ deck.params.CONTAINER_HEIGHT + 'px; '
			+ 'position: relative; top: -100px');

	deck.renderer.setSize(deck.params.CONTAINER_WIDTH, deck.params.CONTAINER_HEIGHT);
	deck.camera.aspect = deck.params.CONTAINER_WIDTH / deck.params.CONTAINER_HEIGHT;
	deck.camera.updateProjectionMatrix();
};

/**
 * Update the rotation of the deck
 */
rememberme.webgl.CardDeck.prototype.updateRotation = function() {
	var deckRotation = this.rolodexObject.rotation.y;
	
	// The end state - the deck's rotation is near enough to the target rotation
	if (this.inRange(deckRotation, this.state.targetRotation, this.params.ROTATE_TIC)) {
		this.rolodexObject.rotation.y = this.state.targetRotation;
		this.state.finishedRotating = true;
		this.state.inMotion = false;
	} else if (deckRotation > this.state.targetRotation) {
		this.rolodexObject.rotation.y -= this.params.ROTATE_TIC;
	} else if (deckRotation < this.state.targetRotation) {
		this.rolodexObject.rotation.y += this.params.ROTATE_TIC;
	}
};

/**
 * Scroll the deck based on the key pressed
 */
rememberme.webgl.CardDeck.prototype.scrollDeck = function(event) {
	var deck = rememberme.webgl.CardDeck.instance;

	var rad = deck.d2r(deck.degBetweenCards);
	switch (event.keyCode) {
		case 37:
			deck.state.targetRotation -= rad;
			event.preventDefault();
			break;
		case 39:
			deck.state.targetRotation += rad;
			event.preventDefault();
			break;
	}
};

/**
 * Start of a mouse drag
 */
rememberme.webgl.CardDeck.prototype.startMouseMove = function(event) {
	var deck = rememberme.webgl.CardDeck.instance;
	deck.state.startX = event.clientX - event.target.offsetLeft;
	deck.state.mouseClicked = true;
};

/**
 * Mouse drag
 */
rememberme.webgl.CardDeck.prototype.moveMouse = function(event) {
	var deck = rememberme.webgl.CardDeck.instance;
	if (deck.state.mouseClicked) {
		var deck = rememberme.webgl.CardDeck.instance;
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
rememberme.webgl.CardDeck.prototype.stopMouseMove = function(event) {
	var deck = rememberme.webgl.CardDeck.instance;
	
	if (deck.state.mouseClicked && deck.state.mouseMoving) {
		var rad = deck.d2r(deck.degBetweenCards);
		deck.state.endX = event.clientX - event.target.offsetLeft;
		if (deck.state.endX > deck.state.startX) {
			deck.state.targetRotation += rad;
		} else if (deck.state.endX < deck.state.startX) {
			deck.state.targetRotation -= rad;
		}
		event.preventDefault();
		deck.state.mouseMoving = false;
		deck.state.mouseClicked = false;
	} else {
		// Translate the click location to co-ordinates in the scene
		var mousex = ((event.clientX - deck.container.offsetLeft) / deck.params.CONTAINER_WIDTH) * 2 - 1;
		var mousey = -((event.clientY - deck.container.offsetTop) / deck.params.CONTAINER_HEIGHT) * 2 + 1;

		// Create a raycaster and cast a ray including the clicked point
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3(mousex, mousey, 1.0);
		vector = projector.unprojectVector(vector, deck.camera);

		var ray = new THREE.Raycaster(deck.camera.position, vector.sub(
				deck.camera.position).normalize());
		var intersects = ray.intersectObjects(deck.scene.children, true);

		// Display the panel for the clicked card
		if (intersects.length > 0) {
			var objectToMove = intersects[0].object.parent;
			var cardObj = null;
			for (var i = 0; i < deck.businessCards.length; i++) {
				if (deck.businessCards[i].id == objectToMove.name) {
					cardObj = deck.businessCards[i];
					break;
				}
			}
			if (cardObj.id == -1) {
				deck.showCardCreateCallback({
					businessCard : cardObj
				});
			} else {
				deck.showCardDetailCallback({
					businessCard : cardObj
				});
			}
		}
	}
};

/**
 * Update the rolodex based on the movement of a swipe
 */
rememberme.webgl.CardDeck.prototype.endSwipe = function(event) {
  var deck = rememberme.webgl.CardDeck.instance;

  if (deck.state.swiping) {
	  deck.state.endX = event.touches[0].pageX;
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
  }
};

/**
 * Start recording a swipe gesture
 */
rememberme.webgl.CardDeck.prototype.startSwipe = function(event) {
	var deck = rememberme.webgl.CardDeck.instance;
	deck.state.startX = event.touches[0].pageX;
	deck.state.swiping = true;
};