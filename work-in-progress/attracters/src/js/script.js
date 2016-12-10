var App, app;

App = (function() {
  function App() {
    this.init_attractions();
    this.init_particles();
    this.init_canvas();
    this.init_events();
  }

  App.prototype.init_attractions = function() {
    var i, j, results;
    this.attractions = [];
    results = [];
    for (i = j = 0; j < 10; i = ++j) {
      results.push(this.attractions.push(new Attraction));
    }
    return results;
  };

  App.prototype.init_particles = function() {
    var i, j, results;
    this.particles = [];
    results = [];
    for (i = j = 0; j < 1000; i = ++j) {
      results.push(this.particles.push(new Particle(this.attractions)));
    }
    return results;
  };

  App.prototype.init_canvas = function() {
    return this.canvas = new Canvas(this.particles, this.attractions);
  };

  App.prototype.init_events = function() {
    var frame, time;
    time = {};
    time.ref = +(new Date);
    time.elapsed = 0;
    frame = (function(_this) {
      return function() {
        var current_time, j, len, particle, ref, results;
        window.requestAnimationFrame(frame);
        current_time = +(new Date);
        time.elapsed = (current_time - time.ref) / 1000;
        time.ref = current_time;
        _this.canvas.update();
        ref = _this.particles;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          particle = ref[j];
          results.push(particle.update(time.elapsed));
        }
        return results;
      };
    })(this);
    return frame();
  };

  return App;

})();

app = new App;
