AFRAME.registerComponent('listener', {
    tick: function () {
        pos = this.el.getAttribute('position');
        if (soundSources.length) {
            for (i = 0; i < 2; i++) {
                soundSources[i].setPosition(-speakerPos[i.toString()].x + pos.x, speakerPos[i.toString()].y - pos.y, speakerPos[i.toString()].z - pos.z);
            }
        }
    }
});
