import utils from 'node_modules/decentraland-ecs-utils/index'
import { Game } from './game'

export class Target extends Entity {
	speed: number
	valueScore: number
	touchable: boolean
	game: Game
	animator: Animator
	hitClip: AnimationState
	hitClipCollider: AnimationState
	direction: string
	
	constructor(game: any, originSide: number, value:number){
		super()
		engine.addEntity(this)
		
		// Initialization
		this.game = game
		this.setParent(this.game)
		this.valueScore = value
		this.addComponent(new GLTFShape('models/target1.glb'))
		this.animator = new Animator()
		this.addComponent(this.animator)
		this.hitClip = new AnimationState('target1Hit')
		this.hitClipCollider = new AnimationState('target1Hit_collider')
		this.hitClip.looping = false
		this.hitClip.stop()
		this.hitClip.reset()
		this.animator.addClip(this.hitClip)
		this.hitClipCollider.looping = false
		this.hitClipCollider.stop()
		this.hitClipCollider.reset()
		this.animator.addClip(this.hitClipCollider)
		
		if(originSide == 0){
			const StartPos = new Vector3(-7.5,1,-15)
			const EndPos = new Vector3(7.5,1,-15)
			this.addComponent(new Transform({position: new Vector3(-7.5,1,-15), scale: new Vector3(1,1,1)}))
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
			this.direction = 'right'
		} else if (originSide == 1) {
			const StartPos = new Vector3(7.5,1,-15)
			const EndPos = new Vector3(-7.5,1,-15)
			this.addComponent(new Transform({position: new Vector3(7.5,1,-15), scale: new Vector3(1,1,1)}))	
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
			this.direction = 'left'
		} else if (originSide == 2) {
			const StartPos = new Vector3(-7.5,1,-8)
			const EndPos = new Vector3(7.5,1,-8)
			this.addComponent(new Transform({position: new Vector3(7.5,1,-8), scale: new Vector3(1,1,1)}))	
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
			this.direction = 'right'
		} else if (originSide == 3) {
			const StartPos = new Vector3(7.5,1,-8)
			const EndPos = new Vector3(-7.5,1,-8)
			this.addComponent(new Transform({position: new Vector3(7.5,1,-8), scale: new Vector3(1,1,1)}))	
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
			this.direction = 'left'
		} else if (originSide == 4) {
			const StartPos = new Vector3(-7.5,1,-3)
			const EndPos = new Vector3(7.5,1,-3)
			this.addComponent(new Transform({position: new Vector3(7.5,1,-3), scale: new Vector3(1,1,1)}))	
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
			this.direction = 'right'
		} else if (originSide == 5) {
			const StartPos = new Vector3(7.5,1,-3)
			const EndPos = new Vector3(-7.5,1,-3)
			this.addComponent(new Transform({position: new Vector3(7.5,1,-3), scale: new Vector3(1,1,1)}))	
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
			this.direction = 'left'
		}
		
		// Hit a target
		this.addComponent(
			new OnPointerDown((e) => {
				log("myEntity was clicked", e)
				this.hitClip.play()
				this.hitClipCollider.play()
				this.game.score.addScore(this.valueScore)
				this.displayScore(true)
				this.addComponentOrReplace(new utils.Delay(1000, () =>{
					engine.removeEntity(this)
				}))
				this.removeComponent(OnPointerDown)
			}, {distance: 35})
		)
		
		// Target is not hit
		this.addComponent(new utils.Delay(3000, () =>{
			log('perdu')
			this.displayScore(false)
			this.getComponent(GLTFShape).visible = false
			this.game.player.removeLife()
			this.addComponentOrReplace(new utils.Delay(2000, () =>{
				engine.removeEntity(this)
			}))
		}))
	}
	
	displayScore(bonus){
		const score = new Entity()
		score.setParent(this)
		score.addComponent(new Transform({position: new Vector3(0,1,0)}))
		score.getComponent(Transform).rotation.eulerAngles = new Vector3(0,180,0)
		const text = new TextShape()
		if(bonus === true){
			text.value = '+'+this.valueScore.toString()
			text.color = Color3.Green()
		} else {
			text.value = '-'+this.valueScore.toString()
			text.color = Color3.Red()
		}
		text.fontSize = 10
		score.addComponent(text)
		engine.addEntity(score)
		if(this.direction === 'right'){
			score.addComponent(new utils.MoveTransformComponent(new Vector3(0,1,0), new Vector3(-2,1.75,0),2, () => {
				engine.removeEntity(score)
			}))
		} else {
			score.addComponent(new utils.MoveTransformComponent(new Vector3(0,1,0), new Vector3(+2,1.75,0),2, () => {
				engine.removeEntity(score)
			}))
		}
	}
}