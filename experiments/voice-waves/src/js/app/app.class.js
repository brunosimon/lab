var H   = {};
H.World = {};
H.Debug = {};

H.App = B.Core.Abstract.extend(
{
    options : {},

    construct : function()
    {
        this.ticker     = new B.Tools.Ticker();
        this.registry   = new B.Tools.Registry();
        this.keyboard   = new B.Tools.Keyboard();
        this.browser    = new B.Tools.Browser();
        this.stats      = new H.Debug.Stats();
        this.tweaks     = new H.Debug.Tweaks();
        this.microphone = new H.Microphone();
        this.scene      = new H.World.Scene();

        this.ticker.run();
    }
} );
