import utils from 'node_modules/decentraland-ecs-utils/index'
import { Player } from './player'

export class Gun extends Entity {
	gunSystem: ISystem
	ballsSystem: ISystem
	gunShoot: AnimationState
	gunLoad: AnimationState
	player: Player
	balls: number
	ballsVisible: number
	gunContainer: UIContainerStack
	ballsContainer: UIContainerStack
	ballsIcons: Array<UIImage>
	ballIconTexture: Texture
	gunIconTexture: Texture
	gunIcon: UIImage
	
	constructor(player: Player, canvas: UICanvas){
		super()
		engine.addEntity(this)
		
		// Initialization
		this.player = player
		this.balls = 6
		this.ballsVisible = 6
		// this.setParent(Attachable.AVATAR)
		// this.setParent(this.player)
		this.gunSystem = new GunSystem(this.player)
		this.ballsSystem = new BallsSystem(this)
		this.addComponent(new GLTFShape('models/weapon.glb'))
		
		this.addComponent(new Animator())
		this.gunShoot = new AnimationState('weaponshoot')
		this.gunLoad = new AnimationState('weaponreload')
		this.gunShoot.looping = false
		this.gunLoad.looping = false
		this.gunShoot.speed = 1
		this.gunLoad.speed = 1.6
		this.gunShoot.stop()
		this.gunLoad.stop()
		this.gunShoot.reset()
		this.gunLoad.reset()
		this.getComponent(Animator).addClip(this.gunShoot)
		this.getComponent(Animator).addClip(this.gunLoad)
		
		// UI
		this.gunContainer = new UIContainerStack(canvas)
		this.gunContainer.width = '20%'
		this.gunContainer.height = '100%'
		this.gunContainer.adaptHeight = true
		this.gunContainer.adaptWidth = true
		this.gunContainer.positionX = '0%'
		this.gunContainer.positionY = '0%'		
		this.gunContainer.hAlign = "right"
		this.gunContainer.vAlign = "bottom"
		this.gunContainer.stackOrientation = UIStackOrientation.VERTICAL
		
		this.ballsContainer = new UIContainerStack(canvas)
		this.ballsContainer.width = '20%'
		this.ballsContainer.height = 55
		this.ballsContainer.adaptHeight = true
		this.ballsContainer.adaptWidth = true
		this.ballsContainer.positionX = -180
		this.ballsContainer.positionY = '28%'
		this.ballsContainer.hAlign = "right"
		this.ballsContainer.vAlign = "bottom"
		this.ballsContainer.stackOrientation = UIStackOrientation.HORIZONTAL
		const ballIcon = "images/bulletHUD.png"
		this.ballIconTexture = new Texture(ballIcon)
		this.ballsIcons = []
				
		for(let i=0;i<this.balls;i++){
			const uiimage = new UIImage(this.ballsContainer, this.ballIconTexture)
			uiimage.sourceLeft = 0
			uiimage.sourceTop = 0
			uiimage.sourceWidth = 27
			uiimage.sourceHeight = 55
			uiimage.width = 64
			uiimage.height = 64
			uiimage.paddingTop = 0
			uiimage.paddingLeft = 16
			uiimage.paddingRight = 16
			uiimage.paddingBottom = 0
			this.ballsIcons.push(uiimage)
		}
		
		const gunImage = "images/weaponHUD.old.png"
		this.gunIconTexture = new Texture(gunImage)
		this.gunIcon = new UIImage(this.gunContainer, this.gunIconTexture)
		this.gunIcon.sourceLeft = 0
		this.gunIcon.sourceTop = 0
		this.gunIcon.hAlign = "right"
		this.gunIcon.vAlign = "bottom"
		this.gunIcon.sourceWidth = 1920
		this.gunIcon.sourceHeight = 1080
		this.gunIcon.width = 360
		this.gunIcon.height = 203
		this.gunIcon.paddingTop = 0
		this.gunIcon.paddingLeft = 0
		this.gunIcon.paddingRight = 0
		this.gunIcon.paddingBottom = 0
		
		
		this.generateBallsIcons()
		const gunPos = new Vector3((this.player.camera.position.x+0.5),(this.player.camera.position.y-0.5),(this.player.camera.position.z+0.5))
		// this.addComponent(new Transform({position: gunPos, rotation: new Quaternion(0,1,0,1)}))
		this.addComponent(new Transform({position: gunPos, rotation: new Quaternion(0,0,0,0)}))
		engine.addEntity(this)
	}
	
	generateBallsIcons(){
		for(let icon of this.ballsIcons){
			icon.visible = true
		}
	}
	
	start(){
		this.balls = 6
		this.ballsVisible = 6
		this.generateBallsIcons()
		this.getComponent(GLTFShape).visible = true
		engine.addSystem(this.ballsSystem)
		engine.addSystem(this.gunSystem)
	}
	
	stop(){
		this.getComponent(GLTFShape).visible = false
		engine.removeSystem(this.ballsSystem)
		engine.removeSystem(this.gunSystem)
		// engine.removeEntity(this)
	}
}


class GunSystem implements ISystem {
	player: Player

	constructor(player) {
		this.player = player
	}
	
	update(dt: number) {
		this.player.gun.getComponent(Transform).position = Vector3.Zero()
		this.player.gun.getComponent(Transform).rotation = Quaternion.Zero()
		let forwardVector: Vector3 = Vector3.Forward().rotate(this.player.camera.rotation)
		this.player.gun.getComponent(Transform).position = this.player.camera.position.clone().add(forwardVector)
		this.player.gun.getComponent(Transform).position.y = 1.25
		
		const gunRot = new Vector3((this.player.camera.rotation.eulerAngles.x),(this.player.camera.rotation.eulerAngles.y),(this.player.camera.rotation.eulerAngles.z))
		if(this.player.gun.getComponent(Transform).rotation.eulerAngles.y !== gunRot.y){
			this.player.gun.getComponent(Transform).rotation.eulerAngles = gunRot
		}
	}
}

export class BallsSystem implements ISystem {
	gun: Gun

	constructor(gun) {
		this.gun = gun
	}
	update(dt: number) {
		if(this.gun.balls !== this.gun.ballsVisible){
			if(this.gun.balls >= 0){
				if(this.gun.balls === 0){
					this.gun.ballsIcons[this.gun.balls].visible = false
				} else {
					this.gun.ballsIcons[this.gun.balls].visible = false
				}
				this.gun.ballsVisible--
				
				if (this.gun.balls <= 0){
					this.gun.balls = 6
					this.gun.ballsVisible = 6
					this.gun.generateBallsIcons()
				}
			}
		}
	}
}