var threebasic1 = {
	scene : undefined,
	camera : undefined,
	renderer : undefined,
	loader : undefined,
	objectnames : [],
	objects : [],
	cameraposx : 0,
	hitboxobjects : [],
	hitboxnames : [],
	gravity : [],
	renderingindex : 0,
	renderdistance : 0,
	materials : [],
	materialnames : [],
	currentframes : 0,
	lastframestime : 0,
	fps : 0,
	defaultfps : 0,
	fpsmultiplier : 1,
	loaded : false,
	chunknames : [],
	chunkdata : [{name:"other",x:0,y:0,z:0,w:1000000000000,h:1000000000000,l:1000000000000}],
	chunks : [],
	renderedobjects : [],
	geometryvalues : [],
	geometries : [],
	meshes : [],
	meshdata : [],
	uuids : [],
	groupnames : [],
	groupdata : [],
	baseblockgroups : [],
	baseblocks : [],
	dummy : new THREE.Object3D(),
	grouphitboxnames : [],
	grouphitboxes : [],
	falling : [],
	objectloader : undefined,
	objectsloaded : 0,
	test : function() {console.log("\x1b[35m%s","ThreeBasic.js successfully loaded.");return(true);},
	lights : [],
	init : function(data) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		this.camera.position.y = 1;
		this.camera.position.z = 5;
		let width = document.getElementById(data.canvas).offsetWidth;
		let height = document.getElementById(data.canvas).offsetHeight;

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( width, height );
		this.renderer.setClearColor(data.background);
		document.getElementById(data.canvas).appendChild(this.renderer.domElement);
		
	


		window.addEventListener('resize', function () {
			 
			 if(this.renderer != undefined) {
				this.renderer.setSize(width,height);
			 }
			 if(this.camera != undefined) {
				this.camera.aspect = width / height;
				this.camera.updateProjectionMatrix();
			 }
		});
		this.loader = new THREE.TextureLoader();
		this.objectloader = new THREE.GLTFLoader();


		this.objectnames.push("camera")
		this.objects.push(this.camera)
		this.falling.push(false)
		this.gravity.push(0)
		this.renderdistance = data.renderdistance + 0
		
		this.defaultfps = data.defaultfps
		
		//https://r105.threejsfundamentals.org/threejs/lessons/threejs-fog.html#:~:text=In%20three.,near%20is%20unaffected%20by%20fog.
		
		var fogmin = data.renderdistance-7
		var fogmax = data.renderdistance-3
		this.scene.fog = new THREE.Fog(data.background, fogmin, fogmax); //If doesnt seem to work, as there is no fog below the player, then there might be a block there
		this.renderer.setClearColor(data.background);






		

		

		console.log("\x1b[35m%s","ThreeBasic.js successfully initialised.")
		
	},
	loadobjects(data) {
		loading = setInterval(function() {
			if(threebasic1.objectsloaded == data.amount) {
				clearInterval(loading);
				data.main()
			};
		},100)
	},
	setlight(data) {
		const light = new THREE.DirectionalLight(data.color, data.brightness);
		light.position.set(data.x, data.y, data.z);
		this.scene.add(light);
		this.scene.add(light.target);
	},
	light(data) {
		this.lights.push(data)
	},
	setmaterial : function(data) {
		if(data.transparency == undefined) {
			data.transparency = 0
		}
		var material = new THREE.MeshBasicMaterial({map: this.loader.load(data.material),opacity:data.transparency})
		if(data.transparency != 0) {
			material.transparent = true
		}
		this.materials.push(material)
		this.materialnames.push(data.name)
	},
	getmaterial : function(data) {
		return(this.materials[this.materialnames.indexOf(data.name)])
	},
	setchunk : function(data) {
		this.chunkdata.push({name:data.name,x:data.x,y:data.y,z:data.z,w:data.w,h:data.h,l:data.l})
	},
	setgroup : function(data) {
		//USE THIS TO INCREASE PERFORMANCE
		//USE THIS TO CREATE PRESET "MESHES" E.G. WEDGES
		//FIX COLLISIONS

		//DISSAPEARS AT A CERTAIN DISTANCE
		//https://codeburst.io/infinite-scene-with-threejs-and-instancedmesh-adc74b8efcf4

		if(data.collisions == true) {
			var i = 0
			var hitboxes1 = []
			while(i < data.amount) {
				hitboxes1.push({x:-10000000,y:-10000000,z:-10000000,w:data.data.w,h:data.data.h,l:data.data.l})
				i += 1
			}
			this.grouphitboxes.push(hitboxes1)
			this.grouphitboxnames.push(data.name)
		}

		if(data.type == "cube") {
			//var mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),  new THREE.MeshBasicMaterial( { color: "#FF0000" } ), data.amount);
			if(data.data.textures) {
				var materials = data.data.textures

				var mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(data.data.w,data.data.h,data.data.l), materials, data.amount);
			}
			else {
				var material = new THREE.MeshBasicMaterial( { color: data.color } );
				var mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(data.data.w,data.data.h,data.data.l), material, data.amount);
			}
			//mesh.position.x = data.x
			//mesh.position.y = data.y
			//mesh.position.z = data.z
			this.objectnames.push(data.name)
			this.objects.push(mesh)
			this.falling.push(false)
			this.gravity.push(data.data.gravity)

			this.groupnames.push(mesh.uuid)
			this.groupdata.push({w:data.w,h:data.h,l:data.l,x:data.x,y:data.y,z:data.z})

			if(data.chunk == undefined) {
				data.chunk = "other"
			}
			if(this.chunknames.indexOf(data.chunk) == -1) {
				this.chunknames.push(data.chunk)
				
				this.chunks.push([mesh])
			}
			else {
				
				(this.chunks[this.chunknames.indexOf(data.chunk)]).push(mesh)
				//console.log(cube,3)
			}
		}
	},
	grouppositions : function(data) {
		var dummy = this.dummy
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		
		for ( var i = 0; i < obj.count; i ++ ) {
			dummy.position.set(data.positions[i].x, data.positions[i].y, data.positions[i].z);
			dummy.updateMatrix();
			obj.setMatrixAt( i, dummy.matrix );
		}
		
		obj.instanceMatrix.needsUpdate = true;
	},
	groupposition : function(data) {
		var dummy = this.dummy
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		var i = data.index
		dummy.position.set(data.x, data.y, data.z);
		dummy.updateMatrix();
		obj.setMatrixAt( i, dummy.matrix );
		
		obj.instanceMatrix.needsUpdate = true;
	},
	cube : function(data) {
		var newgeometry
		
		if(this.geometryvalues.indexOf(data.w.toString()+":"+data.h.toString()+":"+data.l.toString()) == -1) {
			this.geometryvalues.push(data.w.toString()+":"+data.h.toString()+":"+data.l.toString())
			//this.geometries.push(new THREE.BoxGeometry( data.w, data.h, data.l))
			newgeometry = new THREE.BoxGeometry( data.w, data.h, data.l)
			this.geometries.push(newgeometry)
		}
		
		var geometry = this.geometries[this.geometryvalues.indexOf(data.w.toString()+":"+data.h.toString()+":"+data.l.toString())]
		
		if(data.textures) {
		

			
			
			var materials = data.textures

			var cube = new THREE.Mesh( geometry, materials )
			
		}
		else {
			var material = new THREE.MeshBasicMaterial( { color: data.color } );
			
			var cube = new THREE.Mesh( geometry, material );
		}
		//cube.opacity = 0.0
		//this.scene.add(cube);
		if(data.chunk == undefined) {
			data.chunk = "other"
		}
		//console.log(cube,2)
		if(this.chunknames.indexOf(data.chunk) == -1) {
			this.chunknames.push(data.chunk)
			
			this.chunks.push([cube])
		}
		else {
			
			(this.chunks[this.chunknames.indexOf(data.chunk)]).push(cube)
			//console.log(cube,3)
		}
		//console.log(this.chunks)
		
		this.objectnames.push(data.name)
		this.objects.push(cube)
		this.falling.push(false)
		this.gravity.push(data.gravity)
		
	},
	object : function(data) {
		
		var obj;
		this.objectloader.load(data.object, (gltf) => {
		  obj = gltf.scene;
		  obj.geometry1 = {
			parameters : {
				width:data.w,
				height:data.h,
				depth:data.l
			}
		  }

		  this.scene.add(obj);
		
		  // compute the box that contains all the stuff
		  // from root and below
		  const box = new THREE.Box3().setFromObject(obj);

		  const boxSize = box.getSize(new THREE.Vector3());
		  const boxCenter = box.getCenter(new THREE.Vector3());
		  
			obj.scale.x = data.w/boxSize.x
			obj.scale.y = data.h/boxSize.y
			obj.scale.z = data.l/boxSize.z
			if(data.chunk == undefined) {
				data.chunk = "other"
			}
			//console.log(cube,2)
			if(this.chunknames.indexOf(data.chunk) == -1) {
				this.chunknames.push(data.chunk)
				
				this.chunks.push([obj])
			}
			else {
				
				(this.chunks[this.chunknames.indexOf(data.chunk)]).push(obj)
				//console.log(cube,3)
			}
			//console.log(this.chunks)
			this.objectnames.push(data.name)
			this.objects.push(obj)
			this.falling.push(false)
			this.gravity.push(data.gravity)
			this.objectsloaded += 1
		  });
		


		
		
	},
	grid : function(data) {
		this.scene.add(new THREE.GridHelper(data.w, data.h));
	},
	x : function(data) {
		//data.initial is optional
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		if(data.set == true && obj.position.x != data.value) {
			var previousx = obj.position.x + 0
			obj.position.x = data.value + 0
			if(this.collisions({object:obj}).length != 0 && data.initial == false) {
				obj.position.x = previousx + 0
			}
		}
		else {
			return(obj.position.x)
		}
	},
	y : function(data) {
		//data.initial is optional
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		if(data.set == true && obj.position.y != data.value) {
			var previousy = obj.position.y + 0
			obj.position.y = data.value + 0
			var collisions = this.collisions({object:obj})
			
			if(collisions.length != 0 && data.initial == false) {
				obj.position.y = previousy + 0
			}
		}
		else {
			return(obj.position.y)
		}
		
	},
	z : function(data) {
		//data.initial is optional
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		if(data.set == true && obj.position.z != data.value) {
			var previousz = obj.position.z + 0
			obj.position.z = data.value + 0
			if(this.collisions({object:obj}).length != 0 && data.initial == false) {
				obj.position.z = previousz + 0
			}
		}
		else {
			return(obj.position.z)
		}
		
	},
	rotatex : function(data) {
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		if(data.set == true) {
			obj.rotation.x = data.value
		}
		else {
			return(obj.rotation.x)
		}
		
	},
	rotatey : function(data) {
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		if(data.set == true) {
			obj.rotation.y = data.value
		}
		else {
			return(obj.rotation.y)
		}
		
	},
	rotatez : function(data) {
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		if(data.set == true) {
			obj.rotation.z = data.value
		}
		else {
			return(obj.rotation.z)
		}
		
	},
	baseblock : function(data) {
		this.baseblocks.push(data)
	},
	isfalling : function(data) {
		return(this.falling[this.objectnames.indexOf(data.name)])
	},
	animateframe : function(data) {

		requestAnimationFrame( data );
		
		
		if(this.loaded == false) {
			this.loaded = true
			console.log("\x1b[35m%s","Scene successfully loaded.")

			
			setTimeout(function() {var fps = threebasic1.fps;console.log("\x1b[35m%s","Current FPS: " + fps.toString());},3000)
		}
		
		
		if(this.currentframes == 0) {
			this.lastframestime = (new Date()).getTime()
		}
		if(((new Date()).getTime() - this.lastframestime) >= 1000) {
			this.fps = this.currentframes
			this.currentframes = 0
			this.lastframestime = (new Date()).getTime()
			this.fpsmultiplier = ((((this.defaultfps/this.fps)-1)*0.5)+1)
		}
		this.currentframes += 1
		var i = 0;
		var obj;
		var newval;
		var previousy1 = 0
		var nexty1 = 0
		
		while(i < this.gravity.length) {
			
			obj = this.objects[i]
			newval = (obj.position.y + 0) - (this.gravity[i]*threebasic.fpsmultiplier)
			previousy1 = obj.position.y + 0
			this.y({name:this.objectnames[i],value:newval,set:true,initial:false})
			nexty1 = obj.position.y + 0
			if(previousy1 == nexty1) {
				this.falling[i] = false
			}
			else {
				this.falling[i] = true
			}
		
			i += 1
		}
		
		
		this.loadchunks()
		
		var previousChildren = this.scene.children
		var newChildren = []
		var x1 = this.camera.position.x
		var y1 = this.camera.position.y
		var z1 = this.camera.position.z
		var x2 = 0
		var y2 = 0
		var z2 = 0
		var dx = 0
		var dy = 0
		var dz = 0
		var i = 0
		var i2 = 0
		while(i < previousChildren.length) {
			
			if(previousChildren[i].geometry == undefined) {
				x2 = previousChildren[i].position.x
				x21 = previousChildren[i].position.x - previousChildren[i].geometry1.parameters.width/2
				x22 = previousChildren[i].position.x + previousChildren[i].geometry1.parameters.width/2
				y2 = previousChildren[i].position.y
				y21 = previousChildren[i].position.y - previousChildren[i].geometry1.parameters.height/2
				y22 = previousChildren[i].position.y + previousChildren[i].geometry1.parameters.height/2
				z2 = previousChildren[i].position.z
				z21 = previousChildren[i].position.z - previousChildren[i].geometry1.parameters.depth/2
				z22 = previousChildren[i].position.z + previousChildren[i].geometry1.parameters.depth/2
			}
			else {
				x2 = previousChildren[i].position.x
				x21 = previousChildren[i].position.x - previousChildren[i].geometry.parameters.width/2
				x22 = previousChildren[i].position.x + previousChildren[i].geometry.parameters.width/2
				y2 = previousChildren[i].position.y
				y21 = previousChildren[i].position.y - previousChildren[i].geometry.parameters.height/2
				y22 = previousChildren[i].position.y + previousChildren[i].geometry.parameters.height/2
				z2 = previousChildren[i].position.z
				z21 = previousChildren[i].position.z - previousChildren[i].geometry.parameters.depth/2
				z22 = previousChildren[i].position.z + previousChildren[i].geometry.parameters.depth/2
			}
			
			dx = x2 - x1
			if(dx < 0) {
				dx = dx * -1
			}
			dy = y2 - y1
			if(dy < 0) {
				dy = dy * -1
			}
			dz = z2 - z1
			if(dz < 0) {
				dz = dz * -1
			}
			
			if(dx < this.renderdistance && dy < this.renderdistance && dz < this.renderdistance || previousChildren[i].type == "GridHelper" || previousChildren[i].isInstancedMesh) {
				if(previousChildren[i].visible == true) {
					newChildren.push(previousChildren[i])
				}
			}
			else if(x1 >= x21-this.renderdistance && x1 <= x22+this.renderdistance || y1 >= y21-this.renderdistance && y1 <= y22+this.renderdistance || z1 >= z21-this.renderdistance && z1 <= z22+this.renderdistance) {
				//console.log("yo")
				if(previousChildren[i].geometry) {
					if(previousChildren[i].geometry.parameters.width > this.renderdistance) {
						if(previousChildren[i].visible == true) {
							newChildren.push(previousChildren[i])
						}
					}
				}
				else {
					if(previousChildren[i].geometry1.parameters.width > this.renderdistance) {
						if(previousChildren[i].visible == true) {
							newChildren.push(previousChildren[i])
						}
					}
				}
			}
			
			i += 1
		}
		this.scene.children = newChildren

		i = 0
		var i2 = 0
		var baseblock1 = {}
		var hitbox1 = {}
		while(i < this.baseblocks.length) {0
			baseblock1 = this.baseblocks[i]
			
			if(this.distance({x1:baseblock1.x,y1:baseblock1.y,z1:baseblock1.z,x2:x1,y2:y1,z2:z1}) < this.renderdistance) {
				this.groupposition({x:baseblock1.x,y:baseblock1.y,z:baseblock1.z,index:i2,name:baseblock1.group})
				hitbox1 = this.grouphitboxes[this.grouphitboxnames.indexOf(baseblock1.group)][i2]
				hitbox1.x = baseblock1.x
				hitbox1.y = baseblock1.y
				hitbox1.z = baseblock1.z
				i2 += 1
			}
			i += 1
		}
		
		i = 0
		
		this.renderedobjects = []
		
		while(i < newChildren.length) {
			if(this.hitboxobjects.indexOf(newChildren[i]) != -1) {
				this.renderedobjects.push(newChildren[i])
			}
			i += 1
		}
		
		i = 0
		while(i < this.lights.length) {
			this.setlight(this.lights[i])
			i += 1
		}
		this.lights = []
		
		this.renderer.render( this.scene, this.camera );
		
		this.scene.children = previousChildren
		
		
		
		//Loading takes too long each time - preload with no rendering at the start by rotating the camera
	},
	lookat : function(data) {
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		obj.lookAt(data.x,data.y,data.z);
		
	},
	forwards : function(data) {
		var obj = this.objects[this.objectnames.indexOf(data.name)]
		
		data.speed = data.speed
		

		const speedFactor = data.speed;
		const direction = new THREE.Vector3();
		if(data.relativeto) {
			var obj2 = this.objects[this.objectnames.indexOf(data.relativeto)]
			obj2.getWorldDirection(direction);
		}
		else {
			obj.getWorldDirection(direction);
		}
	
		var previousposx = obj.position.x + 0
		var previousposy = obj.position.y + 0
		var previousposz = obj.position.z + 0
		
		obj.position.add(direction.multiplyScalar(speedFactor));
		obj.position.y = previousposy
		if(this.collisions({object:obj}).length != 0) {
			obj.position.x = previousposx + 0
			obj.position.y = previousposy + 0
			obj.position.z = previousposz + 0
		}

		
	},
	cameraview1(data) {
		if(data.type == "object") {
			//1) Position mainobject at object
			//2) Rotate to data.rotation
			//3) Move backwards/forwards by data.offset
			//4) Adjust rotation by data.rotationoffset
			var ox = this.x({name:data.object,set:false})
			var oy = this.y({name:data.object,set:false})
			var oz = this.z({name:data.object,set:false})
			
			
			
			this.x({name:data.mainobject,value:ox,set:true})
			this.y({name:data.mainobject,value:oy+data.offsety,set:true})
			this.z({name:data.mainobject,value:oz,set:true})

			this.rotatey({name:data.mainobject,value:data.rotation,set:true})
			
			this.forwards({name:data.mainobject,speed:data.offsetz*-1})

			this.rotatey({name:data.mainobject,value:data.rotation+1.5,set:true})

			this.forwards({name:data.mainobject,speed:data.offsetx})

			this.rotatey({name:data.mainobject,value:data.rotation,set:true})

			this.rotatey({name:data.mainobject,value:data.rotation+data.rotationoffset,set:true})
	
			//this.lookat({name:data.mainobject,x:ox,y:oy,z:oz})
		}
		else {
			var ox = this.x({name:data.mainobject,set:false})
			var oy = this.y({name:data.mainobject,set:false})
			var oz = this.z({name:data.mainobject,set:false})
			this.rotatey({name:data.mainobject,value:this.cameraposx,set:true})
			
			this.x({name:"camera",value:ox+data.offsetz*(Math.sin(this.cameraposx)),set:true})
			this.y({name:"camera",value:oy+data.offsety,set:true})
			this.z({name:"camera",value:oz+data.offsetz*(Math.cos(this.cameraposx)),set:true})
		
			

			this.lookat({name:"camera",x:ox,y:oy,z:oz})
		}
		
		
	},
	loadchunks() {
		var x1 = this.camera.position.x
		var y1 = this.camera.position.y
		var z1 = this.camera.position.z
		var x2
		var y2
		var z2
		var x21
		var x22
		var y21
		var y22
		var z21
		var z22
		var dx
		var dy
		var dz
		var i = 0
		var newChildren = []
		var i2 = 0
		var chunk
		var chunkNames = []
		while(i < this.chunks.length) {
			chunk = this.chunks[i]
			
			x2 = this.chunkdata[i].x
			x21 = this.chunkdata[i].x - this.chunkdata[i].w
			x22 = this.chunkdata[i].x + this.chunkdata[i].w
			y2 = this.chunkdata[i].y
			y21 = this.chunkdata[i].y - this.chunkdata[i].h
			y22 = this.chunkdata[i].y + this.chunkdata[i].h
			z2 = this.chunkdata[i].z
			z21 = this.chunkdata[i].z - this.chunkdata[i].l
			z22 = this.chunkdata[i].z + this.chunkdata[i].l
			

			
			dx = x2 - x1
			if(dx < 0) {
				dx = dx * -1
			}
			dy = y2 - y1
			if(dy < 0) {
				dy = dy * -1
			}
			dz = z2 - z1
			if(dz < 0) {
				dz = dz * -1
			}
			i2 = 0
			if(dx < this.renderdistance && dy < this.renderdistance && dz < this.renderdistance) {
				chunkNames.push(this.chunknames[i])
				while(i2 < chunk.length) {
					newChildren.push(chunk[i2])
					
					i2 += 1
				}
				
			}
			
			else if(x1 >= x21-this.renderdistance && x1 <= x22+this.renderdistance || y1 >= y21-this.renderdistance && y1 <= y22+this.renderdistance || z1 >= z21-this.renderdistance && z1 <= z22+this.renderdistance) {
				//console.log("yo")
				if(this.chunkdata[i].w > this.renderdistance || this.chunkdata[i].h > this.renderdistance || this.chunkdata[i].l > this.renderdistance) {
					chunkNames.push(this.chunknames[i])
					while(i2 < chunk.length) {
						newChildren.push(chunk[i2])
						
						i2 += 1
					}
					
				}
			}
			i += 1
		}
		//console.log(newChildren.length," objects out of ",this.objects.length,chunkNames)
		//WORKS BUT MAKE LESS LAGGY - LIMIT COLLISIONS TO RENDERED BLOCKS? <--- limited but still laggy
		//CREATING CUBES TAKES UP MEMORY?
		//CREATE OBJECTS JUST IN TIME WHEN RENDERING CHUNKS - ON NEW TEST FILE <------------------- *REUSE objects and geometry instead of creating new ones each time
		//DOES NOT CRASH WHEN LOADING EVERYTHING
		this.scene.children = newChildren
		
	},
	sethitbox(data) {
		if(data.custom == true) {
			/*
			x1 = obj1.position.x
			y1 = obj1.position.y
			z1 = obj1.position.z
			w1 = obj1.geometry.parameters.width
			h1 = obj1.geometry.parameters.height
			l1 = obj1.geometry.parameters.depth*/
			var obj = {
				position : {x:data.x,y:data.y,z:data.z},
				geometry : {
					parameters : {width:data.w,height:data.h,depth:data.l}
				}
			}
			this.hitboxobjects.push(obj)
			this.hitboxnames.push("custom")
		}
		else {
			var obj = this.objects[this.objectnames.indexOf(data.name)]
			this.hitboxobjects.push(obj)
			this.hitboxnames.push(data.name)
		}
	},
	collisions(data) {
		//INEFFICIENCY WAS CAUSED ALL THE OBJECTS BEING COLLISION DETECTED DUE TO CHANGE IN Y DUE TO GRAVITY EVEN IF
		//GRAVITY WAS 0
		
		//OVERALL LIBRARY TO BE MORE EFFICIENT - LAG CAUSED NOT BY COLLISIONS BUT BY RENDERING - RENDER LESS FREQUENTLY? (Not every time change is made)
		//FIXED EFFICIENCY - ONLY LAGGY WHEN LOADING - PRELOAD BY AUTOMATICALY ROTATING PLAYER AT THE START
		//OR SEARCH UP HOW TO PRELOAD THE GAME
		//PRELOADING WORKS BUT CRASHES AT 80X80 - LOAD THE GAME IN LINEAR CHUNKS E.G. 1000x1? 
		//LOAD EACH OBJECT INDIVIDUALY, MOVING THE CAMERA TOWARDS EACH ONE? <-------
		//BLOCKS LOAD INDIVIDUALY BUT STILL CRASHES AT 80x80 "context lost"
		//WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost
		//Possibly make this the map limit?
		//TRY MAKING EVERY OBJECT SMALLER TO SEE IF MAP LIMIT DEPENDS ON POSITION? <---------- 
		// ^^^^^^^^ TESTED - DOES NOT WORK ^^^^^^^^
		//
		// MAXIMUM OBJECTS: 1612 < x < ? <---- FIND OUT MAXIMUM OBJECTS
		// MAXIMUM OBJECTS HAVE LESS IMPACT AS LONG AS IT IS NOT A "BLOCK GAME"
		// BECAUSE OTHER GAMES GENERALY HAVE LESS OBJECTS - BLOCK GAMES ARE NOT POSSIBLE
		//
		
		
		// LAG FIX:
		// REUSE MATERIALS
		
		// NOTE: Works at 80x80 but loading time for 160x160 is too high and it is slow on 80x80
		// THREE JS DOES NOT WORK WELL WITH A VERY LARGE NUMBER OF OBJECTS - Chunk rendering?
		
		
		//ADD 3D MODELS: https://threejs.org/docs/#manual/en/introduction/Loading-3D-models
		//https://sketchfab.com/3d-models/free-1975-porsche-911-930-turbo-8568d9d14a994b9cae59499f0dbed21e
		var obj1 = data.object;
		var obj2 = undefined
		var i1 = 0
		var collisions = []
		
		var x1, x2, y1, y2, z1, z2, w1, w2, h1, h2, l1, l2, dx, dy, dz = 0
		var c1, c2, c3
		//console.log(this.renderedobjects.length, "out of ",this.hitboxnames.length, "hitboxes")
		if(this.objects.indexOf(obj1) != 0 && this.renderedobjects.length != 0 && this.hitboxobjects.indexOf(obj1) != -1) {

			while(i1 < this.renderedobjects.length) {
				obj2 = this.renderedobjects[i1]
				if(obj2 != obj1) {
					x1 = obj1.position.x
					y1 = obj1.position.y
					z1 = obj1.position.z
					w1 = obj1.geometry.parameters.width
					h1 = obj1.geometry.parameters.height
					l1 = obj1.geometry.parameters.depth
					x2 = obj2.position.x
					y2 = obj2.position.y
					z2 = obj2.position.z
					w2 = obj2.geometry.parameters.width
					h2 = obj2.geometry.parameters.height
					l2 = obj2.geometry.parameters.depth
					
					//Position based on centre of mesh
					dx = (x2-x1)
					if(dx < 0) {dx = dx * -1}
					dy = (y2-y1)
					if(dy < 0) {dy = dy * -1}
					dz = (z2-z1)
					if(dz < 0) {dz = dz * -1}
					
					c1 = dx < (w1/2 + w2/2)
					c2 = dy < (h1/2 + h2/2)
					c3 = dz < (l1/2 + l2/2)
					
					if(c1 && c2 && c3) {
						if(collisions.indexOf(obj2) == -1) {
							collisions.push(obj2)
						}
					}
				}
				i1 += 1
			}
			

			i1 = 0
			while(i1 < this.hitboxobjects.length) {
				obj2 = this.hitboxobjects[i1]
				if(this.hitboxnames[i1] == "custom" && this.distance({x1:obj1.position.x,y1:obj1.position.y,z1:obj1.position.z,x2:obj2.position.x,y2:obj2.position.y,z2:obj2.position.z}) < this.renderdistance) {
					x1 = obj1.position.x
					y1 = obj1.position.y
					z1 = obj1.position.z
					w1 = obj1.geometry.parameters.width
					h1 = obj1.geometry.parameters.height
					l1 = obj1.geometry.parameters.depth
					x2 = obj2.position.x
					y2 = obj2.position.y
					z2 = obj2.position.z
					w2 = obj2.geometry.parameters.width
					h2 = obj2.geometry.parameters.height
					l2 = obj2.geometry.parameters.depth
	
					
					
					//Position based on centre of mesh
					dx = (x2-x1)
					if(dx < 0) {dx = dx * -1}
					dy = (y2-y1)
					if(dy < 0) {dy = dy * -1}
					dz = (z2-z1)
					if(dz < 0) {dz = dz * -1}
					
					c1 = dx < (w1/2 + w2/2)
					c2 = dy < (h1/2 + h2/2)
					c3 = dz < (l1/2 + l2/2)
					
					if(c1 && c2 && c3) {
						if(collisions.indexOf(obj2) == -1) {
							collisions.push(obj2)
						}
					}
				}
				i1 += 1
			}


			var i0 = 0
			var group1
			while(i0 < this.grouphitboxnames.length) {
				group1 = this.grouphitboxes[i0]
				while(i1 < group1.length) {
					obj2 = group1[i1]
					if(this.distance({x1:obj1.position.x,y1:obj1.position.y,z1:obj1.position.z,x2:obj2.x,y2:obj2.y,z2:obj2.z}) < this.renderdistance) {
						x1 = obj1.position.x
						y1 = obj1.position.y
						z1 = obj1.position.z
						w1 = obj1.geometry.parameters.width
						h1 = obj1.geometry.parameters.height
						l1 = obj1.geometry.parameters.depth
						x2 = obj2.x
						y2 = obj2.y
						z2 = obj2.z
						w2 = obj2.w
						h2 = obj2.h
						l2 = obj2.l
		
						
						
						//Position based on centre of mesh
						dx = (x2-x1)
						if(dx < 0) {dx = dx * -1}
						dy = (y2-y1)
						if(dy < 0) {dy = dy * -1}
						dz = (z2-z1)
						if(dz < 0) {dz = dz * -1}
						
						c1 = dx < (w1/2 + w2/2)
						c2 = dy < (h1/2 + h2/2)
						c3 = dz < (l1/2 + l2/2)
						
						if(c1 && c2 && c3) {
							if(collisions.indexOf(obj2) == -1) {
								collisions.push(obj2)
							}
						}
					}
					i1 += 1
				}
			i0 += 1
			}


			return(collisions)
		}
		else {
			return([])
		}
	
		
	},
	distance(data) {
		var dx = data.x2 - data.x1;
		var dy = data.y2 - data.y1;
		var dz = data.z2 - data.z1;

		distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
		return(distance)
	}
}

function threebasic() {
	//https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
	console.log("\x1b[31m%s","===== CyberChill ThreeBasic.js =====")
	console.log("\x1b[36m%s","Three.js made simpler")
	console.log("\x1b[35m%s","https://cyberchillgithub.github.io/threebasic")
	console.log("\x1b[35m%s","https://threebasic.repl.co")
	return(threebasic1)
}
