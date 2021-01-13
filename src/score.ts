import utils from 'node_modules/decentraland-ecs-utils/index'

export class Score extends Entity {
	score: number
	displayedScore: TextShape
	
	constructor(game: Entity){
		super()
		engine.addEntity(this)
		this.setParent(game)
		this.score = 0
		// this.addComponent(new PlaneShape())
		this.addComponent(new Transform({position: new Vector3(-5.35,6.25,-4), scale: new Vector3(1,1,1), rotation: Quaternion.Euler(0, 180, 0)}))
		// this.getComponent(Transform).rotation.eulerAngles = new Vector3(0,180,0)
		this.displayedScore = new TextShape(this.score.toString())
		this.displayedScore.color = Color3.Red()
		this.displayedScore.fontSize = 10
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