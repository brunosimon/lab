B.Tools.Tweaker = B.Core.Abstract.extend(
{
    static  : 'tweaker',
    options : {},

    construct : function( options )
    {
        this._super( options );

        this.gui = new dat.GUI();
    }
} );
