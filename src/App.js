import React, { Component } from "react";
import Drawer from "./Drawer"

export default class App extends Component {

	constructor() {
		super()
		this.state = {
			loading3DMap: true,
			drawer: null,
		}
	}

	componentDidMount() {
		fetch("Eva3DMap.json")
			.then(res => res.json())
			.then(data => {
				const { chillerList, officeList, pumpList, pathList } = data
				const constructorProps = {
					canvasId: "canvasId125",
					chillerList,
					officeList,
					pumpList,
					pathList,
				}
				this.setState({ drawer: new Drawer(constructorProps) }, () => {
					this.state.drawer.draw(this.map3DLoaded)
					const chillerText = {
						chiller1: ["Efficiency: 128.3", "Power: 128 kW", "Power Consumption: 128 kW", "Input Temperature: 18 ℃"],
						chiller2: ["Efficiency: 78.02", "Power: 150 kW", "Power Consumption: 90 kW"],
						chiller3: ["Efficiency: 55.02", "Power: 98 kW", "Power Consumption: 132 kW"]
					}
					this.state.drawer.drawChillerText({ chillerText })
				})
				
			})

	}

	map3DLoaded = () => this.setState({ loading3DMap: false })

	_clickChangedPipeColor = () => {
		const chillerText = {
			chiller1: ["Efficiency: 121.3", ],
			chiller2: ["Efficiency: 96.02", "Power: 150 kW", "Power Consumption: 40 kW"],
			chiller3: ["Efficiency: 3.02", "Power: 98 kW", ]
		}
		this.state.drawer.drawChillerText({ chillerText })
	}

	render() {
		return (
			<div style={{ padding: 0, height: "96vh" }}>
				<canvas style={{ width: "100%", height: "100%" }} id="canvasId125"></canvas>
				<div style={{ position: "absolute", left: 0, top: 0, border: "1px solid grey", backgroundColor: "#ffffff55", padding: "8px 16px" }}>
					<button style={{ margin: 8 }} onClick={this._clickChangedPipeColor}>Change Pipe Surface</button>
				</div>
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