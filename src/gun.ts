import utils from 'node_modules/decentraland-ecs-utils/index'
import { Player } from './player'

export class Gun extends Entity {
	gunSystem: ISystem
	gunShoot: AnimationState
	gunLoad: AnimationState
	player: Player
	
	constructor(player: Player){
		super()
		engine.addEntity(this)
		
		// Initialization
		this.player = player
		this.gunSystem = new GunSystem(this.player)
		this.addComponent(new GLTFShape('models/weapon.glb'))
		
		this.addComponent(new Animator())
		this.gunShoot = new AnimationState('weaponshoot')
		this.gunLoad = new AnimationState('weaponload')
		this.gunShoot.looping = false
		this.gunLoad.looping = false
		this.gunShoot.stop()
		this.gunLoad.stop()
		this.gunShoot.reset()
		this.gunLoad.reset()
		this.getComponent(Animator).addClip(this.gunShoot)
		this.getComponent(Animator).addClip(this.gunLoad)
		
		const gunPos = new Vector3((this.player.camera.position.x+0.5),(this.player.camera.position.y-0.5),(this.player.camera.position.z+0.5))
		// const gunRot = new Quaternion((this.player.camera.position.x),(this.player.camera.position.y),(this.player.camera.position.z),(this.player.camera.position.w))
		this.addComponent(new Transform({position: gunPos, rotation: new Quaternion(0,1,0,1)}))
		engine.addEntity(this)
	}
	
	start(){
		engine.addSystem(this.gunSystem)
	}
	
	stop(){
		engine.removeSystem(this.gunSystem)
	}
}


class GunSystem implements ISystem {
	player: Player

	constructor(player) {
		this.player = player
	}
	
	update(dt: number) {
		const gunPos = new Vector3((this.player.camera.position.x+(0.5*Math.sin(this.player.camera.rotation.eulerAngles.x*(180/Math.PI)))),(this.player.camera.position.y-0.5),(this.player.camera.position.z+(0.5*Math.cos(this.player.camera.rotation.eulerAngles.z*(180/Math.PI)))))
		if(this.player.gun.getComponent(Transform).position !== gunPos){
			log('player pos : ',this.player.camera.position)
			log('gun pos : ',gunPos)
			this.player.gun.getComponent(Transform).position = gunPos
		}
		
		const gunRot = new Vector3((this.player.camera.rotation.eulerAngles.x),(this.player.camera.rotation.eulerAngles.y-90),(this.player.camera.rotation.eulerAngles.z))
		if(this.player.gun.getComponent(Transform).rotation.eulerAngles !== gunRot){
			log('player rot : ',this.player.camera.rotation.eulerAngles)
			log('gun rot : ',gunRot)
			this.player.gun.getComponent(Transform).rotation.eulerAngles = gunRot
		}
	}
}