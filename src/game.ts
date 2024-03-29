import * as utils from '@dcl/ecs-scene-utils'
import { Target } from './target'
import { Score } from './score'
import { Player } from './player'
import { Advertisement } from './ad'
import * as ui from '@dcl/ui-scene-utils'
import { buildLeaderBoard } from './leaderBoard'
import { publishScore, getScoreBoard, getAds } from './serverHandler'

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
	timeToStart: number
	
	constructor(){
		super()
		engine.addEntity(this)
		this.canvas = new UICanvas()
		this.targets = []
		this.difficultyRate = 1
		this.timeToStart = 5
		this.decor = new GLTFShape('models/base.glb')
		this.addComponent(this.decor)
		this.addComponent(new Transform({position: new Vector3(16,0,8), rotation: new Quaternion(0,1,0,-1)}))
		this.score = new Score(this)
		this.addComponent(new GameFlag())
		this.addComponent(new Timer(this.timeToStart))
		this.startCounter = new ui.UICounter(this.timeToStart, -(1300/2), (600/2), Color4.Red(), 70, true)
		this.startCounter.uiText.visible = false
		
		this.starter = new Entity()
		this.starter.addComponent(new GLTFShape('models/start.glb'))
		this.starter.addComponent(new Transform({position: new Vector3(12,1,8), scale:new Vector3(0.25,0.25,0.25)}))
		this.starter.addComponent(
			new OnPointerDown((e) => {
				this.start()
				this.starter.getComponent(GLTFShape).visible = false
				this.startCounter.uiText.visible = true
			},{hoverText: "Play"})
		)
		this.starter.addComponent(new Animator())
		const clipArrow = new AnimationState("arrow")
		this.starter.getComponent(Animator).addClip(clipArrow)
		clipArrow.looping = true
		clipArrow.play()
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
			new utils.Delay(this.timeToStart * 1000, () => {
				this.started = true
				this.addComponent(
					new utils.Interval(1000, () => {
						const randomPos = Math.floor(Math.random() * Math.floor(6));
						const randomTouchy = Math.floor(Math.random() * Math.floor(5));
						const touchable = this.touchable(randomTouchy)
						// log('touchable : ',touchable)
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
		this.started = false
		ui.displayAnnouncement('Your score is : '+this.score.score+' points', 5, Color4.Red(), 50, true)
		this.player.stop()
		publishScore(this.score.score)
		this.addComponent(
			new utils.Delay(3000, () => {
				updateBoard()
			})
		)
		this.starter.getComponent(GLTFShape).visible = true
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
const triggerTarget1 = new Target(game,0,true,1,true)
const triggerTarget2 = new Target(game,0,false,1,true)
triggerTarget1.getComponent(GLTFShape).visible = false
triggerTarget2.getComponent(GLTFShape).visible = false

const wall = new Entity()
engine.addEntity(wall)
wall.setParent(game)
wall.addComponent(new Transform({position: new Vector3(0,4,5), scale: new Vector3(16,6,1)}))
wall.addComponent(new PlaneShape())
wall.getComponent(PlaneShape).visible = false
wall.getComponent(PlaneShape).isPointerBlocker = false


// reference position for the leader board
const boardParent = new Entity()
boardParent.addComponent(
  new Transform(
    new Transform({
      position: new Vector3(13, 4, 0.5),
      rotation: Quaternion.Euler(0, 180, 0),
    })
  )
)
engine.addEntity(boardParent)

async function updateBoard() {
  let scoreData: any = await getScoreBoard() // data.scoreBoard
  buildLeaderBoard(scoreData, boardParent, 10)
}
async function updateAds() {
	let adData: any = []
	// executeTask(async () => {
		adData = await getAds()
		// log('adData[1]',await adData[1])
		// log('adData[2]',await adData[2])
	// })
		const ad1 = new Advertisement(game,'ad1',adData[0])
		const ad2 = new Advertisement(game,'ad2',adData[1])
		const ad3 = new Advertisement(game,'ad3',adData[2])
		const ad4 = new Advertisement(game,'ad4',adData[3])
		const ad5 = new Advertisement(game,'ad5',adData[4])
		const ad6 = new Advertisement(game,'ad6',adData[5])
		const ad7 = new Advertisement(game,'ad7',adData[6])
		const ad8 = new Advertisement(game,'ad8',adData[7])
}

updateAds()
updateBoard()

const streamSource = new Entity()
engine.addEntity(streamSource)
const webRadio = new AudioStream(
	"https://radio.nia.nc/radio/8020/lofi-hq-stream.aac"
)
webRadio.volume = 0.1

streamSource.addComponent(webRadio)