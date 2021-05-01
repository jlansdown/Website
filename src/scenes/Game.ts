import Phaser from 'phaser'
import Player from '../characters/Player'
import '../characters/Player'
import Sign from '../items/Sign'
import { debugDraw } from '../utils/debug'
import { createCharacterAnims } from '../anims/CharacterAnims'

export default class Game extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private faune!: Player
	constructor()
	{
		super('game')
	}

	preload()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {

       createCharacterAnims(this.anims)

       const map = this.make.tilemap({key: 'dungeon'})
       const tileset = map.addTilesetImage('forest', 'tiles')

       //@ts-ignore
       map.createStaticLayer('Ground', tileset)
       //@ts-ignore
       map.createStaticLayer('Path', tileset)

       //@ts-ignore
       this.faune = this.add.player(200, 175, 'faune')
       

       //@ts-ignore
       const foliageLayer = map.createStaticLayer('Foliage', tileset)
       foliageLayer.setCollisionByProperty({ collides: true })

       //debugDraw(foliageLayer, this)

       const signs = this.physics.add.staticGroup({
           classType: Sign
       })
       const signLayer = map.getObjectLayer('Signs')
       signLayer.objects.forEach(signObj => {
            signs.get(signObj.x! + signObj.width! * 0.5, signObj.y! - signObj.height! * 0.5, 'sign')
       })
       
       this.physics.add.collider(this.faune, signs, this.handlePlayerSignCollision, undefined, this)
       this.physics.add.collider(this.faune, foliageLayer)
       this.cameras.main.startFollow(this.faune, true)
    }

    private handlePlayerSignCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
    {
        const sign = obj2 as Sign
        this.faune.setSign(sign)
    }

    update(t: number, dt: number)
    {
       this.faune.update(this.cursors)
        
    }
}
