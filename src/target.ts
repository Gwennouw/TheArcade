import * as utils from '@dcl/ecs-scene-utils'
import { Game } from './game'

@Component('targetFlag')
export class TargetFlag {}

export class Target extends Entity {
	speed: number
	valueScore: number
	touchable: boolean
	game: Game
	animator: Animator
	hitClip: AnimationState
	hitClipCollider: AnimationState
	direction: string
	hitSound: AudioSource
	test: boolean
	
	constructor(game: any, originSide: number, touchable: boolean, value:number, test?: boolean){
		super()
		engine.addEntity(this)
		
		// Initialization
		this.game = game
		this.touchable = touchable
		this.setParent(this.game)
		this.valueScore = value
		this.test = test
		
		// const clipHit = new AudioClip("sounds/Targethit.wav")
		const clipHit = new AudioClip("sounds/Targethit.wav")
		this.hitSound = new AudioSource(clipHit)
		this.addComponent(this.hitSound)
		this.animator = new Animator()
		this.addComponent(this.animator)
		this.addComponent(new TargetFlag())
		
		if(touchable === true){
			this.addComponent(new GLTFShape('models/target1.glb'))
			this.hitClip = new AnimationState('target1Hit')
			this.hitClipCollider = new AnimationState('target1Hit_collider')
		} else {
			this.addComponent(new GLTFShape('models/target2.glb'))
			this.hitClip = new AnimationState('target2Hit')
			this.hitClipCollider = new AnimationState('target2Hit_collider')
		}
		this.hitClip.looping = false
		this.hitClip.stop()
		this.hitClip.reset()
		this.animator.addClip(this.hitClip)
		
		this.hitClipCollider.looping = false
		this.hitClipCollider.stop()
		this.hitClipCollider.reset()
		this.animator.addClip(this.hitClipCollider)
		
		if(!this.test){
		// log('is test')
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
				
		// Target is not hit
			this.addComponentOrReplace(new utils.Delay(3000, () =>{
				// log('perdu')
				if(this.touchable === true){
					this.displayLife()
					this.getComponent(GLTFShape).visible = false
					this.game.player.removeLife()
					this.addComponentOrReplace(new utils.Delay(2000, () =>{
						engine.removeEntity(this)
					}))
				}
			}))
		}
	}
	
	hitTarget(){
		this.hitClip.play()
		this.hitClipCollider.play()
		this.addComponentOrReplace(new utils.Delay(500, () =>{
			this.hitSound.playOnce()
			if(this.touchable === true){
				this.game.score.addScore(this.valueScore)
				this.displayScore(true)
			} else {
				this.game.score.removeScore(this.valueScore)
				this.displayScore(false)
			}
			this.addComponentOrReplace(new utils.Delay(1000, () =>{
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
			text.value = '+'+this.valueScore.toString()+' pts'
			text.color = Color3.Green()
		} else {
			text.value = '-'+this.valueScore.toString()+' pts'
			text.color = Color3.Red()
		}
		text.fontSize = 10
		score.addComponent(text)
		engine.addEntity(score)
		if(this.direction === 'right'){
			score.addComponent(new utils.MoveTransformComponent(new Vector3(0,1,0), new Vector3(-2,2,0),2, () => {
				engine.removeEntity(score)
			}))
		} else {
			score.addComponent(new utils.MoveTransformComponent(new Vector3(0,1,0), new Vector3(2,2,0),2, () => {
				engine.removeEntity(score)
			}))
		}
	}
	
	displayLife(){
		const score = new Entity()
		score.setParent(this)
		score.addComponent(new Transform({position: new Vector3(0,1,0)}))
		score.getComponent(Transform).rotation.eulerAngles = new Vector3(0,180,0)
		const text = new TextShape()
		text.value = '-'+this.valueScore.toString()+' life'
		text.color = Color3.Red()
		
		text.fontSize = 10
		score.addComponent(text)
		engine.addEntity(score)
		if(this.direction === 'right'){
			score.addComponent(new utils.MoveTransformComponent(new Vector3(0,1,0), new Vector3(-2,2,0),2, () => {
				engine.removeEntity(score)
			}))
		} else {
			score.addComponent(new utils.MoveTransformComponent(new Vector3(0,1,0), new Vector3(2,2,0),2, () => {
				engine.removeEntity(score)
			}))
		}
	}
}