import * as THREE from "three";

// FIXME: 三人称視点にしたいしグルグルしたくない

export default function(camera) {
	this.camera = camera;

	this.enabled = false;

	this.movementSpeed = 100.0;
	this.lookSpeed = 0.125;

	this.autoForward = false;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	// private variables

	var lat = 0;
	var lon = 0;

	var lookDirection = new THREE.Vector3();
	var spherical = new THREE.Spherical();
	var target = new THREE.Vector3();

	//

	this.onMouseMove = function ( event ) {
			if (this.enabled === false) return;
			this.mouseX += event.movementX;
			this.mouseY += event.movementY;
	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.lookAt = function ( x, y, z ) {

		if ( x.isVector3 ) {

			target.copy( x );

		} else {

			target.set( x, y, z );

		}

		this.camera.lookAt( target );

		setOrientation( this );

		return this;

	};

	this.update = function () {

		var targetPosition = new THREE.Vector3();

		return function update( delta ) {

			if ( this.enabled === false ) return;

			if ( this.heightSpeed ) {

				var y = THREE.Math.clamp( this.camera.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;

				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			var actualMoveSpeed = delta * this.movementSpeed;

			if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.camera.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
			if ( this.moveBackward ) this.camera.translateZ( actualMoveSpeed );

			if ( this.moveLeft ) this.camera.translateX( - actualMoveSpeed );
			if ( this.moveRight ) this.camera.translateX( actualMoveSpeed );

			if ( this.moveUp ) this.camera.translateY( actualMoveSpeed );
			if ( this.moveDown ) this.camera.translateY( - actualMoveSpeed );

			var actualLookSpeed = delta * this.lookSpeed;

			var verticalLookRatio = 1;

			if ( this.constrainVertical ) {

				verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

			}

			// lon -= this.mouseX * actualLookSpeed;
			lon -= this.mouseX * 0.4;
            this.mouseX = 0;
            // lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
            lat -= this.mouseY * 0.4;
            this.mouseY = 0;

			lat = Math.max( - 85, Math.min( 85, lat ) );

			var phi = THREE.Math.degToRad( 90 - lat );
			var theta = THREE.Math.degToRad( lon );

			if ( this.constrainVertical ) {

				phi = THREE.Math.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );

			}

			var position = this.camera.position;

			targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

			this.camera.lookAt( targetPosition );

		};

	}();

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {

		document.removeEventListener( 'contextmenu', contextmenu, false );
		document.removeEventListener( 'mousemove', _onMouseMove, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );
	};

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	document.addEventListener( 'contextmenu', contextmenu, false );
	document.addEventListener( 'mousemove', _onMouseMove, false );

	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	function setOrientation( controls ) {

		var quaternion = controls.camera.quaternion;

		lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
		spherical.setFromVector3( lookDirection );

		lat = 90 - THREE.Math.radToDeg( spherical.phi );
		lon = THREE.Math.radToDeg( spherical.theta );

	}

	setOrientation( this );

};
