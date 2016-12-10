(function(window,APP)
{
    'use strict';

    APP.SkyBox = Abstract.extend(
    {
        options:{
            folder_name : 'sky-5'
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene  = this.options.scene;

            var shader = THREE.ShaderLib['cube'],
                // textures = new THREE.Texture([0,1,2,3,4,5],new THREE.CubeRefractionMapping());
                textures = new THREE.ImageUtils.loadTextureCube([
                    'src/textures/skybox/'+this.options.folder_name+'/right.jpg',
                    'src/textures/skybox/'+this.options.folder_name+'/left.jpg',
                    'src/textures/skybox/'+this.options.folder_name+'/top.jpg',
                    'src/textures/skybox/'+this.options.folder_name+'/bottom.jpg',
                    'src/textures/skybox/'+this.options.folder_name+'/front.jpg',
                    'src/textures/skybox/'+this.options.folder_name+'/back.jpg'
                ]);

            shader.uniforms['tCube'].value = textures;

            var material = new THREE.ShaderMaterial(
            {
                fragmentShader : shader.fragmentShader,
                vertexShader   : shader.vertexShader,
                uniforms       : shader.uniforms,
                side           : THREE.BackSide
            }),
            
            mesh = new THREE.Mesh(new THREE.CubeGeometry(10000,10000,10000),material);

            this.scene.add(mesh);
        },

        /**
         * UPDATE
         */
        update: function(player)
        {
            
        }
    });
})(window,APP);