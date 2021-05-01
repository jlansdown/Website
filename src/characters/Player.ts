import Phaser from 'phaser'
import Sign from '../items/Sign'
import 


declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            player(x: number, y: number, texture: string, frame?: string | number): Player
        }
    }
}

export default class Player extends Phaser.Physics.Arcade.Sprite
{

    private activeSign?: Sign

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame)
        this.anims.play('faune-idle-down')
    }

    setSign(sign: Sign)
    {
        this.activeSign = sign
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        if (!cursors)
        {
            return
        }

        const speed = 100
        const leftDown = cursors.left?.isDown
        const rightDown = cursors.right?.isDown
        const upDown = cursors.up?.isDown
        const downDown = cursors.down?.isDown

        if (Phaser.Input.Keyboard.JustDown(cursors.space!))
        {
            if (this.activeSign)
            {
                this.activeSign.read()
            }
        }

        if (leftDown)
        {
            this.anims.play('faune-run-side', true)
            this.setVelocity(-speed, 0)

            this.scaleX = -1
            this.body.offset.x = 24
        }
        else if (rightDown)
        {
            this.anims.play('faune-run-side', true)
            this.setVelocity(speed, 0)

            this.scaleX = 1
            this.body.offset.x = 8
        }
        else if (upDown)
        {
            this.anims.play('faune-run-up', true),
            this.setVelocity(0, -speed)
        }
        else if (downDown)
        {
            this.anims.play('faune-run-down', true)
            this.setVelocity(0, speed)
        }
        else
        {
            const parts = this.anims.currentAnim.key.split('-')
            parts[1] = 'idle'
            this.play(parts.join('-'))
            this.setVelocity(0, 0)
        }

        if (leftDown || rightDown || upDown || downDown)
        {
            this.activeSign = undefined
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    var sprite = new Player(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.5)


    return sprite
})