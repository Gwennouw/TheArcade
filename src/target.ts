import utils from 'node_modules/decentraland-ecs-utils/index'
import { Game } from './game'

export class Target extends Entity {
	speed: number
	valueScore: number
	touchable: boolean
	game: Game
	animator: Animator
	hitClip: AnimationState
	
	constructor(game: any, originSide: number,value:number){
		super()
		engine.addEntity(this)
		
		// Initialization
		this.game = game
		this.valueScore = value
		this.addComponent(new GLTFShape('models/target1.glb'))
		this.animator = new Animator()
		this.addComponent(this.animator)
		this.hitClip = new AnimationState('target1Hit')
		this.hitClip.looping = false
		this.hitClip.reset()
		this.animator.addClip(this.hitClip)
		
		if(originSide < 5){
			const StartPos = new Vector3(0,1,30)
			const EndPos = new Vector3(15.5,1,30)
			this.addComponent(new Transform({position: new Vector3(0.5,1,30), scale: new Vector3(1,1,1)}))
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
		} else {
			const StartPos = new Vector3(15.5,1,30)
			const EndPos = new Vector3(0,1,30)
			this.addComponent(new Transform({position: new Vector3(15.5,1,30), scale: new Vector3(1,1,1)}))	
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
		}
		
		// Hit a target
		this.addComponent(
			new OnPointerDown((e) => {
				log("myEntity was clicked", e)
				this.hitClip.play()
				this.game.score.addScore(this.valueScore)
				this.addComponentOrReplace(new utils.Delay(1000, () =>{
					engine.removeEntity(this)
				}))
			}, {distance: 35})
		)
		
		// Target is not hit
		this.addComponent(new utils.Delay(3000, () =>{
			log('perdu')
			engine.removeEntity(this)
			this.game.player.removeLife()
		}))
	}
}