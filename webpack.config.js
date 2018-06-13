var config = {
    // TODO: Add common Configuration
    module: {},
};

var bundle = Object.assign({}, config, {
    entry: ["./public/vendor/aframe.min.js",
            "./public/vendor/aframe-motion-capture-components.js",
            "./public/vendor/CCapture.min.js","./public/vendor/songbird.min.js",
            "./public/vendor/aframe-bmfont-text-component.min.js",
            "./public/components/states/replay.js","./public/components/states/instructions.js",
            "./public/components/proxy-event.js","./public/components/option-select-button.js",
            "./public/components/game-state.js","./public/components/discofloor.js",
            "./public/components/spotlight.js","./public/components/roomcolor.js",
            "./public/components/listener.js","./public/components/playable-song.js",
            "./public/components/emit-close.js"],
    output: {
       path: "/home/alphadose/Desktop/MusicVR/public/js",
       filename: "bundle.js"
    },
});

// Return Array of Configurations
module.exports = bundle;