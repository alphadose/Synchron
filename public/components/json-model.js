let modelMixer, modelClock = new THREE.Clock();
AFRAME.registerComponent('json-model', {
  schema: {
    src: { type: 'string' },
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' },
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
        modelScene.add( modelmesh );
        modelMixer = new THREE.AnimationMixer( modelmesh );
        modelAction = modelMixer.clipAction( geometry.animations[0] );
        modelAction.play();
      } );
  }
});


function animate() {
  requestAnimationFrame( animate );
  if( modelMixer ) {
    modelMixer.update( modelClock.getDelta() );
  }
}
