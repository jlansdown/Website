import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 512,
	height: 512,
	backgroundColor: '#333333',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0},
			debug: false,
		}
	},
	scene: [Preloader, Game],
	scale: {
		zoom: 2
	}
})
