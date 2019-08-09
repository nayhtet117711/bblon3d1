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

	draw = (callback) => {
		this.initScene(() => this.createScene(callback))

		this.engine.runRenderLoop(() => {
			this.scene.render();
		});

		window.addEventListener('resize', () => {
			this.engine.resize();
		});

	}

	initScene = (callback) => {
		// this.scene = null
		this.scene = new BABYLON.Scene(this.engine);

		// this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 45, BABYLON.Vector3.Zero(), this.scene, true);
		this.camera = new BABYLON.ArcRotateCamera("camera", -1.2, 1.2, 30, BABYLON.Vector3.Zero(), this.scene, true);
		this.camera.setTarget(BABYLON.Vector3.Zero());
		this.camera.attachControl(this.canvas, true);
		this.camera.lowerAlphaLimit = -1.7
		this.camera.upperAlphaLimit = 1.3
		this.camera.lowerBetaLimit = 0.7
		this.camera.upperBetaLimit = 1.3
		this.camera.panningSensibility = 120
		this.camera.upperRadiusLimit = 100
		this.camera.lowerRadiusLimit = 10

		//HemisphericLight
		this.light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-10, -30, -10), this.scene);
		this.light.diffuseColor = new BABYLON.Color3(1, 1, 1);
		this.light.autoUpdateExtends = true;

		this.material0 = new BABYLON.StandardMaterial("material0", this.scene);
		// this.material0.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4)
		this.material0.diffuseTexture = new BABYLON.Texture("img-material/ground2.jpg", this.scene)

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

		this.ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 80, height: 40, subdivisions: 1, updatable: true }, this.scene);
		this.ground.receiveShadows = true;
		this.ground.material = this.material0;

		this.loadMeshes(callback)

	}

	loadMeshes = (callback) => {
		BABYLON.SceneLoader.ImportMesh("", "./mesh-obj/", "Chiller1.obj", this.scene, meshes => {
			this.meshChiller = BABYLON.Mesh.MergeMeshes(meshes)
			this.meshChiller.visibility = 0
			BABYLON.SceneLoader.ImportMesh("", "./mesh-obj/", "Pump1.obj", this.scene, meshes => {
				this.meshPump = BABYLON.Mesh.MergeMeshes(meshes)
				this.meshPump.visibility = 0
				BABYLON.SceneLoader.ImportMesh("", "./mesh-obj/", "Building1.obj", this.scene, meshes => {
					this.meshOffice = BABYLON.Mesh.MergeMeshes(meshes)
					this.meshOffice.visibility = 0
					callback()
				});
			});
		});
	}

	createScene = (callback) => {
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
		callback()

	}

	drawChiller = ({ name, posX, posZ }) => {
		if (this.meshOffice) {
			const sphere = this.meshChiller.clone();
			sphere.id = `chiller-${name}`
			sphere.visibility = 1;
			sphere.position.x = posX + 0.3
			sphere.position.y = 2
			sphere.position.z = posZ
			sphere.material = this.material1
			sphere.rotation.y = Math.PI

			sphere.actionManager = new BABYLON.ActionManager(this.scene)
			sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
				BABYLON.ActionManager.OnPickUpTrigger,
				e => {
					//alert("Click on " + name)
				}
			));

			this.drawTextPlane({ name:"Efficiency: 128.3",  posX, posY: 1, posZ })
			this.drawTextPlane({ name:"Power: 128 kW", posX, posY: 2, posZ })
			this.drawTextPlane({ name:"Power Consumption: 128 kW", posX, posY: 3, posZ })
			this.drawTextPlane({ name:"Input Temperature: 18 \u{2103}",  posX, posY: 4, posZ })
			this.drawTextPlane({ name:"Output Temperature: 18 \u{2103}",  posX, posY: 5, posZ })

		}
	}

	drawOffice = ({ name, posX, posZ }) => {
		if (this.meshOffice) {
			const sphere = this.meshOffice.clone()
			sphere.visibility = 1
			sphere.position.x = posX
			sphere.position.y = 1.6
			sphere.position.z = posZ
			sphere.rotation.y = Math.PI / 2
			sphere.material = this.material1
			sphere.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2)
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
			sphere.scaling = new BABYLON.Vector3(0.9, 0.9, 0.9)
		}
	}

	drawTextPlane = ({ name, posX, posY, posZ }) => {
		const outputplane = BABYLON.MeshBuilder.CreatePlane("outputplane", { width: 6, height: 1 }, this.scene);
		outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
		outputplane.material = new BABYLON.StandardMaterial("planematerial", this.scene);
		outputplane.position = new BABYLON.Vector3(posX, 3.6+posY, posZ+2);

		const outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", { width: 1200, height: 200 }, this.scene, false);
		outputplane.material.diffuseTexture = outputplaneTexture;
		outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
		outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
		outputplane.material.backFaceCulling = true;

		outputplaneTexture.drawText(name, 30, null, "bold 70px Arial", "#e5eee5", "#226733", true);
		// const ctx = outputplaneTexture.getContext()
		// outputplaneTexture.update()
	}

	drawPath = (path) => {
		const pathPin = path.points.pin.reduce((r, c, i, arr) => {
			if (i === 0) return [...r, c]
			else {
				const p1 = arr[i - 1]
				const p2 = c
				const ci = p1.reduce((r1, c1, i1) => c1 !== p2[i1] ? i1 : r1, -1) // find the index of difference point
				if (ci < 0) return [...r, c]
				else {
					const div = p2[ci] - p1[ci] < 0 ? -0.1 : 0.1
					const anp1 = [...p1]
					anp1[ci] = p1[ci] + div
					const anp2 = [...p2]
					anp2[ci] = p2[ci] - div
					return [...r, anp1, anp2, c]
				}
			}
		}, [])
		const pathPout = path.points.pout.reduce((r, c, i, arr) => {
			if (i === 0) return [...r, c]
			else {
				const p1 = arr[i - 1]
				const p2 = c
				const ci = p1.reduce((r1, c1, i1) => c1 !== p2[i1] ? i1 : r1, -1) // find the index of difference point
				if (ci < 0) return [...r, c]
				else {
					const div = p2[ci] - p1[ci] < 0 ? -0.1 : 0.1
					const anp1 = [...p1]
					anp1[ci] = p1[ci] + div
					const anp2 = [...p2]
					anp2[ci] = p2[ci] - div
					return [...r, anp1, anp2, c]
				}
			}
		}, [])
		// console.log({ path: path.points.pin, pathh })
		const vector3PointInList = pathPin.map(p => new BABYLON.Vector3(p[0], p[1], p[2]))
		const vector3PointOutList = pathPout.map(p => new BABYLON.Vector3(p[0], p[1], p[2]))

		const tubeIn = BABYLON.MeshBuilder.CreateTube(`pip-in-${path.name}`, { path: vector3PointInList, radius: 0.25, updatable: false, invertUV: true, }, this.scene);
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