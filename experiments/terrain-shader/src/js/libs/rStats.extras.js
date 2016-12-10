var glStats = function() {

    var _rS = null;

    var _totalDrawArraysCalls = 0, 
        _totalDrawElementsCalls = 0, 
        _totalUseProgramCalls = 0, 
        _totalFaces = 0, 
        _totalVertices = 0, 
        _totalPoints = 0,
        _totalBindTexures = 0;

        function _h( f, c ) {
            return function() {
                c.apply( this, arguments );
                f.apply( this, arguments );
            }
        }
    WebGLRenderingContext.prototype.drawArrays = _h( WebGLRenderingContext.prototype.drawArrays, function() { 
        _totalDrawArraysCalls++;
        if( arguments[ 0 ] == this.POINTS ) _totalPoints += arguments[ 2 ];
        else _totalVertices += arguments[ 2 ];
    } );

    WebGLRenderingContext.prototype.drawElements = _h( WebGLRenderingContext.prototype.drawElements, function() { 
        _totalDrawElementsCalls++;
        _totalFaces += arguments[ 1 ] / 3;
        _totalVertices += arguments[ 1 ];
    } );

    WebGLRenderingContext.prototype.useProgram = _h( WebGLRenderingContext.prototype.useProgram, function() { 
        _totalUseProgramCalls++;
    } );

    WebGLRenderingContext.prototype.bindTexture = _h( WebGLRenderingContext.prototype.bindTexture, function() {
        _totalBindTexures++;
    } );

    var _values = {
        allcalls: { over: 3000, caption: 'Calls (hook)' },
        drawelements: { caption: 'drawElements (hook)' },
        drawarrays: { caption: 'drawArrays (hook)' },
    };

    var _groups = [
        { caption: 'WebGL', values: [ 'allcalls', 'drawelements', 'drawarrays', 'useprogram', 'bindtexture', 'glfaces', 'glvertices', 'glpoints' ] }
    ];

    var _fractions = [
        { base: 'allcalls', steps: [ 'drawelements', 'drawarrays' ] }
    ];

    function _update() {  
        _rS( 'allcalls' ).set( _totalDrawArraysCalls + _totalDrawElementsCalls );
        _rS( 'drawElements' ).set( _totalDrawElementsCalls );
        _rS( 'drawArrays' ).set( _totalDrawArraysCalls );
        _rS( 'bindTexture' ).set( _totalBindTexures );
        _rS( 'useProgram' ).set( _totalUseProgramCalls );
        _rS( 'glfaces' ).set( _totalFaces );
        _rS( 'glvertices' ).set( _totalVertices );
        _rS( 'glpoints' ).set( _totalPoints );
    }

    function _start() {
        _totalDrawArraysCalls = 0;
        _totalDrawElementsCalls = 0; 
        _totalUseProgramCalls = 0;
        _totalFaces = 0;
        _totalVertices = 0; 
        _totalPoints = 0;
        _totalBindTexures = 0;
    }

    function _end() {}

    function _attach( r ) {
        _rS = r;
    }

    return {
        update: _update,
        start: _start,
        end: _end,
        attach: _attach,
        values: _values,
        groups: _groups,
        fractions: _fractions
    }

}

var threeStats = function( renderer ) {

    var _rS = null;

    var _values = {
        'renderer.info.memory.geometries': { caption: 'Geometries' },
        'renderer.info.memory.textures': { caption: 'Textures' },
        'renderer.info.memory.programs': { caption: 'Programs' },
        'renderer.info.render.calls': { caption: 'Calls' },
        'renderer.info.render.faces': { caption: 'Faces', over: 1000 },
        'renderer.info.render.points': { caption: 'Points' },
        'renderer.info.render.vertices': { caption: 'Vertices' }
    };

    var _groups = [
        { caption: 'Three.js - memory', values: [ 'renderer.info.memory.geometries', 'renderer.info.memory.programs', 'renderer.info.memory.textures' ] },
        { caption: 'Three.js - render', values: [ 'renderer.info.render.calls', 'renderer.info.render.faces', 'renderer.info.render.points', 'renderer.info.render.vertices' ] }
    ];

    var _fractions = [];

    function _update() {

        _rS( 'renderer.info.memory.geometries' ).set( renderer.info.memory.geometries );
        _rS( 'renderer.info.memory.programs' ).set( renderer.info.memory.programs );
        _rS( 'renderer.info.memory.textures' ).set( renderer.info.memory.textures );
        _rS( 'renderer.info.render.calls' ).set( renderer.info.render.calls );
        _rS( 'renderer.info.render.faces' ).set( renderer.info.render.faces );
        _rS( 'renderer.info.render.points' ).set( renderer.info.render.points );
        _rS( 'renderer.info.render.vertices' ).set( renderer.info.render.vertices );

    }

    function _start() {}

    function _end() {}

    function _attach( r ) {
        _rS = r;
    }

    return {
        update: _update,
        start: _start,
        end: _end,
        attach: _attach,
        values: _values,
        groups: _groups,
        fractions: _fractions
    }

}