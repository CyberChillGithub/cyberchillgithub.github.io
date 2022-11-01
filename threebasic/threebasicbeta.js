<html lang="en" >
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<title>Beluga Sim</title>
<style>
* {box-sizing:border-box;user-select: none;touch-action: manipulation;outline:none;font-family:arial;}

body {
  margin: 0;
  padding: 0;
  background: #012345;
  //overflow: hidden;
}

#canvas {
  position: absolute;
}



</style>

</head>
<body>
  <div id="canvas"></div>
</body>
<!--<script src="https://threejs.org/build/three.js"></script>-->
<script src="three.js"></script>
<script src="threebasic7.js"></script>
<script>
//Animatiom required for textures to load
//Use cube hitboxes seperately to objects, and allow linking with objects (linked object, offset)
var threebasic = threebasic()
var threebasictest = threebasic.test()
threebasic.init({background:"#000000",renderdistance:15,defaultfps:60})
var texture0 = 'data:image/jpeg;base64,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'
threebasic.setmaterial({name:"beluga",material:texture0})
var texture = threebasic.getmaterial({name:"beluga"})
//var texture = 'data:image/png;base64,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'
//threebasic.cube({name:"cube1",w:2,h:2,l:2,texture:false,color:"#123456"})
//threebasic.grid({w:200,h:200})

threebasic.cube({name:"cube1",w:2,h:2,l:2,gravity:0.2*threebasic.fpsmultiplier,anchored:false,texture:true,texture1:texture,texture2:texture,texture3:texture,texture4:texture,texture5:texture,texture6:texture})
threebasic.x({name:"cube1",value:2})
var i = 0
var i2 = 1

var i0 = 0
while(i0 < 10) {
	if(i0 != 1) {
		threebasic.cube({name:i0.toString(),w:1,h:1,l:1,gravity:0,texture:true,texture1:texture,texture2:texture,texture3:texture,texture4:texture,texture5:texture,texture6:texture})
	}
	else {
		threebasic.cube({name:i0.toString(),w:1,h:1,l:1,gravity:0,texture:true,texture1:texture,texture2:texture,texture3:texture,texture4:texture,texture5:texture,texture6:texture})
	}
	threebasic.x({name:i0.toString(),value:i0-0.5-5,set:true,initial:true})
	threebasic.y({name:i0.toString(),value:-0.5,set:true,initial:true})
	threebasic.z({name:i0.toString(),value:1.5,set:true,initial:true})
	if(i0 == 1) {
		threebasic.sethitbox({name:i0.toString(),group:"map2"})
	}
	else {
		threebasic.sethitbox({name:i0.toString(),group:"map"})
	}
	i0 += 1
}
var i00 = 0
var i1 = 0

/*
while(i00 < 350) {
	
	threebasic.setchunk({name:(i00).toString(),x:-5.5,y:-0.5,z:2.5+(i00)*5,w:5,h:1,l:5})
	
	while(i1 < (i00+1)*5) {
		i0 = 0
		while(i0 < 5) {
			threebasic.cube({name:"a" + i1.toString() + i0.toString(),w:1,h:1,l:1,chunk:(i00).toString(),gravity:0,texture:true,texture1:texture,texture2:texture,texture3:texture,texture4:texture,texture5:texture,texture6:texture})
			threebasic.x({name:"a" + i1.toString() + i0.toString(),value:i0-0-0.5-5,set:true,initial:true})
			threebasic.y({name:"a" + i1.toString() + i0.toString(),value:-0.5,set:true,initial:true})
			threebasic.z({name:"a" + i1.toString() + i0.toString(),value:2.5+i1,set:true,initial:true})
			threebasic.sethitbox({name:"a" + i1.toString() + i0.toString()})
			
			i0 += 1
		}
		i1 += 1
	}
	
	
	i00 += 1
	//i1 += 5
}
*/
var positions1 = []
while(i00 < 350) {
	
	threebasic.setchunk({name:(i00).toString(),x:-5.5,y:-0.5,z:2.5+(i00)*5,w:5,h:1,l:5})
	
	while(i1 < (i00+1)*5) {
		i0 = 0
		while(i0 < 5) {
			//threebasic.cube({name:"a" + i1.toString() + i0.toString(),w:1,h:1,l:1,chunk:(i00).toString(),gravity:0,texture:true,texture1:texture,texture2:texture,texture3:texture,texture4:texture,texture5:texture,texture6:texture})
			//threebasic.x({name:"a" + i1.toString() + i0.toString(),value:i0-0-0.5-5,set:true,initial:true})
			//threebasic.y({name:"a" + i1.toString() + i0.toString(),value:-0.5,set:true,initial:true})
			//threebasic.z({name:"a" + i1.toString() + i0.toString(),value:2.5+i1,set:true,initial:true})
			positions1.push({x:i0*1.05-0-0.5-5,y:-0.5,z:2.5+i1*1.05})
			//threebasic.sethitbox({name:"a" + i1.toString() + i0.toString()})
			
			i0 += 1
		}
		i1 += 1
	}
	
	
	i00 += 1
	//i1 += 5
}
console.log(positions1)
threebasic.setgroup({name:"map1",type:"cube",amount:8750,gravity:0,w:5,h:1,l:350,w2:1,h2:1,l2:1,x:0,y:0,z:0})
threebasic.sethitbox({name:"map1"}) //Add custom hitboxes for individual objects
threebasic.grouppositions({name:"map1",positions:positions1})

