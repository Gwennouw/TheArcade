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
		// this.gunContainer.adaptHeight = true
		// this.gunContainer.adaptWidth = true
		this.gunContainer.positionX = '0%'
		this.gunContainer.positionY = '0%'		
		this.gunContainer.hAlign = "right"
		this.gunContainer.vAlign = "bottom"
		this.gunContainer.stackOrientation = UIStackOrientation.VERTICAL
		
		this.ballsContainer = new UIContainerStack(this.gunContainer)
		this.ballsContainer.width = '20%'
		this.ballsContainer.height = 55
		// this.ballsContainer.adaptHeight = true
		this.ballsContainer.positionX = 0
		this.ballsContainer.positionY = -35
		this.ballsContainer.hAlign = "left"
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
		
		const gunImage = "images/weaponHUD.png"
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
		
		this.addComponent(new Transform())
		this.getComponent(Transform).position = Vector3.Zero()
		this.getComponent(Transform).rotation = Quaternion.Zero()
		this.getComponent(Transform).position.x += 1
		this.getComponent(Transform).position.z += 1
		this.setParent(Attachable.AVATAR)
		engine.addEntity(this)
		let forwardVector: Vector3 = Vector3.Forward().rotate(this.player.camera.rotation)
		this.getComponent(Transform).position = this.player.camera.position.clone().add(forwardVector)
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
		this.gunContainer.visible = true
		engine.addSystem(this.ballsSystem)
	}
	
	stop(){
		this.getComponent(GLTFShape).visible = false
		this.gunContainer.visible = false
		engine.removeSystem(this.ballsSystem)
		engine.removeSystem(this.gunSystem)
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