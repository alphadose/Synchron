let index = 0;
AFRAME.registerComponent('playable-song', {

  init: function () {
    let data = this.data;
    let id =this.el.getAttribute("id");
    this.el.addEventListener("mouseenter", function () {
      player("add", id);
      let sceneEl = document.querySelector('#aframe-queue');
      let entityEl = document.createElement('a-entity');
      entityEl.setAttribute('geometry', {
        primitive: 'box',
        height: .5,
        width: 2,
        depth: 0,
      });
      entityEl.setAttribute('material', 'color', '#101010');
      entityEl.setAttribute('position', { x: 0, y: 1.6 - .8 * index++, z: .01 });
      entityEl.setAttribute('text', { value: id, align: 'center', width: 6 });
      sceneEl.appendChild(entityEl);

    });
  }
});
