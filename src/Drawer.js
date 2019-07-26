import * as BABYLON from "babylonjs"
import { STLFileLoader } from 'babylonjs-loaders';

export default class Drawer {
	constructor(props) {
		const {
			canvasId,
			chillerList,
			officeList,
			pumpList,
			pathList,
		} = props
		this.scene = null;
		this.material0 = null;
		this.material1 = null;
		this.material2 = null;
		this.chillerList = chillerList;
		this.pumpList = pumpList;
		this.condenserList = null;
		this.officeList = officeList;
		this.pathList = pathList;
		this.canvas = document.getElementById(canvasId)
		this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true })
		this.meshOffice = null;
		this.meshPump = null;
		this.meshChiller = null;
	}

	draw = () => {
		this.initScene(this.createScene)

		this.engine.runRenderLoop(() => {
			this.scene.render();
		});

		window.addEventListener('resize', () => {
			this.engine.resize();
		});

	}

	initScene = (callback) => {
		this.scene = null
		this.scene = new BABYLON.Scene(this.engine);

		// this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 45, BABYLON.Vector3.Zero(), this.scene, true);
		this.camera = new BABYLON.ArcRotateCamera("camera", -0.78, 0.9, 30, BABYLON.Vector3.Zero(), this.scene, true);
		this.camera.setTarget(BABYLON.Vector3.Zero());
		this.camera.attachControl(this.canvas, true);

		//
		//HemisphericLight
		this.light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-10, -30, -10), this.scene);
		this.light.diffuseColor = new BABYLON.Color3(1, 1, 1);
		this.light.autoUpdateExtends = true;

		this.material0 = new BABYLON.StandardMaterial("material0", this.scene);
		this.material0.diffuseTexture = new BABYLON.Texture("ground2.jpg", this.scene)

		this.material1 = new BABYLON.StandardMaterial("material1", this.scene);
		// this.material1.diffuseTexture = new BABYLON.Texture("earchsurfac.jpg", this.scene)
		this.material1.diffuseColor = new BABYLON.Color3(0.7, 0.78, 1)

		this.material2 = new BABYLON.StandardMaterial("material2", this.scene);
		// this.material2.diffuseTexture = new BABYLON.Texture("oceansurfac.jpeg", this.scene)
		this.material2.diffuseColor = new BABYLON.Color3(0.92, 0.9, 0.6)
		this.material2.wireframe = false
		this.material2.alpha = 1
		this.material2.backFaceCulling = false

		this.material22 = new BABYLON.StandardMaterial("material22", this.scene);
		this.material22.diffuseColor = new BABYLON.Color3(0.6, 0.9, 0.6)
		this.material22.wireframe = false
		this.material22.alpha = 1
		this.material22.backFaceCulling = false

		this.ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 60, height: 60, subdivisions: 100, updatable: true }, this.scene);
		this.ground.receiveShadows = true;
		this.ground.material = this.material0;

		this.loadMeshes(callback)
	}

	loadMeshes = (callback) => {
		BABYLON.SceneLoader.ImportMesh("", "./", "Chiller1.obj", this.scene, meshes => {
			this.meshChiller = BABYLON.Mesh.MergeMeshes(meshes)
			this.meshChiller.visibility = 0
			BABYLON.SceneLoader.ImportMesh("", "./", "Pump1.obj", this.scene, meshes => {
				this.meshPump = BABYLON.Mesh.MergeMeshes(meshes)
				this.meshPump.visibility = 0
				BABYLON.SceneLoader.ImportMesh("", "./", "Building1.obj", this.scene, meshes => {
					this.meshOffice = BABYLON.Mesh.MergeMeshes(meshes)
					this.meshOffice.visibility = 0
					callback()
				});
			});
		});
	}

	createScene = () => {
		this.chillerList.forEach(chiller => {
			this.drawChiller({ name: chiller[0], posX: chiller[1], posZ: chiller[2] })
		});
		this.officeList.forEach(office => {
			this.drawOffice({ name: office[0], posX: office[1], posZ: office[2] })
		});
		this.pumpList.forEach(pump => {
			this.drawPump({ name: pump[0], posX: pump[1], posZ: pump[2] })
		});
		this.pathList.forEach(path => {
			this.drawPath(path)
		});

	}

	drawChiller = ({ name, posX, posZ }) => {
		//const sphere = BABYLON.MeshBuilder.CreateSphere(name, { diameter: 2.4 }, this.scene)

		if (this.meshOffice) {
			const sphere = this.meshChiller.clone();
			sphere.id = `chiller-${name}`
			sphere.visibility = 1;
			sphere.position.x = posX+0.3
			sphere.position.y = 2
			sphere.position.z = posZ
			sphere.material = this.material1
			sphere.rotation.y = Math.PI

			sphere.actionManager = new BABYLON.ActionManager(this.scene)
			sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
				BABYLON.ActionManager.OnPickDownTrigger,
				e => {
					alert("Click on earth.")
				}
			));
		}
	}

	drawOffice = ({ name, posX, posZ }) => {
		// const sphere = BABYLON.MeshBuilder.CreateSphere(name, { diameter: 3 }, this.scene)
		if (this.meshOffice) {
			const sphere = this.meshOffice.clone()
			sphere.visibility = 1
			sphere.position.x = posX
			sphere.position.y = 1.6
			sphere.position.z = posZ
			sphere.rotation.y = Math.PI/2
			sphere.material = this.material1
			sphere.scaling = new BABYLON.Vector3(1.2,1.2,1.2)
		}
	}

	drawPump = ({ name, posX, posZ }) => {
		//const sphere = BABYLON.MeshBuilder.CreateSphere(name, { diameter: 1.8 }, this.scene)
		if (this.meshPump) {
			const sphere = this.meshPump.clone();
			sphere.id = `pump-${name}`
			sphere.visibility = 1
			sphere.position.x = posX
			sphere.position.y = 2
			sphere.position.z = posZ
			sphere.material = this.material1
			sphere.scaling = new BABYLON.Vector3(0.9,0.9,0.9)
		}
	}

	drawPath = (path) => {
		const vector3PointInList = path.points.pin.map(p => new BABYLON.Vector3(p[0], p[1], p[2]))
		const vector3PointOutList = path.points.pout.map(p => new BABYLON.Vector3(p[0], p[1], p[2]))

		const tubeIn = BABYLON.MeshBuilder.CreateTube(`pip-in-${path.name}`, { path: vector3PointInList, radius: 0.25, updatable: false, invertUV: true,}, this.scene);
		tubeIn.material = this.material2

		const tubeOut = BABYLON.MeshBuilder.CreateTube(`pip-out-${path.name}`, { path: vector3PointOutList, radius: 0.25, updatable: true, invertUV: true }, this.scene);
		tubeOut.material = this.material22
	}

	changeEarthMaterial = () => {
		const ids = this.scene.meshes.map(v => v.id)
		console.log({ ids })
		// if (this.material1.diffuseTexture.name === "earchsurfac.jpg")
		// 	this.material1.diffuseTexture = new BABYLON.Texture("wartersurfac.jpg", this.scene)
		// else
		// 	this.material1.diffuseTexture = new BABYLON.Texture("earchsurfac.jpg", this.scene)
	}

	changePipeMaterial = () => {
		// if (this.material2.diffuseTexture.name === "oceansurfac.jpeg")
		// 	this.material2.diffuseTexture = new BABYLON.Texture("oceansurfac.jpg", this.scene)
		// else
		// 	this.material2.diffuseTexture = new BABYLON.Texture("oceansurfac.jpeg", this.scene)

		//this.material2.diffuseColor = new BABYLON.Color3(0.6, 0.9, 0.6)
	}

}