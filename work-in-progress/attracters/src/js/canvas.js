var Canvas;

Canvas = (function() {
  function Canvas(particles, attractions) {
    this.main = document.getElementById('canvas');
    this.context = this.main.getContext('2d');
    this.particles = particles;
    this.attractions = attractions;
    this.init_resize();
  }

  Canvas.prototype.init_resize = function() {
    var resize;
    resize = (function(_this) {
      return function() {
        _this.main.width = window.innerWidth;
        return _this.main.height = window.innerHeight;
      };
    })(this);
    window.onresize = resize;
    return resize();
  };

  Canvas.prototype.update = function() {
    var i, len, particle, ref, results;
    this.context.globalAlpha = 0.05;
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.main.width, this.main.height);
    this.context.globalAlpha = 1;
    this.context.fillStyle = '#fff';
    this.context.strokeStyle = '#fff';
    this.context.lineCap = 'round';
    ref = this.particles;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      particle = ref[i];
      this.context.lineWidth = particle.radius;
      this.context.beginPath();
      this.context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      results.push(this.context.fill());
    }
    return results;
  };

  return Canvas;

})();
