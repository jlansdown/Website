import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('preloader')
    }

    preload()
    {
        this.load.image('tiles', 'tiles/map.png')
        this.load.image('sign', 'items/sign.png')

        this.load.tilemapTiledJSON('dungeon', 'tiles/forest.json')

        this.load.atlas('faune', 'character/fauna.png', 'character/fauna.json')

    }

    create()
    {
        this.scene.start('game')
    }
}