import React, { Component } from "react";
import Drawer from "./Drawer"

export default class App extends Component {

	constructor() {
		super()
		this.state = {
			drawer : null, 
			chillerList : [ 
				["ch1", 2, 8], ["ch2", -6, 8], ["ch3", -14, 8],
			],
			officeList: [
				["office", 14, 2]
			],
			pumpList: [
				["pump1", 2, -4], ["pump2", -6, -4], ["pump3", -14, -4]
			], 
			pathList: [
				{
					name: "chiller1",
					points: {
						pin: [[14, 2], [14, -8], [2, -8], [2, 8]], //in
						pout: [[2, 8], [2, 12], [14, 12], [14, 2]], //out
					}
				},
				{
					name: "chiller2",
					points: {
						pin: [[14, 2], [14, -8], [-6, -8], [-6, 8]], //in
						pout: [[-6, 8], [-6, 12], [14, 12], [14, 2]], //out
					}
				},
				{
					name: "chiller3",
					points: {
						pin: [[14, 2], [14, -8], [-14, -8], [-14, 8]], //in
						pout: [[-14, 8], [-14, 12], [14, 12], [14, 2]], //out
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
				{/* <div style={{ position: "absolute", left: 0, top: 0, border: "1px solid grey", backgroundColor: "#ffffff55", padding: "8px 16px" }}>
					<button style={{ margin: 8 }} onClick={this._clickChangedPipeColor}>Change Pipe Surface</button>
					<button style={{ margin: 8 }} onClick={this._clickChangedEarthColor}>Change Earth Surface</button>
				</div> */}
			</div>
		);
	}

}