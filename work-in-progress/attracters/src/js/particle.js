var Particle,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Particle = (function() {
  function Particle(attractions) {
    this.update = bind(this.update, this);
    var direction;
    this.x = Math.round(Math.random() * window.innerWidth);
    this.y = Math.round(Math.random() * window.innerHeight);
    this.radius = 5;
    this.attractions = attractions;
    direction = Math.PI * 2 * Math.random();
    this.speed = {
      x: Math.sin(direction) * 50,
      y: Math.cos(direction) * 50
    };
    this.old_position = {
      x: this.x,
      y: this.y
    };
  }

  Particle.prototype.update = function(elapsed_time) {
    var attraction, i, len, ref, repositionned, speed;
    this.old_position.x = this.x;
    this.old_position.y = this.y;
    this.x += this.speed.x * elapsed_time;
    this.y += this.speed.y * elapsed_time;
    ref = this.attractions;
    for (i = 0, len = ref.length; i < len; i++) {
      attraction = ref[i];
      speed = attraction.get_speed(this);
      this.x += speed.x;
      this.y += speed.y;
    }
    repositionned = false;
    if (this.x > window.innerWidth + this.radius) {
      repositionned = true;
      this.x = -this.radius;
    } else if (this.x < -this.radius) {
      repositionned = true;
      this.x = window.innerWidth + this.radius;
    }
    if (this.y > window.innerHeight + this.radius) {
      repositionned = true;
      this.y = -this.radius;
    } else if (this.y < -this.radius) {
      repositionned = true;
      this.y = window.innerHeight + this.radius;
    }
    if (repositionned) {
      this.old_position.x = this.x;
      return this.old_position.y = this.y;
    }
  };

  return Particle;

})();
