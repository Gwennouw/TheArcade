import utils from 'node_modules/decentraland-ecs-utils/index'
import { Gun } from './gun'
import { TargetFlag } from './target'

@Component('gunTimer')
export class GunTimer{
	waiting: boolean
	
	constructor(){
		this.waiting = false
	}
}

export class Player extends Entity {
	life: number = 5
	lifesContainer: UIContainerStack
	canvas: UICanvas
	lifeIcons: Array<UIImage>
	uiSystem: ISystem
	gun: Gun
	camera: Camera
	input: Input
	
	constructor(){
		super()
		engine.addEntity(this)
		
		this.camera = Camera.instance		
		this.input = Input.instance
		this.addComponent(new GunTimer())
		this.canvas = new UICanvas()
		this.lifesContainer = new UIContainerStack(this.canvas)
		this.lifesContainer.width = '100%'
		this.lifesContainer.height = 320
		this.lifesContainer.positionX = '1%'
		this.lifesContainer.positionY = '-30%'		
		this.lifesContainer.hAlign = "left"
		this.lifesContainer.vAlign = "top"
		this.lifesContainer.stackOrientation = UIStackOrientation.VERTICAL
		let healthIcon = "images/healthIcon64.png"
		let healthIconTexture = new Texture(healthIcon)
		this.lifeIcons = []
		
		for(let i=0;i<5;i++){
			const uiimage = new UIImage(this.lifesContainer, healthIconTexture)
			uiimage.sourceLeft = 0
			uiimage.sourceTop = 0
			uiimage.sourceWidth = 64
			uiimage.sourceHeight = 64
			uiimage.paddingBottom = 5
			this.lifeIcons.push(uiimage)
		}
		
		this.start()
		this.gun = new Gun(this)
		this.gun.start()
		this.input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
			// log('player Click !', e)
			this.gun.gunShoot.play()
			if(e.hit){
				let hitEntity = engine.entities[e.hit.entityId]
				if(this.getComponent(GunTimer).waiting !== true && hitEntity !== undefined){
					log('hitEntity !', hitEntity)
					if(hitEntity.getComponent(TargetFlag) !== undefined ){
						log('hitEntity.getComponent(TargetFlag) !', hitEntity.getComponent(TargetFlag))
						log('Target exist !', hitEntity)
						hitEntity.hitTarget()
					}
				}
			}
			if(this.getComponent(GunTimer).waiting  !== true){
				this.getComponent(GunTimer).waiting  = true
				this.gun.addComponent(new utils.Delay(500, () =>{
					this.getComponent(GunTimer).waiting  = false
				}))
			}
		})
	}
	
	shoot(){
	
	}
	
	removeLife(){
		this.life -= 1
		log('lifes : ',this.life)
	}
	
	start(){
		// this.gun = new Gun(this)
		// this.gun.start()
		this.uiSystem = new UIPlayerSystem(this)
		engine.addSystem(this.uiSystem)
	}
	
	stop(){
		// this.gun.stop()
		engine.removeSystem(this.uiSystem)
		// engine.removeEntity(this.gun)
		engine.removeEntity(this)
	}
}

export class UIPlayerSystem implements ISystem {
	player: Player

	constructor(player) {
		this.player = player
	}
	update(dt: number) {
		if(this.player.life !== this.player.lifeIcons.length){
			const diff = this.player.lifeIcons.length - this.player.life
			const removedIcons = this.player.lifeIcons.splice(this.player.life, diff)
			log('life : ',this.player.life,' - icon : ',this.player.lifeIcons.length)
			log('removedIcons : ',removedIcons)
			for(let icon of removedIcons){
				icon.visible = false
			}
		}
	}
}

