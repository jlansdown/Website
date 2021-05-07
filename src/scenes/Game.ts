import Phaser from 'phaser'
import Player from '../characters/Player'
import '../characters/Player'
import Sign from '../items/Sign'
import { debugDraw } from '../utils/debug'
import { createCharacterAnims } from '../anims/CharacterAnims'
import findPath from '../utils/findpath'

export default class Game extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private pointer!: Phaser.Input.Pointer
    private faune!: Player
	constructor()
	{
		super('game')
	}

	preload()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.pointer = this.input.activePointer
    }

    create()
    {

       createCharacterAnims(this.anims)

       const map = this.make.tilemap({key: 'dungeon'})
       const tileset = map.addTilesetImage('forest', 'tiles')

       //@ts-ignore
       const groundLayer = map.createStaticLayer('Ground', tileset)

       //@ts-ignore
       const pathLayer = map.createStaticLayer('Path', tileset)

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


       this.cameras.main.setBounds(0, 0, foliageLayer.displayWidth, foliageLayer.displayHeight)
       this.cameras.main.startFollow(this.faune)


       this.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
           console.log("click")
           const {worldX, worldY} = pointer

           const startVec = pathLayer.worldToTileXY(this.faune.x, this.faune.y)
           console.dir(startVec)
           const targetVec = pathLayer.worldToTileXY(worldX, worldY)
           console.dir(targetVec)

           const path = findPath(startVec, targetVec, pathLayer, foliageLayer)
            console.dir(path)
           this.faune.moveAlong(path)
       })

       this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
           this.input.off(Phaser.Input.Events.POINTER_UP)
       })
    }

    private handlePlayerSignCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
    {
        this.faune.setVelocity(0,0)
        const sign = obj2 as Sign
        this.faune.setSign(sign, this.faune.y)
    }

    update(t: number, dt: number)
    {
       this.pointer = this.input.activePointer
       this.faune.update(this.cursors, this.pointer)
        
    }
}
