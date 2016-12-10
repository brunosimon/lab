var Attraction;

Attraction = (function() {
  function Attraction() {
    this.radius = 50 + Math.round(Math.random() * 200);
    this.x = this.radius + Math.round(Math.random() * (window.innerWidth - this.radius * 2));
    this.y = this.radius + Math.round(Math.random() * (window.innerHeight - this.radius * 2));
    this.strength = 1;
    this.direction = -1;
  }

  Attraction.prototype.get_speed = function(particle) {
    var angle, distance, speed, strength, tan_angle, x, y;
    x = particle.x - this.x;
    y = particle.y - this.y;
    angle = Math.atan2(x, y);
    tan_angle = angle += Math.PI * 0.5 * this.direction;
    distance = Math.sqrt(Math.pow(x, 2), Math.pow(y, 2));
    speed = {
      x: 0,
      y: 0
    };
    if (distance > this.radius) {
      return speed;
    } else {
      strength = (1 - (distance / this.radius)) * this.strength;
      speed.x = Math.sin(tan_angle) * strength;
      speed.y = Math.cos(tan_angle) * strength;
      return speed;
    }
  };

  return Attraction;

})();
