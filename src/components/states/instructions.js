function getUrlParams () {
  var match;
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
  var query = window.location.search.substring(1);
  var urlParams = {};

  match = search.exec(query);
  while (match) {
    urlParams[decode(match[1])] = decode(match[2]);
    match = search.exec(query);
  }
  return urlParams;
}

var defaultDanceData = {};

AFRAME.registerComponent('instructions', {
  init: function () {
    this.startButtonEl = document.querySelector('.start-button');
    this.startButtonEl.querySelector('span').innerHTML = 'Loading';
    console.log(this.startButtonEl.querySelector('span').classList.add('loading'));
    this.startButtonEl.querySelector('span').classList.add('loading');
    this.startReplaying = this.startReplaying.bind(this);
    this.loading = true;
    this.danceData = null;
    this.el.sceneEl.addEventListener('loaded', this.downloadDance.bind(this));
  },

  handleDanceData: function (data) {
    this.danceData = data;

    var sceneEl = this.el.sceneEl;
    var inVR = sceneEl.is('vr-mode');

    if (!sceneEl.hasLoaded) {
      sceneEl.addEventListener('loaded', this.handleDanceData.bind(this));
      return;
    }

    if (inVR) {
      this.startReplaying();
    } else {
      this.setupStartButton();
    }
  },

  downloadDance: function () {
    var urlParams = getUrlParams();
    var self = this;
    if (urlParams.url) {
      this.el.sceneEl.systems['uploadcare'].download(urlParams.url, function (data) {
        self.handleDanceData(data.content);
      });
    } else {
      this.handleDanceData(defaultDanceData);
    }
  },

  setupStartButton: function () {
    var sceneEl = document.querySelector('a-scene');
    if (!sceneEl.hasLoaded) {
      sceneEl.addEventListener('loaded', this.setupStartButton.bind(this));
      return;
    }
    var buttonLabelEl = this.startButtonEl.querySelector('span');
    buttonLabelEl.innerHTML = 'START';
    buttonLabelEl.classList.remove('loading');
  },

  startReplaying: function () {
    if (!this.danceData) { return; }

    var el = this.el;
    document.querySelector('.start-button').style.display = 'none';
    el.setAttribute('game-state', 'state', 'replay');
    el.components['replay'].loadDance(this.danceData);
  },

  play: function () {
    this.startButtonEl.addEventListener('click', this.startReplaying);
    this.el.sceneEl.addEventListener('enter-vr', this.startReplaying);
  },

  pause: function () {
    this.startButtonEl.removeEventListener('click', this.startReplaying);
    this.el.sceneEl.addEventListener('enter-vr', this.startReplaying);
  }
});
