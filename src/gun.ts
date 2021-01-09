import utils from 'node_modules/decentraland-ecs-utils/index'
import { Player } from './player'

export class Gun extends Entity {
	gunSystem: ISystem
	ballsSystem: ISystem
	gunShoot: AnimationState
	gunLoad: AnimationState
	player: Player
	balls: number
	ballsContainer: UIContainerStack
	ballsIcons: Array<UIImage>
	ballIconTexture: Texture
	
	constructor(player: Player){
		super()
		engine.addEntity(this)
		
		// Initialization
		this.player = player
		this.balls = 6
		// this.setParent(this.player)
		this.gunSystem = new GunSystem(this.player)
		this.ballsSystem = new BallsSystem(this.player)
		this.addComponent(new GLTFShape('models/weapon.glb'))
		
		this.addComponent(new Animator())
		this.gunShoot = new AnimationState('weaponshoot')
		this.gunLoad = new AnimationState('weaponload')
		this.gunShoot.looping = false
		this.gunLoad.looping = false
		this.gunShoot.stop()
		this.gunLoad.stop()
		this.gunShoot.reset()
		this.gunLoad.reset()
		this.getComponent(Animator).addClip(this.gunShoot)
		this.getComponent(Animator).addClip(this.gunLoad)
		
		// UI
		this.ballsContainer = new UIContainerStack(this.player.canvas)
		this.ballsContainer.width = '20%'
		this.ballsContainer.height = 320
		this.ballsContainer.positionX = '0%'
		this.ballsContainer.positionY = '-30%'		
		this.ballsContainer.hAlign = "right"
		this.ballsContainer.vAlign = "top"
		this.ballsContainer.stackOrientation = UIStackOrientation.VERTICAL
		let ballIcon = "images/bullet.png"
		this.ballIconTexture = new Texture(ballIcon)
		this.ballsIcons = []
		
		for(let i=0;i<this.balls;i++){
			const uiimage = new UIImage(this.ballsContainer, this.ballIconTexture)
			uiimage.sourceLeft = 0
			uiimage.sourceTop = 0
			uiimage.sourceWidth = 64
			uiimage.sourceHeight = 64
			uiimage.paddingBottom = 5
			this.ballsIcons.push(uiimage)
		}
		
		this.generateBallsIcons()
		const gunPos = new Vector3((this.player.camera.position.x+0.5),(this.player.camera.position.y-0.5),(this.player.camera.position.z+0.5))
		// const gunRot = new Quaternion((this.player.camera.position.x),(this.player.camera.position.y),(this.player.camera.position.z),(this.player.camera.position.w))
		this.addComponent(new Transform({position: gunPos, rotation: new Quaternion(0,1,0,1)}))
		engine.addEntity(this)
	}
	
	generateBallsIcons(){
		for(let icon of this.ballsIcons){
			icon.visible = true
		}
	}
	
	start(){
		engine.addSystem(this.ballsSystem)
		engine.addSystem(this.gunSystem)
	}
	
	stop(){
		engine.removeSystem(this.ballsSystem)
		engine.removeSystem(this.gunSystem)
	}
}


class GunSystem implements ISystem {
	player: Player

	constructor(player) {
		this.player = player
	}
	
	update(dt: number) {
		let gunPos = new Vector3()
		if(this.player.camera.rotation.eulerAngles.y >= 0 && this.player.camera.rotation.eulerAngles.y <= 90){
			// gunPos = new Vector3((this.player.camera.position.x+(0.5*Math.sin(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))),(this.player.camera.position.y-0.5),(this.player.camera.position.z+(0.5*Math.cos(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))))
			gunPos = new Vector3((this.player.camera.position.x+(0.5*Math.sin(this.player.camera.rotation.y))),(this.player.camera.position.y-0.5),(this.player.camera.position.z+(0.5*Math.cos(this.player.camera.rotation.y))))
		} 
		// else if(this.player.camera.rotation.eulerAngles.y > 90 && this.player.camera.rotation.eulerAngles.y <= 180){
			// gunPos = new Vector3((this.player.camera.position.x+(0.5*Math.sin(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))),(this.player.camera.position.y-0.5),(this.player.camera.position.z+(0.5*Math.cos(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))))
		// }
		// else if(this.player.camera.rotation.eulerAngles.y > 180 && this.player.camera.rotation.eulerAngles.y <= 270){
			// gunPos = new Vector3((this.player.camera.position.x+(0.5*Math.sin(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))),(this.player.camera.position.y-0.5),(this.player.camera.position.z+(0.5*Math.cos(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))))
		// } 
		// else if(this.player.camera.rotation.eulerAngles.y > 270 && this.player.camera.rotation.eulerAngles.y <= 360){
			// gunPos = new Vector3((this.player.camera.position.x+(0.5*Math.sin(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))),(this.player.camera.position.y-0.5),(this.player.camera.position.z+(0.5*Math.cos(this.player.camera.rotation.eulerAngles.y*(180/Math.PI)))))
		// }
		
		if(this.player.gun.getComponent(Transform).position.x !== gunPos.x && this.player.gun.getComponent(Transform).position.y !== gunPos.y){
			// log('******')
			// log('player pos : ',this.player.camera.position)
			// log('gun pos : ',gunPos)
			// log('******')
			this.player.gun.getComponent(Transform).position = gunPos
		}
		
		const gunRot = new Vector3((this.player.camera.rotation.eulerAngles.x),(this.player.camera.rotation.eulerAngles.y),(this.player.camera.rotation.eulerAngles.z))
		if(this.player.gun.getComponent(Transform).rotation.eulerAngles.y !== gunRot.y){
			// log('player rot.euler : ',this.player.camera.rotation.eulerAngles)
			// log('player rot : ',this.player.camera.rotation)
			// log('gun rot : ',gunRot)
			// log('******')
			this.player.gun.getComponent(Transform).rotation.eulerAngles = gunRot
		}
	}
}

export class BallsSystem implements ISystem {
	player: Player

	constructor(player) {
		this.player = player
	}
	update(dt: number) {
		if(this.player.gun.balls !== this.player.gun.ballsIcons.length){
			const diffBalls = this.player.gun.ballsIcons.length - this.player.gun.balls
			// const removedIconsBalls = this.player.gun.ballsIcons.splice(this.player.gun.balls, diffBalls)
			const removedIconsBalls = this.player.gun.ballsIcons[this.player.gun.balls]
			// log('balls : ',this.player.gun.ballsIcons,' - icon : ',this.player.gun.ballsIcons)
			// log('removedIconsBalls : ',removedIconsBalls)
			// for(let icon of removedIconsBalls){
				removedIconsBalls.visible = false
			// }
			if (this.player.gun.balls === 0){
				this.player.gun.balls = 6
				this.player.gun.generateBallsIcons()
			}
		}
	}
}