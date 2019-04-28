import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Button, NavbarBrand, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import DatePicker from "react-datepicker";
import iconChartfrom from '../resource/image/pie-chart.png'
import iconSearch from '../resource/image/search.png'
import Chart from '../components/chart'

class navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChart: false,
            dropdownOpen: false,
        };
        this.isToggleChart = this.isToggleChart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    isToggleChart() {
        this.setState(state => ({
            isChart: !state.isChart
        }))
    }

    toggle() {
        this.setState(state => ({
            dropdownOpen: !state.dropdownOpen
        }));
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        const { state, handleChangeRangeDate , onChangeSearch} = this.props;
        const { isChart } = this.state;
        return (
            <div>
                <Chart isChart={isChart} isToggleChart={this.isToggleChart} state={state} />
                <Navbar color="light" light expand="md">
                    <NavbarBrand>
                        <div className="row" style={{ padding: 16, margin: 0 }}>
                            <div className="col" >
                                <div className="row">
                                    <h3>Date :&nbsp;</h3>
                                    <DatePicker
                                        selected={state.startDate}
                                        selectsStart
                                        startDate={state.startDate}
                                        endDate={state.endDate}
                                        onChange={date => handleChangeRangeDate(date, 'startDate')}
                                    />
                                    <h4>&nbsp;&nbsp;to&nbsp;&nbsp;</h4>
                                    <DatePicker
                                        selected={state.endDate}
                                        selectsEnd
                                        startDate={state.startDate}
                                        endDate={state.endDate}
                                        onChange={date => handleChangeRangeDate(date, 'endDate')}
                                    />
                                </div>
                            </div>
                        </div>
                    </NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <Button color="warning"><img src={iconSearch} style={{ width: 20, height: 20 }} alt="" /></Button>
                                </InputGroupAddon>
                                <Input placeholder="Search remark" onChange = {onChangeSearch}/>
                            </InputGroup>
                        </NavItem>
                        <NavItem>
                            <Button color="link" onClick={this.isToggleChart} >
                                <img src={iconChartfrom} style={{ width: 30, height: 30 }} alt="" />
                            </Button>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

export default navbar