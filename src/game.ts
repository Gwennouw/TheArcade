import utils from "../node_modules/decentraland-ecs-utils/index"
import { Target } from './target'
import { Score } from './score'
import { Player } from './player'
import * as ui from '../node_modules/@dcl/ui-utils/index'

@Component('gameFlag')
export class GameFlag {}

@Component('timer')
export class Timer {
	totalTime: number
	timeLeft: number
	constructor(time: number){
		this.totalTime = time
		this.timeLeft = time
	}
}

export class Game extends Entity {
	targets: Array<Target>
	player: Player
	score: Score
	decor: GLTFShape
	starter: Entity
	canvas: UICanvas
	difficultyRate: number
	started: boolean = false
	system: ISystem
	startCounter: ui.UICounter
	
	constructor(){
		super()
		engine.addEntity(this)
		this.canvas = new UICanvas()
		this.targets = []
		this.difficultyRate = 1
		this.decor = new GLTFShape('models/base.glb')
		this.addComponent(this.decor)
		this.addComponent(new Transform({position: new Vector3(16,0,8), rotation: new Quaternion(0,1,0,-1)}))
		this.score = new Score(this)
		this.addComponent(new GameFlag())
		this.addComponent(new Timer(3))
		this.startCounter = new ui.UICounter(3, '-50%', '50%', Color4.Red(), 70, true)
		this.startCounter.uiText.visible = false
		
		this.starter = new Entity()
		this.starter.addComponent(new BoxShape())
		this.starter.addComponent(new Transform({position: new Vector3(12,0.75,12), scale:new Vector3(0.25,1,0.25)}))
		this.starter.addComponent(
			new OnPointerDown((e) => {
				this.start()
				this.startCounter.uiText.visible = true
			},{hoverText: "Play"})
		)
		engine.addEntity(this.starter)
	}
	
	touchable(random: number){
		if(random === 0){
			return false
		} else {
			return true
		}
	}
	
	start(){
		if(this.player === undefined){
			this.player = new Player(this,this.canvas)
		}
		this.starter.addComponent(
			new utils.Delay(3000, () => {
				this.started = true
				this.addComponent(
					new utils.Interval(1000, () => {
						const randomPos = Math.floor(Math.random() * Math.floor(6));
						const randomTouchy = Math.floor(Math.random() * Math.floor(5));
						const touchable = this.touchable(randomTouchy)
						log('touchable : ',touchable)
						const target = new Target(this,randomPos,touchable,1)
						this.targets.push(target)
					})
				)
			})
		)
		
		this.player.start()
		this.system = new GameSystem(this)
		engine.addSystem(this.system)
		this.canvas.visible = true
	}
	
	stop(){
		ui.displayAnnouncement('Your score is : '+this.score.score+' points', 5, true, Color4.Red(), 50, true)
		this.player.stop()
		this.starter.getComponent(BoxShape).visible = true
		this.started = false
		this.canvas.visible = false
		this.removeComponent(utils.Interval)
		engine.removeSystem(this.system)
		this.score.resetScore()
	}
}

export class GameSystem implements ISystem {
	game: Game

	constructor(game) {
		this.game = game
	}
	update(dt: number) {
		if(this.game.started === true && this.game.starter.getComponent(BoxShape).isPointerBlocker == true){
			this.game.starter.getComponent(BoxShape).visible = false
		}
		if(this.game.player.life <= 0 && this.game.started === true){
			this.game.stop()
		}
		if(this.game.startCounter.uiText.visible === true){
			let timer = this.game.getComponent(Timer)
			if(timer.timeLeft > 0 && timer.timeLeft !== dt){
				timer.timeLeft -= dt
				if(Math.ceil(timer.timeLeft) !== this.game.startCounter.read()){
					this.game.startCounter.decrease(Math.ceil(dt))
				}
			} else {
				timer.timeLeft = timer.totalTime
				this.game.startCounter.set(timer.totalTime)
				this.game.startCounter.uiText.visible = false
			}
		}
	}
}

const game = new Game()

const wall = new Entity()
engine.addEntity(wall)
wall.setParent(game)
wall.addComponent(new Transform({position: new Vector3(0,4,5), scale: new Vector3(16,6,1)}))
wall.addComponent(new PlaneShape())
wall.getComponent(PlaneShape).visible = false
wall.getComponent(PlaneShape).isPointerBlocker = false
