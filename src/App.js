import React, { Component } from "react";
import * as BABYLON from "babylonjs"

export default class App extends Component {

	constructor() {
		super()
		this.state = {
			drawer : null
		}
	}

	componentDidMount() {
		this.setState({ drawer: new Drawer("canvasId125") }, () => {
			this.state.drawer.draw()
		})
		
	}

	_clickChangedPipeColor = () => {
		this.state.drawer.changePipeMaterial()
	}

	_clickChangedEarthColor = () => {
		this.state.drawer.changeEarthMaterial()
	}

	render() {
		return (
			<div style={{ padding: 0, height: "96vh" }}>
				<canvas style={{ width: "100%", height: "100%" }} id="canvasId125"></canvas>
				<div style={{ position: "absolute", left: 0, top: 0, border: "1px solid grey", backgroundColor: "#ffffff55", padding: "8px 16px" }}>
					<button style={{ margin: 8 }} onClick={this._clickChangedPipeColor}>Change Pipe Surface</button>
					<button style={{ margin: 8 }} onClick={this._clickChangedEarthColor}>Change Earth Surface</button>
				</div>
			</div>
		);
	}

}

class Drawer {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId)
		this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true })
		this.scene = null;

		this.material0 = null; 
		this.material1 = null; 
		this.material2 = null; 
	}

	draw = () => {
		this.scene = null
		this.scene = this.createScene(this.canvas, this.engine)
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
		window.addEventListener('resize', () => {
			this.engine.resize();
		});
	}

	changeEarthMaterial = () => {
		if(this.material1.diffuseTexture.name==="earchsurfac.jpg")
			this.material1.diffuseTexture = new BABYLON.Texture("wartersurfac.jpg", this.scene)
		else 
			this.material1.diffuseTexture = new BABYLON.Texture("earchsurfac.jpg", this.scene)
	}

	changePipeMaterial = () => {
		if(this.material2.diffuseTexture.name==="oceansurfac.jpeg")
			this.material2.diffuseTexture = new BABYLON.Texture("oceansurfac.jpg", this.scene)
		else 
			this.material2.diffuseTexture = new BABYLON.Texture("oceansurfac.jpeg", this.scene)
	}

	createScene = (canvas, engine) => {
		const scene = new BABYLON.Scene(engine);
		// Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
		//const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
		const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 20, BABYLON.Vector3.Zero(), scene, true);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, true);

		const light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -10, 9), scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);
		// light.specular = new BABYLON.Color3(0.8, 0.7, 0.6);
		light.autoUpdateExtends = true;

		const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
		shadowGenerator.useBlurExponentialShadowMap = true;
		shadowGenerator.frustumEdgeFalloff = 1.0;
		shadowGenerator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

		this.material0 = new BABYLON.StandardMaterial("material", this.scene);
		this.material0.diffuseTexture = new BABYLON.Texture("space1.jpg", this.scene)

		this.material1 = new BABYLON.StandardMaterial("material", this.scene);
		this.material1.diffuseTexture = new BABYLON.Texture("earchsurfac.jpg", this.scene)

		this.material2 = new BABYLON.StandardMaterial("material", this.scene);
		this.material2.diffuseTexture = new BABYLON.Texture("oceansurfac.jpeg", this.scene)

		//sphere1
		this.drawShape(scene, { posX: 0, posY: 2, posZ: 0, shadow: shadowGenerator })
		//sphere2
		this.drawShape(scene, { posX: -8, posY: 2, posZ: 0, shadow: shadowGenerator })
		//sphere3
		this.drawShape(scene, { posX: 8, posY: 2, posZ: 0, shadow: shadowGenerator })
		//sphere4
		this.drawShape(scene, { posX: 0, posY: 2, posZ: 8, shadow: shadowGenerator })
		//sphere5
		this.drawShape(scene, { posX: 0, posY: 2, posZ: -8, shadow: shadowGenerator })

		this.drawTubes(scene);

		const ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 60, height: 60, subdivisions: 60, updatable: true}, scene);
		ground.receiveShadows = true;
		ground.material = this.material0;

		return scene;
	}

	drawShape = (scene, { posX, posY, posZ, shadow }) => {
		const sphere = BABYLON.MeshBuilder.CreateSphere(`sphere_${Math.random()*10000}`, { diameter: 2 }, scene)
		sphere.position.x = posX
		sphere.position.y = posY
		sphere.position.z = posZ
		sphere.material = this.material1

		if(shadow) {
			shadow.getShadowMap().renderList.push(sphere)
		}

		sphere.actionManager = new BABYLON.ActionManager(scene)
		sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnPickDownTrigger, 
			e => {
                alert("Click on earth.")
            }
        ));
	}

	drawTubes = (scene) => {
		const pCenterLeft = [new BABYLON.Vector3(0, 2, 0), new BABYLON.Vector3(-8, 2, 0)]
		this.createTube(scene, pCenterLeft)

		const pCenterRight = [new BABYLON.Vector3(0, 2, 0), new BABYLON.Vector3(8, 2, 0)]
		this.createTube(scene, pCenterRight)

		const pCenterFront = [new BABYLON.Vector3(0, 2, 0), new BABYLON.Vector3(0, 2, -8)]
		this.createTube(scene, pCenterFront)

		const pCenterBack = [new BABYLON.Vector3(0, 2, 0), new BABYLON.Vector3(0, 2, 8)]
		this.createTube(scene, pCenterBack)
	}

	createTube = (scene, points) => {
		const tube = BABYLON.MeshBuilder.CreateTube("tube", { path: points, radius: 0.1, updatable: true, invertUV: true }, scene);	
		tube.material = this.material2
		
	}

}