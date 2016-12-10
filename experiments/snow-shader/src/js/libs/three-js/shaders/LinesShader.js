/**
 * @author bsimon / http://bruno-simon.com
 */

THREE.LinesShader = {

	uniforms: {

		"tDiffuse"     :  { type: "t", value: null },
		"lineColor"    :  { type: "c", value: new THREE.Color(0xffffff)},
		"lineAlpha"    :  { type: "f", value: 1},
		"lineDistance" :  { type: "f", value: 50},
		"lineOffsetX"  :  { type: "f", value: 0},
		"lineOffsetY"  :  { type: "f", value: 0},
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
		"uniform vec3 lineColor;",
		"uniform float lineAlpha;",
		"uniform float lineDistance;",
		"uniform float lineOffsetX;",
		"uniform float lineOffsetY;",

		"varying vec2 vUv;",

		"bool drawable() {",
			"return !bool(mod(floor(gl_FragCoord.x - lineOffsetX), lineDistance)) || !bool(mod(floor(gl_FragCoord.y + lineOffsetY), lineDistance));",
		"}",

		"void main() {",

			"gl_FragColor = texture2D( tDiffuse, vUv );",

			"if(drawable()) {",
				"vec4 color = vec4(lineColor,1.);",
				"gl_FragColor = mix(gl_FragColor,color,lineAlpha);",
			"}",

		"}"

	].join("\n")

};

