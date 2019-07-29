import React, { Component } from "react";
import Drawer from "./Drawer"

export default class App extends Component {

	constructor() {
		super()
		this.state = {
			loading3DMap: true,
			drawer : null, 
			chillerList : [ 
				["chiller1", 2, 8], ["chiller2", -6, 8], ["chiller3", -14, 8],
			],
			officeList: [
				["office", 14, 2]
			],
			pumpList: [
				["pump1", 2, -4], ["pump2", -6, -4], ["pump3", -14, -4]
			], 
			pathList: [
				{
					chiller: "chiller1",
					points: {
						pin: [ 
							// [14, 2.4, 2], [14, 2.4, -1.1], [14, 2.4, -1], [14, 2.4, -1], [14, 2.4, -1], [2, 2.4, -1], [2, 2.4, -3], 
							[14, 2.4, 2], [14, 2.4, -1], [2, 2.4, -1], [2, 2.4, -3], 
							[2+0.3, 2.4, -3.4], [2+0.3, 5, -3.4], [2+0.3, 5, 5], [2+0.3, 2, 5], [2+0.3, 2, 8], 
						], //in
						pout: [ [0.9, 2, 8], [0.9, 2, 3], [14, 2, 3],  ] //out
					}
				},
				{
					name: "chiller2",
					points: {
						pin: [ 
							[14, 2.4, 2], [14, 2.4, -1], [-6, 2.4, -1], [-6, 2.4, -3], 
							[-5.7, 2.4, -3.4], [-5.7, 5, -3.4], [-5.7, 5, 5], [-5.7, 2, 5], [-5.7, 2, 8], 
						], //in
						pout: [ [-7.1, 2, 8], [-7.1, 2, 3], [14, 2, 3],  ] //out
					}
				},
				{
					name: "chiller3",
					points: {
						pin: [ 
							[14, 2.4, 2], [14, 2.4, -1], [-14, 2.4, -1], [-14, 2.4, -3], 
							[-13.7, 2.4, -3.4], [-13.7, 5, -3.4], [-13.7, 5, 5], [-13.7, 2, 5], [-13.7, 2, 8], 
						], //in
						pout: [ [-15.1, 2, 8], [-15.1, 2, 3], [14, 2, 3], ] //out
					}
				},
				
			]
		}
	}

	componentDidMount() {
		const constructorProps = {
			canvasId: "canvasId125",
			chillerList: this.state.chillerList,
			officeList: this.state.officeList,
			pumpList: this.state.pumpList,
			pathList: this.state.pathList,
		}
		this.setState({ drawer: new Drawer(constructorProps) }, () => {
			this.state.drawer.draw(this.map3DLoaded)
		})
		
	}

	map3DLoaded = () => this.setState({ loading3DMap: false })

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
				{/* <div style={{ position: "absolute", left: 0, top: 0, border: "1px solid grey", backgroundColor: "#ffffff55", padding: "8px 16px" }}>
					<button style={{ margin: 8 }} onClick={this._clickChangedPipeColor}>Change Pipe Surface</button>
					<button style={{ margin: 8 }} onClick={this._clickChangedEarthColor}>Change Earth Surface</button>
				</div> */}
				{
					this.state.loading3DMap && (
						<div style={{ position: "fixed", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#fdfdfdff", }} >
							<div style={{ position: "absolute", left: "50%", bottom: "50%", }}>
								<div style={{ position: "relative", left: "-50%", bottom: "-50%", }}>
									<img width="40" src="img-material/loading.gif" alt="Loading 3D Map" />
								</div>
							</div>
						</div>
					)
				}
			</div>
		);
	}

}