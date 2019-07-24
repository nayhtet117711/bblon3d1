import React, { Component } from "react";
import Drawer from "./Drawer"

export default class App extends Component {

	constructor() {
		super()
		this.state = {
			drawer : null, 
			chillerList : [ 
				["ch1", -6, 6], ["ch2", -12, 6],
			],
			officeList: [
				["office", 6, 6]
			],
			pumpList: [
				["pump1", -6, 0], ["pump2", -12, 0]
			], 
			pathList: [
				[
					[6, 6], [6, -3], [-6, -3], [-6, 9], [6, 9], [6, 5], 
				],
				[
					[6, 6], [6, -3], [-12, -3], [-12, 9], [6, 9], [6, 5], 
				],
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
				<div style={{ position: "absolute", left: 0, top: 0, border: "1px solid grey", backgroundColor: "#ffffff55", padding: "8px 16px" }}>
					<button style={{ margin: 8 }} onClick={this._clickChangedPipeColor}>Change Pipe Surface</button>
					<button style={{ margin: 8 }} onClick={this._clickChangedEarthColor}>Change Earth Surface</button>
				</div>
			</div>
		);
	}

}