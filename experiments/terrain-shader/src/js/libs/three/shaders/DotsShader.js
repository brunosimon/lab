/**
 * @author bsimon / http://bruno-simon.com
 */

THREE.DotsShader = {

	uniforms: {

		"tDiffuse":    { type: "t", value: null },
		"dotColor":    { type: "c", value: new THREE.Color(0xffffff)},
		"dotAlpha":    { type: "f", value: 1},
		"dotDistance": { type: "f", value: 50},
		"dotOffsetX":  { type: "f", value: 0},
		"dotOffsetY":  { type: "f", value: 0},
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform vec2 resolution;",
		"uniform vec3 dotColor;",
		"uniform float dotAlpha;",
		"uniform float dotDistance;",
		"uniform float dotOffsetX;",
		"uniform float dotOffsetY;",

		"varying vec2 vUv;",

		"bool drawable() {",
			"return !(bool(mod(floor(gl_FragCoord.x - dotOffsetX), dotDistance)) || bool(mod(floor(gl_FragCoord.y + dotOffsetY), dotDistance)));",
		"}",

		"void main() {",

			"gl_FragColor = texture2D( tDiffuse, vUv );",

			"if(drawable()) {",
				"vec4 color = vec4(dotColor,1.);",
				"gl_FragColor = mix(gl_FragColor,color,dotAlpha);",
			"}",

		"}"

	].join("\n")

};

