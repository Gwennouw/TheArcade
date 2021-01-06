import utils from 'node_modules/decentraland-ecs-utils/index'

export class Player extends Entity {
	life: number = 5
	lifesContainer: UIContainerStack
	canvas: UICanvas
	lifeIcons: Array<UIImage>
	system: ISystem
	
	constructor(){
		super()
		engine.addEntity(this)
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
	}
	
	removeLife(){
		// this.lifeIcons[this.lifeIcons.length].visible = false
		this.life -= 1
		log('lifes : ',this.life)
	}
	
	start(){
		this.system = new UIPlayerSystem(this)
		engine.addSystem(this.system)
	}
	
	stop(){
		engine.removeSystem(this.system)
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
			// for(let i=0;i<this.player.life-1;i++){
				// const icon = this.player.lifeIcons[i]
				// this.player.removeComponent(this.player.lifeIcons[i])
			// }
		}
	}
}