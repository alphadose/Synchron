AFRAME.registerComponent('playable-song', {

  init: function () {
    let data = this.data;
    let id =this.el.getAttribute("id");
    this.el.addEventListener("mouseenter", function () {
      player("add", id);
      console.log("added");
    });
  }
});