var camera_x = 0
var camera_x2 = 0
var camposx2 = 0
var vz = 0
var vz2 = 0

threebasic.y({name:"cube1",value:20,set:true,initial:true})
threebasic.z({name:"cube1",value:1,set:true,initial:true})
threebasic.sethitbox({name:"cube1",group:"cube1"})
threebasic.cube({name:"cube2",w:1,h:1,l:1,gravity:0,texture:false,color:"#FF0000"})
threebasic.sethitbox({name:"cube2"})
threebasic.sethitbox({name:"1"})
threebasic.y({name:"cube2",value:1,set:true,initial:true})
threebasic.z({name:"cube2",value:0,set:true,initial:true})

threebasic.cube({name:"cube3",w:100,h:1,l:100,gravity:0,texture:false,color:"#123456"})
threebasic.x({name:"cube3",value:40,set:true,initial:true})
threebasic.y({name:"cube3",value:-5,set:true,initial:true})
threebasic.z({name:"cube3",value:50,set:true,initial:true})
threebasic.sethitbox({name:"cube3"})
var animate = function () {
	threebasic.animateframe(animate);
	threebasic.forwards({name:"cube1",speed:vz})
	threebasic.forwards({name:"1",speed:vz2})
	threebasic.cameraposx += camera_x
	camposx2 += camera_x2
	threebasic.rotatey({name:"1",value:camposx2,set:true})
	threebasic.cameraview1({mainobject:"cube1",offsetx:5,offsety:1.5,offsetz:5})
};

animate();


document.onkeydown = function (e) {
    e = e || window.event;
	if(e.keyCode == 87) {
		vz = -0.05*threebasic.fpsmultiplier
	}
	else if(e.keyCode == 83) {
		vz = 0.05*threebasic.fpsmultiplier
	}
	else if(e.keyCode == 73) {
		vz2 = -0.05*threebasic.fpsmultiplier
	}
	else if(e.keyCode == 75) {
		vz2 = 0.05*threebasic.fpsmultiplier
	}
	else if(e.keyCode == 69) {
		camera_x = -0.02*threebasic.fpsmultiplier
	}
	else if(e.keyCode == 81) {
		camera_x = 0.02*threebasic.fpsmultiplier
	}
	else if(e.keyCode == 79) {
		camera_x2 = -0.02*threebasic.fpsmultiplier
	}
	else if(e.keyCode == 85) {
		camera_x2 = 0.02*threebasic.fpsmultiplier
	}
};


document.onkeyup = function (e) {
    e = e || window.event;
	if(e.keyCode == 87) {
		vz = 0
	}
	else if(e.keyCode == 83) {
		vz = 0
	}
	else if(e.keyCode == 73) {
		vz2 = 0
	}
	else if(e.keyCode == 75) {
		vz2 = 0
	}
	else if(e.keyCode == 69) {
		camera_x= 0
	}
	else if(e.keyCode == 81) {
		camera_x = 0
	}
	else if(e.keyCode == 79) {
		camera_x2 = 0
	}
	else if(e.keyCode == 85) {
		camera_x2 = 0
	}
};



</script>

</body>
</html>
