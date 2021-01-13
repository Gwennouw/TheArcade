import utils from "../node_modules/decentraland-ecs-utils/index"
import { Target } from './target'
import { Score } from './score'
import { Player } from './player'

@Component('gameFlag')
export class GameFlag {}

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
		
		this.starter = new Entity()
		// this.starter.setParent(this)
		this.starter.addComponent(new BoxShape())
		this.starter.addComponent(new Transform({position: new Vector3(12,0.75,12), scale:new Vector3(0.25,1,0.25)}))
		this.starter.addComponent(
			new OnPointerDown((e) => {
				this.start()
			},{hoverText: "Play"})
		)
		engine.addEntity(this.starter)
		if(this.player === undefined){
			this.player = new Player(this,this.canvas)
		}
		this.player.start()
	}

	start(){
		this.started = true
		this.addComponent(
			new utils.Interval(1000, () => {
				const random = Math.floor(Math.random() * Math.floor(6));
				const target = new Target(this,random,1)
				this.targets.push(target)
			})
		)
		if(this.player === undefined){
			this.player = new Player(this,this.canvas)
		}
		this.player.start()
		this.system = new GameSystem(this)
		engine.addSystem(this.system)
		this.canvas.visible = true
	}
	
	stop(){
		this.player.stop()
		this.starter.getComponent(BoxShape).visible = true
		this.canvas.visible = false
		this.removeComponent(utils.Interval)
		engine.removeSystem(this.system)
		this.started = false
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
			// log('this.game.starter.getComponent(BoxShape).visible : ',this.game.starter.getComponent(BoxShape).visible)
			// this.game.starter.getComponent(BoxShape).isPointerBlocker = false
			this.game.starter.getComponent(BoxShape).visible = false
		}
		if(this.game.player.life <= 0 && this.game.started === true){
			this.game.stop()
			// if(this.game.starter)
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
