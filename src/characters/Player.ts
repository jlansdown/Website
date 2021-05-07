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

    private movePath: Phaser.Math.Vector2 = []
    private moveToTarget?: Phaser.Math.Vector2

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame)
        this.anims.play('faune-idle-down')
    }

    setSign(sign: Sign, y)
    {
        var url

        if (y > 200)
        {
            url = 'https://github.com/jlansdown/Website' 
        }
        else {
            url = 'https://github.com/jlansdown'
        }

        this.activeSign = sign
        sign.setUrl(url)
        this.activeSign!.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            sign.read()
        })
    }

    moveAlong(path: Phaser.Math.Vector2[])
	{
        console.log('moving')
		if (!path || path.length <= 0)
		{
            //console.log('here')
			return
		}

		this.movePath = path
		this.moveTo(this.movePath.shift()!)
	}

    moveTo(target: Phaser.Math.Vector2)
	{
		this.moveToTarget = target
	}

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, pointer: Phaser.Input.Pointer)
    {
        /*if (!cursors)
        {
            return
        }*/

        const speed = 100

        var ROTATION_SPEED = 1 * Math.PI; // 0.5 arc per sec, 2 sec per arc
        var ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED);
        var TOLERANCE = 0.02 * ROTATION_SPEED;

        var velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;

        /*const leftDown = cursors.left?.isDown
        const rightDown = cursors.right?.isDown
        const upDown = cursors.up?.isDown
        const downDown = cursors.down?.isDown*/


        if (pointer.isDown)
        {
            
            var angleToPointer = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
            var angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - this.rotation);
            
            
            this.rotation = angleToPointer;
           

            velocityFromRotation(this.rotation, speed, this.body.velocity);
            //console.log(angleToPointer)

            if (angleToPointer < - 2.5 || angleToPointer > 2.5)
            {
                this.anims.play('faune-run-side', true)
                

                this.scaleX = -1
                this.body.offset.x = 24
            }
            else if ( angleToPointer > -0.13 && angleToPointer < 0.95)
            {
                this.anims.play('faune-run-side', true)

                this.scaleX = 1
                this.body.offset.x = 8
            }
            else if (angleToPointer < -1.3)
            {
                this.anims.play('faune-run-up', true)
                
            }
            else if (angleToPointer > 0.95)
            {
                this.anims.play('faune-run-down', true)
            }
            
        }
        

        else if (this.moveToTarget)
        {
            let dx = 0
            
            let dy = 0
            console.log("weee")
            dx = this.moveToTarget.x - this.x
            dy = this.moveToTarget.y - this.y

            if (Math.abs(dx) < 5)
            {
                dx = 0
            }
            if (Math.abs(dy) < 5)
            {
                dy = 0
            }

            if (dx === 0 && dy === 0)
            {
                if (this.movePath.length > 0)
                {
                    this.moveTo(this.movePath.shift()!)
                    return
                }
                
                this.moveToTarget = undefined
            }

        const leftDown = dx < 0
        const rightDown = dx > 0
        const upDown = dy < 0
        const downDown = dy > 0

        if (leftDown)
        {
            this.anims.play('faune-run-side', true)
            this.setVelocity(-speed, 0)

            this.flipX = true
        }
        else if (rightDown)
        {
            this.anims.play('faune-run-side', true)
            this.setVelocity(speed, 0)

            this.flipX = false
        }
        else if (upDown)
        {
            this.anims.play('faune-run-up', true)
            this.setVelocity(0, -speed)
        }
        else if (downDown)
        {
            this.anims.play('faune-run-down', true)
            this.setVelocity(0, speed)
        }
    }
        

        

        /*if (pointer.isUp)
        {
            this.activeSign = undefined
            this.setVelocity(0,0)
        }*/
        
        else
        {
            const parts = this.anims.currentAnim.key.split('-')
            parts[1] = 'idle'
            this.play(parts.join('-'))
            this.setVelocity(0, 0)
        }

        // this logic is the same except we determine
        // if a key is down based on dx and dy
        
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