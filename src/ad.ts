
export class Advertisement extends Entity {
	name: string
	
	constructor(parent:Entity, name:string){
		super()
		this.setParent(parent)
		engine.addEntity(this)
		this.name = name
		if(this.name == 'ad1'){
			this.addComponent(new Transform({position: new Vector3(-7.9,11.32,10.43)}))
			this.getComponent(Transform).scale.set(10, 7, 1)
			this.getComponent(Transform).rotation.setEuler(0, 90, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		} else if (this.name == 'ad2'){
			this.addComponent(new Transform({position: new Vector3(-7.9,11.32,-0.05)}))
			this.getComponent(Transform).scale.set(10, 7, 1)
			this.getComponent(Transform).rotation.setEuler(0, 90, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		}else if (this.name == 'ad3'){
			this.addComponent(new Transform({position: new Vector3(-7.9,11.32,-10.5)}))
			this.getComponent(Transform).scale.set(10, 7, 1)
			this.getComponent(Transform).rotation.setEuler(0, 90, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		}else if (this.name == 'ad4'){
			this.addComponent(new Transform({position: new Vector3(7.9,11.32,10.43)}))
			this.getComponent(Transform).scale.set(10, 7, 1)
			this.getComponent(Transform).rotation.setEuler(0, 270, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		}else if (this.name == 'ad5'){
			this.addComponent(new Transform({position: new Vector3(7.9,11.32,-0.05)}))
			this.getComponent(Transform).scale.set(10, 7, 1)
			this.getComponent(Transform).rotation.setEuler(0, 270, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		}else if (this.name == 'ad6'){
			this.addComponent(new Transform({position: new Vector3(7.9,11.32,-10.5)}))
			this.getComponent(Transform).scale.set(10, 7, 1)
			this.getComponent(Transform).rotation.setEuler(0, 270, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		}else if (this.name == 'ad7'){
			this.addComponent(new Transform({position: new Vector3(0,13.75,15.9)}))
			this.getComponent(Transform).scale.set(14.8, 16.95, 1)
			this.getComponent(Transform).rotation.setEuler(0, 180, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		}else if (this.name == 'ad8'){
			this.addComponent(new Transform({position: new Vector3(0,13.75,-15.95)}))
			this.getComponent(Transform).scale.set(14.8, 16.95, 1)
			this.getComponent(Transform).rotation.setEuler(0, 0, 180)
			this.addComponent(new PlaneShape())
			const textureAd = new Texture('images/ads/'+this.name+'.jpg')
			const materialAd = new Material()
			materialAd.albedoTexture = textureAd
			this.addComponent(materialAd)
		}		
	}
}