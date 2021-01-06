import utils from 'node_modules/decentraland-ecs-utils/index'

export class Highscore extends Entity {
	score: number
	displayedScore: TextShape
	
	constructor(){
		super()
		engine.addEntity(this)
		this.score = 0
		// this.addComponent(new PlaneShape())
		this.addComponent(new Transform({position: new Vector3(8,5,31.5), scale: new Vector3(1,1,1)}))
		this.displayedScore = new TextShape(this.score.toString())
		this.displayedScore.color = Color3.Red()
		this.displayedScore.fontSize = 30
		this.addComponent(this.displayedScore)
	}
	
	addScore(value: number){
		this.score += value
		this.displayedScore.value = this.score.toString()
	}
	
	resetScore(){
		this.score = 0
		this.displayedScore.value = this.score.toString()
	}
}