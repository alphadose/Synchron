    let sceneEl = document.querySelector('#aframe-playlist');
  let entityEl = document.createElement('a-entity');
  entityEl.setAttribute('geometry', {
    primitive: 'box',
    height: .5,
    width: 2,
    depth: 0,
  });
  entityEl.setAttribute('material', 'color', 'black');
  entityEl.setAttribute('position', { x: 0, y: 2.4, z: .01 });
  entityEl.setAttribute('text', { value: 'SONGS', align: 'center', width: 6 });
  sceneEl.appendChild(entityEl);


  let songslistforplaying = ["Wake_Me_Up", "Demons", "Bloodstream", "Blank_Space"];
  for (i = 0; i < 4; i++) {
    let entityEl = document.createElement('a-entity');
    entityEl.setAttribute('geometry', {
      primitive: 'box',
      height: .5,
      width: 2,
      depth: 0,
    });
    entityEl.setAttribute('material', 'color', '#101010');
    entityEl.setAttribute('id', songslistforplaying[i]);
    entityEl.setAttribute('playable-song', '');
    entityEl.setAttribute('position', { x: 0, y: 1.6 - .8 * i, z: .01 });
    entityEl.setAttribute('text', { value: songslistforplaying[i], align: 'center', width: 6 });
    sceneEl.appendChild(entityEl);
  }
  let queueEl = document.querySelector('#aframe-queue');
  let addedEl = document.createElement('a-entity');
  addedEl.setAttribute('geometry', {
    primitive: 'box',
    height: .5,
    width: 2,
    depth: 0,
  });
  addedEl.setAttribute('material', 'color', 'black');
  addedEl.setAttribute('position', { x: 0, y: 2.4, z: .01 });
  addedEl.setAttribute('text', { value: 'PLAYLIST', align: 'center', width: 6 });
  queueEl.appendChild(addedEl);

//   setInterval(function () {

// if (screen.orientation.angle >= 90) {
// document.getElementById("fixed-snackbar").setAttribute("rotation", {z: -90, x:0 ,y:0});
// document.getElementById("fixed-score").setAttribute("rotation", {z: -90, x:0 ,y:0});
// document.getElementById("subs").setAttribute("rotation", {z: -90, x:0 ,y:0});
// } else {
//   document.getElementById("fixed-snackbar").setAttribute("rotation", {z: 0, x:0 ,y:0});
//   document.getElementById("fixed-score").setAttribute("rotation", {z: 0, x:0 ,y:0});
//   document.getElementById("subs").setAttribute("rotation", {z: 0, x:0 ,y:0});
// }
// }, 1000);
function getAngleDeg(z,x) {
  if(x==0  && z ==0 ){
    return 0;
  } else{
    var angleRad = Math.atan(z/x);
    var angleDeg = angleRad * 180 / Math.PI;
    return(angleDeg);
  }
}

function addModel(name, xl,yl,zl){

let modeltobe = document.createElement("a-entity");

let container = document.createElement("a-entity");
container.setAttribute("position", {x:xl ,y: yl ,z: zl});
let anglevalue = getAngleDeg(zl,xl);

modeltobe.setAttribute("json-model", {src: 'char_final.json' ,x:xl ,y: yl ,z: zl ,anglevalue});

container.appendChild(modeltobe);
let namemodel = document.createElement("a-entity");
let namemodel1 = document.createElement("a-entity");
let nameanimation = document.createElement("a-animation");

nameanimation.setAttribute("attribute", "rotation");
nameanimation.setAttribute("to", "0 360 0");
nameanimation.setAttribute("repeat", "indefinite");
nameanimation.setAttribute("fill", "forwards");
nameanimation.setAttribute("duration", "10000");

namemodel.setAttribute("position", { y: 2});
namemodel.setAttribute("rotation", {y: 360 - anglevalue});
namemodel.setAttribute("text" , {value: name ,width:3 ,align: 'center'});

namemodel1.setAttribute("position", { y: 2});
namemodel1.setAttribute("rotation", {y: 360 - anglevalue + 180});
namemodel1.setAttribute("text" , {value: name ,width:3 ,align: 'center'});

//namemodel.append(nameanimation);
container.appendChild(namemodel);
container.appendChild(namemodel1);
document.getElementById("models-location").appendChild(container);
}

socket.on('getOthers', function(data){
  let pos = data.positions;
  document.querySelector("a-camera").setAttribute("position", {x:pos[0][0] ,y: pos[0][1]+1.5 ,z: pos[0][2]});
  for(var i=1 ;i<pos.length;i++){
    addModel(data.names[i], pos[i][0], pos[i][1] , pos[i][2]);
  }
});