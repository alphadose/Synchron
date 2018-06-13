let modelMixer = [], modelClock = [] ;
AFRAME.registerComponent('json-model', {
  schema: {
    src: { type: 'string' },
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' },
    anglevalue: { type: 'number' },
  },
  init: function () {
    console.log("model called");
    let modelScene = this.el.sceneEl.object3D;
    let data =this.data;
    let modelModel = this.data;
animate();

      // LOAD JSON
      var modelloader = new THREE.JSONLoader();
      modelloader.load( "/models/" + data.src , function ( geometry, materials ) {
        materials.forEach(function(mat){
          mat.skinning = true;
        });
        let modelmesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial(materials));
        modelmesh.position.set( data.x, data.y, data.z );
        if(data.z<=0)
        modelmesh.rotateY(data.anglevalue);
        else
        modelmesh.rotateY(data.anglevalue - 180);
        let modelclocka= new THREE.Clock();
        modelClock.push(modelclocka);
        modelScene.add( modelmesh );
        let modelMixera = new THREE.AnimationMixer( modelmesh );
        modelAction = modelMixera.clipAction( geometry.animations[0] );
        modelMixer.push(modelMixera);
        modelAction.play();
      } );
  }
});


function animate() {
  requestAnimationFrame( animate );
  for(i = 0; i< modelMixer.length;i++ )
  if( modelMixer[i] ) {
    modelMixer[i].update( modelClock[i].getDelta() );
  }
}
