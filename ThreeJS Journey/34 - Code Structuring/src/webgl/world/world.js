import WebGL from "../webgl";
import Environment from "./environment";
import Floor from "./floor";
import Fox from './fox'

export default class World {
    constructor() {
        this.webgl = new WebGL()
        this.scene = this.webgl.scene
        this.resources = this.webgl.resources

        // Setup
        this.resources.on('ready', () => {
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }
    update() {
        if(this.fox)
            this.fox.update()
    }

}