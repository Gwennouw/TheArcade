import utils from 'node_modules/decentraland-ecs-utils/index'
import { Gun } from './gun'
import { TargetFlag } from './target'
import { Game } from './game'

@Component('gunTimer')
export class GunTimer{
	waiting: boolean
	
	constructor(){
		this.waiting = false
	}
}

export class Player extends Entity {
	life: number = 5
	lifeVisible: number = 5
	lifesContainer: UIContainerStack
	canvas: UICanvas
	lifeIcons: Array<UIImage>
	uiSystem: ISystem
	gun: Gun
	camera: Camera
	input: Input
	
	constructor(parent: Game, canvas: UICanvas){
		super()
		engine.addEntity(this)
		this.setParent(parent)
		this.camera = Camera.instance		
		this.input = Input.instance
		this.addComponent(new GunTimer())
		this.uiSystem = new UIPlayerSystem(this)
		
		// UI
		this.canvas = canvas
		this.lifesContainer = new UIContainerStack(this.canvas)
		this.lifesContainer.width = '100%'
		// this.lifesContainer.adaptWidth = true
		this.lifesContainer.height = 64
		this.lifesContainer.positionX = '2%'
		this.lifesContainer.positionY = '0%'		
		this.lifesContainer.hAlign = "left"
		this.lifesContainer.vAlign = "bottom"
		this.lifesContainer.stackOrientation = UIStackOrientation.HORIZONTAL
		let healthIcon = "images/lifeHUD.png"
		let healthIconTexture = new Texture(healthIcon)
		this.lifeIcons = []
		
		for(let i=0;i<5;i++){
			const uiimage = new UIImage(this.lifesContainer, healthIconTexture)
			uiimage.sourceLeft = 0
			uiimage.sourceTop = 0
			uiimage.sourceWidth = 64
			uiimage.sourceHeight = 64
			uiimage.paddingTop = 0
			uiimage.paddingLeft = 16
			uiimage.paddingRight = 16
			uiimage.paddingBottom = 0
			this.lifeIcons.push(uiimage)
		}
		
		// Gun
		this.gun = new Gun(this, this.canvas)
		this.input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
			// Manage Gun in shoot
			if(this.getComponent(GunTimer).waiting  === false && parent.started === true){
				this.gun.gunShoot.play()
				this.getComponent(GunTimer).waiting = true
				if(this.gun.balls !== 0){
					this.gun.balls--
					log('Shoot !')
					this.gun.addComponent(new utils.Delay(250, () =>{
						log('this.gun.getComponent(utils.Delay) !',this.gun.getComponent(utils.Delay))
						this.getComponent(GunTimer).waiting  = false
						this.gun.gunShoot.stop()
						this.gun.gunShoot.reset()
					}))
					if(this.gun.balls === 0) {
						this.getComponent(GunTimer).waiting  = true
						this.gun.gunShoot.stop()
						this.gun.gunShoot.reset()
						this.gun.gunLoad.play()
						log('Reaload !')
						log('this.gun.getComponent(utils.Delay) !',this.gun.getComponent(utils.Delay))
						this.gun.addComponentOrReplace(new utils.Delay(1250, () =>{
							this.getComponent(GunTimer).waiting  = false
							this.gun.gunLoad.stop()
							this.gun.gunLoad.reset()
						}))
					}
				} 
				
				// Manage Target in shoot
				if(e.hit){
					let hitEntity = engine.entities[e.hit.entityId]
					log('e.hit : ',hitEntity)
					// log('this.getComponent(GunTimer).waiting : ',this.getComponent(GunTimer).waiting)
					if(hitEntity !== undefined){
						log('e.hit.getComponent(TargetFlag) : ',hitEntity.getComponent(TargetFlag))
						if(hitEntity.getComponent(TargetFlag) !== undefined ){
							hitEntity.hitTarget()
						}
					}
				}
			}
		})
	}
	
	removeLife(){
		this.life -= 1
	}
	
	generateLifeIcons(){
		for(let icon of this.lifeIcons){
			icon.visible = true
		}
	}
	
	start(){
		this.life = 5
		this.lifeVisible = 5
		this.generateLifeIcons()
		this.gun.start()
		// this.gun = new Gun(this)
		engine.addSystem(this.uiSystem)
	}
	
	stop(){
		this.gun.stop()
		engine.removeSystem(this.uiSystem)
	}
}

export class UIPlayerSystem implements ISystem {
	player: Player

	constructor(player) {
		this.player = player
	}
	update(dt: number) {
		if(this.player.life !== this.player.lifeVisible){
			if(this.player.life >= 0){
				this.player.lifeIcons[this.player.life].visible = false
				this.player.lifeVisible--
			}
		}
	}
}

