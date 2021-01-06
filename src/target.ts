import utils from 'node_modules/decentraland-ecs-utils/index'
import { Game } from './game'

export class Target extends Entity {
	speed: number
	valueScore: number
	touchable: boolean
	game: Game
	
	constructor(game: any, originSide: number,value:number){
		super()
		engine.addEntity(this)
		this.game = game
		this.valueScore = value
		if(originSide < 5){
			const StartPos = new Vector3(0,1,30)
			const EndPos = new Vector3(15.5,1,30)
			this.addComponent(new Transform({position: new Vector3(0.5,1,30), scale: new Vector3(1,2,0.2)}))
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
		} else {
			const StartPos = new Vector3(15.5,1,30)
			const EndPos = new Vector3(0,1,30)
			this.addComponent(new Transform({position: new Vector3(15.5,1,30), scale: new Vector3(1,2,0.2)}))	
			this.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 3))
		}
		
		this.addComponent(
			new OnPointerDown((e) => {
				log("myEntity was clicked", e)
				this.game.score.addScore(this.valueScore)
				this.removeComponent(utils.Delay)
				engine.removeEntity(this)
			}, {distance: 35})
		)
		this.addComponent(new BoxShape())
		this.addComponent(new utils.Delay(3000, () =>{
			log('perdu')
			engine.removeEntity(this)
			this.game.player.removeLife()
		}))
	}
}