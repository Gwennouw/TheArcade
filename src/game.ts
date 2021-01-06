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
	decors: GLTFShape
	starter: Entity
	difficultyRate: number
	started: boolean = false
	system: ISystem
	
	constructor(){
		super()
		engine.addEntity(this)
		this.targets = []
		this.score = new Score()
		this.addComponent(new GameFlag())
		this.starter = new Entity()
		this.starter.addComponent(new BoxShape())
		this.starter.addComponent(new Transform({position: new Vector3(5,0.5,5), scale:new Vector3(0.25,1,0.25)}))
		this.starter.addComponent(
			new OnPointerDown((e) => {
				log("myEntity was clicked", e)
				this.start()
			})
		)
		engine.addEntity(this.starter)
	}

	start(){
		this.started = true
		this.addComponent(
			new utils.Interval(3000, () => {
				const random = Math.floor(Math.random() * Math.floor(10));
				log('random : ',random)
				const target = new Target(this,random,1)
				this.targets.push(target)
			})
		)
		this.player = new Player()
		this.system = new GameSystem(this)
		engine.addSystem(this.system)
	}
	stop(){
		engine.removeEntity(this.player)
		// this.removeComponent(utils.Interval)
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
	 // && this.game !== undefined
		if(this.game.player.life <= 0 && this.game.started == true){
			this.game.removeComponent(utils.Interval)
			this.game.stop()
		}
	}
}

const game = new Game()