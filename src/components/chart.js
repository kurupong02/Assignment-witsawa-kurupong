import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CanvasJSReact from '../resource/canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends Component {

    formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

    render() {
        const { isChart, isToggleChart, state} = this.props
        const options2 = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "dark2", // "light1", "dark1", "dark2"
            title: {
                text: "Income and Expense Recording"
            },
            subtitles: [{
				text: `Date : ${this.formatDate(state.startDate)} - ${this.formatDate(state.endDate)}`
            },{
                text: `Total : ${state.total}`,
            }],      
            axisX: {
				title: "Week of Year",
				prefix: "W",
				interval: 2
			},
            data: [{
                type: "pie",
                indexLabel: "{label}: {y}%",
                startAngle: -90,
                dataPoints: [
                    { y: state.income, label: "income" },
                    { y: state.expense, label: "expense" },
                ]
            }]
        }
        return (
            <Modal isOpen={isChart} toggle={isToggleChart} size="lg">
                <ModalHeader toggle={isToggleChart}>Report</ModalHeader>
                <ModalBody>
                    <CanvasJSChart options={options2} />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={isToggleChart}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default Chart;