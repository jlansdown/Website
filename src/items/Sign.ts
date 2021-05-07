import Phaser from 'phaser'

export default class Sign extends Phaser.Physics.Arcade.Sprite
{

    private url!: string

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame)
    }

    setUrl(link: string)
    {
        this.url = link
    }

    read()
    {
        var tweet = 'Testing opening a url link'
        var s = window.open(this.url, '_blank')

        if (s && s.focus)
        {
            s.focus()
        }
        else if (!s)
        {
            window.location.href = this.url
        }
    }

}