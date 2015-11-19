window.onload = function() {	

    		var container, stats;

			var camera, scene, renderer;

			var spheres;

			var x1, y1, x2, y2;

			var xThirds, yThirds;

			var currentX, currentY;

			var thingsChildren;

			var currentxShopName;

			var objectName;

			var helper;

			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;

			var mouseVector, raycaster, intersection; // all raycaster-related variables

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.getElementById( 'container' );

				raycaster = new THREE.Raycaster();
				mouseVector = new THREE.Vector2();

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.x = 0;
				camera.position.y = 0;
				camera.position.z = 700;
				//camera.position.x = 700;

				scene = new THREE.Scene();
				things = new THREE.Object3D();
				//things.rotation.x = 2.3;
				scene.add( things );

				// GRID

				helper = new THREE.GridHelper( 350, 50 );
				helper.setColors( new THREE.Color(0xff0000), new THREE.Color(0xffffff) );
				helper.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
				//helper.rotation.x = Math.PI / 2;
				things.add( helper );

				// SPHERE

				for (var i = 0; i < data.length; i++ ) { 

				var sphereGeo = new THREE.SphereGeometry( 20, 8 );

				var sphereMat = new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5, wireframe: false } );

				spheres = new THREE.Mesh( sphereGeo, sphereMat );

				spheres.position.x = data[i].x;
				spheres.position.y = data[i].y;
				spheres.position.z = 0;

				spheres.userData = data[i];
				spheres.name = "spheres";
				things.add( spheres );

				} // END SPHERE

				renderer = new THREE.CanvasRenderer();
				renderer.setClearColor( 0x000000 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
				document.addEventListener( 'mousemove', onMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mouseout', onDocumentMouseOut, false );

				mouseYOnMouseDown = event.clientY - windowHalfY;
				targetRotationOnMouseDown = targetRotation;

			}

			function onMouseMove( event ) {

				mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
				mouseVector.y = 1 - 2 * ( event.clientY / window.innerHeight );


			}


			function onDocumentMouseMove( event ) {

				mouseY = event.clientY - windowHalfY;

				targetRotation = targetRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.02;

			}

			function onDocumentMouseUp( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

			}

			function onDocumentMouseOut( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
					targetRotationOnMouseDown = targetRotation;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseY = event.touches[ 0 ].pageY - windowHalfY;
					targetRotation = targetRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.05;

				}

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function xShopCoordinates ( currentxShopName ) {

				for (var i = 0; i < data.length; i++) {

						if ( currentxShopName == data[i].name ) {

						currentX = data[i].x;
						currentY = data[i].y;

						return currentX, currentY;

					}

				}

			}

			function xBezierPaths ( xNow, targetX ) {

				xThirds = (Math.abs(parseFloat(xNow)) + Math.abs(parseFloat(targetX))) / 10;
	console.log(xNow)

				if ( parseFloat(xNow) > parseFloat(targetX) ) {

					x1 = parseFloat(xNow) - parseFloat(xThirds);
					//console.log(x1)
					x2 = parseFloat(xNow) - (parseFloat(xThirds) * 2);

					return x1, x2;

				}  if ( parseFloat(xNow) < parseFloat(targetX) ) {

					x1 = parseFloat(xNow) + parseFloat(xThirds);
					x2 = parseFloat(xNow) + (parseFloat(xThirds) * 2);

					//console.log(x1 + ", " + x2)

					return x1, x2;

				}  if ( parseFloat(xNow) == parseFloat(targetX) ) { 

					x1 = parseFloat(xNow);
					x2 = parseFloat(xNow);

					return x1, x2;

				 }

			} // end xBezierPaths

			function yBezierPaths ( yNow, targetY ) {

				yThirds = (Math.abs(parseFloat(yNow)) + Math.abs(parseFloat(targetY))) / 10;


				if ( parseFloat(yNow) > parseFloat(targetY) ) {

					y1 = parseFloat(yNow) - parseFloat(yThirds);
					y2 = parseFloat(yNow) - (parseFloat(yThirds) * 2);

					return y1, y2;

				} if ( parseFloat(yNow) < parseFloat(targetY) ) {

					y1 = parseFloat(yNow) + parseFloat(yThirds);
					y2 = parseFloat(yNow) + (parseFloat(yThirds) * 2);

					return y1, y2;

				} if ( parseFloat(yNow) == parseFloat(targetY) ) { 

					y1 = parseFloat(yNow);
					y2 = parseFloat(yNow);

					return y1, y2;
				}

			} // end yBezierPaths

			function drawBezier( objectName ) {

				for ( var i = 0; i < data.length; i++ ){

					if (objectName == data[i].name){ 

						for ( var j = 0; j < data[i].xShop.length; j++ ) {

								currentxShopName = data[i].xShop[j].xShopName;

								xShopCoordinates( currentxShopName );

								xBezierPaths( currentX, data[i].x );

								yBezierPaths( currentY, data[i].y );

								//for ( var x = 0; x < Math.random() * 50; x++ ) {

									var randNumSin = Math.sin(Date.now());

									var curve = new THREE.CubicBezierCurve3(

									new THREE.Vector3( data[i].x, 0, data[i].y ),

									new THREE.Vector3( x2, randNumSin * 400, y2),

									new THREE.Vector3( x1, randNumSin * 400, y1),

									new THREE.Vector3( currentX, 0, currentY )

									); // end of four required vectors to draw curve

									var geometry = new THREE.Geometry();
									geometry.vertices = curve.getPoints( 50 );

									if ( randNumSin > 0 ) {

									var material = new THREE.LineBasicMaterial( { color : 0x0000ff, linewidth: 3, opacity: 1 });

									} else {

									var material = new THREE.LineBasicMaterial( { color : 0xff0000, linewidth: 3, opacity: 1 });	

									}

									// Create the final Object3d to add to the scene
									var curveObject = new THREE.Line( geometry, material );

									curveObject.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
									curveObject.name = "curve";
									things.add( curveObject )

									//}

								}


						} // END OBJECTNAME CHECKER 

					} // END OUTER FOR LOOP

				} // END OBJECTNAME FUNCTION


			function render() {



				raycaster.setFromCamera( mouseVector.clone(), camera ),
				intersects = raycaster.intersectObjects( things.children );

				// if there is one (or more) intersections		
				if (intersects.length > 0) 
				{
					if ( intersects[ 0 ].object != intersection ) // if the closest object intersected is not the currently stored intersection object
					{
						if (intersection) // restore previous intersection object (if it exists) to its original color
							intersection.material.color.setHex( intersection.currentHex );


							for (var i = things.children.length - 1; i >= 0 ; i -- ) {
							    thingsChildren = things.children[ i ];
							    if ( thingsChildren.name == "curve") {
							        things.remove(thingsChildren);
							    }
							}

							// store reference to closest object as current intersection object
							intersection = intersects[ 0 ].object;
							// store color of closest object (for later restoration)
							intersection.currentHex = intersection.material.color.getHex();

							if (intersection.name == "spheres" || "curve") {

							intersection.material.color.setHex( 0xffad01 );

							}

							if (intersection.name == "spheres" || "curve") {

							objectName = intersection.userData.name;

							drawBezier( objectName );

							}
							
					}
				}
				else // there are no intersections
				{
					if (intersection) // restore previous intersection object (if it exists) to its original color
						intersection.material.color.setHex( intersection.currentHex );
						// remove previous intersection object reference by setting current intersection object to nothing
						intersection = null;

						for (var i = things.children.length - 1; i >= 0 ; i -- ) {
						    thingsChildren = things.children[ i ];
						    if ( thingsChildren.name == "curve") {
						        things.remove(thingsChildren);
						    }
						}

				} // end else no intersections




				// plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;

				things.rotation.x += ( targetRotation - things.rotation.x ) * 0.05;

				renderer.render( scene, camera );

			}
}
