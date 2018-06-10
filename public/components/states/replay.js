var audioCapabilities = (function (el) {
  return function () {
    var support = {};

    try {
      if (!el.canPlayType) {
        return Boolean(false);
      }

      support = Boolean(true);

      support.ogg = canPlayType(el, 'audio/ogg; codecs="vorbis"');
      support.mp3 = canPlayType(el, 'audio/mpeg; codecs="mp3"');
      support.opus = canPlayType(el, 'audio/ogg; codecs="opus"') ||
                     canPlayType(el, 'audio/webm; codecs="opus"');

      // Supported mime-types:
      // - https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
      // - https://bit.ly/iphoneoscodecs
      support.wav = canPlayType(el, 'audio/wav; codecs="1"');
      support.m4a = canPlayType(el, 'audio/x-m4a;') ||
                    canPlayType(el, 'audio/aac;');
    } catch (e) {
    }

    return support;
  };
})(document.createElement('audio'));


AFRAME.registerComponent('replay', {
  init: function () {
    this.onEnterVR = this.onEnterVR.bind(this);
  },

  play: function () {
    this.el.addEventListener('enter-vr', this.onEnterVR);
  },

  pause: function () {
    this.el.removeEventListener('enter-vr', this.onEnterVR);
  },

  onEnterVR: function () {
    var position = this.el.isMobile ? '0 1.6 0.80' : '0 0 1.5';
  },

  loadDance: function (data) {
    var self = this;
    var el = this.el;
    el.emit('dancing');
  },

  insertSelectionHands: function () {
    var leftSelectionHandEl;
    var rightSelectionHandEl;
    var spectatorCameraRigEl;
    if (this.insertedHands) { return; }
    this.onTriggerDown = this.onTriggerDown.bind(this);
    spectatorCameraRigEl = this.el.querySelector('#spectatorCameraRig');
    leftSelectionHandEl = this.leftSelectionHandEl = document.createElement('a-entity');
    rightSelectionHandEl = this.rightSelectionHandEl = document.createElement('a-entity');
    leftSelectionHandEl.id = 'leftSelectionHand';
    rightSelectionHandEl.id = 'rightSelectionHand';
    leftSelectionHandEl.setAttribute('vive-controls', 'hand: left');
    rightSelectionHandEl.setAttribute('vive-controls', 'hand: right');
    leftSelectionHandEl.setAttribute('oculus-touch-controls', 'hand: left');
    rightSelectionHandEl.setAttribute('oculus-touch-controls', 'hand: right');
    spectatorCameraRigEl.appendChild(leftSelectionHandEl);
    spectatorCameraRigEl.appendChild(rightSelectionHandEl);
    leftSelectionHandEl.addEventListener('triggerdown', this.onTriggerDown);
    rightSelectionHandEl.addEventListener('triggerdown', this.onTriggerDown);

    var textProps = {
      font : 'assets/asaturdaynight.fnt',
      color: '#fcff79',
      align: 'right',
      anchor:'right',
      side:  'double',
      value: '<< Press trigger to record\n and upload your dance',
      width: 0.40,
      opacity: 0
    };
    this.leftTooltip = document.createElement('a-entity');
    this.leftTooltip.setAttribute('text', textProps);
    this.leftTooltip.setAttribute('rotation', '-90 0 0');
    this.leftTooltip.setAttribute('position', '0.23 -0.03 0.06');
    this.rightTooltip = document.createElement('a-entity');
    this.rightTooltip.setAttribute('text', textProps);
    this.rightTooltip.setAttribute('text', {anchor: 'left', align: 'left', value: 'Press trigger to record >>\nand upload your dance'});
    this.rightTooltip.setAttribute('rotation', '-90 0 0');
    this.rightTooltip.setAttribute('position', '-0.23 -0.03 0.06');

    leftSelectionHandEl.appendChild(this.leftTooltip);
    rightSelectionHandEl.appendChild(this.rightTooltip);

    this.insertedHands = true;
  },

  onTriggerDown: function () {
    if (!this.el.sceneEl.is('vr-mode')) { return; }
    this.el.setAttribute('game-state', 'state', 'avatar-selection');
  },

  tick: function (time, delta) {
    if (!this.el.is('vr-mode')) return;
    var opacity = 1 - Math.abs( Math.sin(time / 200)) * 0.9;
  },

  remove: function () {
    var i;
    var animationEls = this.el.querySelectorAll('[begin=dancing]');
    var spectatorCameraRigEl = this.el.querySelector('#spectatorCameraRig');
    document.querySelector('#room [sound]').components.sound.stopSound();
    this.el.removeAttribute('avatar-replayer');
    this.cameraRig.setAttribute('rotation', '0 0 0');
    for (i = 0; i < animationEls.length; ++i) {
      animationEls[i].stop();
    }
    this.leftTooltip.parentNode.removeChild(this.leftTooltip);
    this.rightTooltip.parentNode.removeChild(this.rightTooltip);
    this.leftSelectionHandEl.removeEventListener('triggerdown', this.onTriggerDown);
    this.rightSelectionHandEl.removeEventListener('triggerdown', this.onTriggerDown);
    spectatorCameraRigEl.removeChild(this.leftSelectionHandEl);
    spectatorCameraRigEl.removeChild(this.rightSelectionHandEl);
  }
});
