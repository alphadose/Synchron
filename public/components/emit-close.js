let inPlayer = 0;
AFRAME.registerComponent('emit-close', {

    init: function () {
        this.el.addEventListener("mouseleave", function () {
            inPlayer = 0;
            setTimeout(function () {
                if (inPlayer == 0) {
                    document.getElementById("aframe-playlist").setAttribute("visible", false);
                    document.getElementById("aframe-queue").setAttribute("visible", false);
                }
            }, 3000);

        });

        this.el.addEventListener("mouseenter", function () {
            inPlayer = 1;
        });
    }

});
