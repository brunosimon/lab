import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super()

        this.resize = this.resize.bind(this)
        window.addEventListener('resize', this.resize)
        this.resize()
    }

    /**
     * Resize
     */
    resize()
    {
        this.width = window.innerWidth
        this.height = window.innerHeight

        this.trigger('resize')
    }
}