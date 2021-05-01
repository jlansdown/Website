import Phaser from 'phaser'

export default class Sign extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame)
    }

    read()
    {
        var tweet = 'Testing opening a url link'
        var url = 'https://github.com/jlansdown'
        var s = window.open(url, '_blank')

        if (s && s.focus)
        {
            s.focus()
        }
        else if (!s)
        {
            window.location.href = url
        }
    }

}