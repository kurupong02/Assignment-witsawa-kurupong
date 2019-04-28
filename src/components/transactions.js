import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import iconDeletefrom from '../resource/image/delete.png';
import iconEdit from '../resource/image/edit.png';

// const API = 'https://assignment-api.dev.witsawa.com';
const API = 'http://localhost:8080';
const options = [
    { value: 'income', label: 'income' },
    { value: 'expense', label: 'expense' },
];

class transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            collapseEdit: false,
            date: new Date(),
            type: { value: 'income', label: 'income' },
        };
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleMoal = this.toggleMoal.bind(this);
    }

    componentDidMount() {
        this.setData()
    }

    setData() {
        const { date, type, remark, amount, _id } = this.props.data
        var typeFilter = options.filter(options => options.value === type);
        var dateN = new Date(date)
        this.setState({ date: dateN, type: typeFilter[0], remark, amount, _id })
    }

    toggleMoal() {
        this.setState(state => ({
            modal: !state.modal,
        }));
    }

    toggle() {
        this.setState(state => ({
            collapseEdit: !state.collapseEdit
        }), () => { this.setData() });
    }

    handleChangeDate(date) {
        this.setState({
            date: date
        });
    }

    handleChangeSelect = (type) => {
        this.setState({ 
            type 
        });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSave() {
        const { remark, amount, date, type } = this.state;
        const { user, _id } = this.props.data;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: user,
                amount: amount,
                type: type.value,
                remark: remark,
                date: date.toISOString()
            })
        };

        fetch(`${API}/transactions/${_id}`, requestOptions)
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, responseJson]) => {
                if (response.ok) {
                    this.toggle()
                    this.props.getTransactions()
                }
            })
            .catch(error => this.setState({ error }));
    }

    handleConfirm() {
        const { _id } = this.props.data;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };

        fetch(`${API}/transactions/${_id}`, requestOptions)
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, responseJson]) => {
                if (response.ok) {
                    this.toggleMoal()
                    this.props.getTransactions()
                }
            })
            .catch(error => this.setState({ error }));
    }

    formattedDate(){
        const { date } = this.state;
        const formatted_date = `${date.getFullYear()}-${date.getMonth()+ 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        return <h6>{formatted_date}</h6>
    }

    render() {
        const { date, type, remark, amount } = this.state;
        return (
            <tr>
                <Modal isOpen={this.state.modal} toggle={this.toggleMoal}>
                    <ModalHeader toggle={this.toggleMoal}>Message !!!</ModalHeader>
                    <ModalBody>
                        Want to delete an item?
                        </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleConfirm()}>Confirm</Button>{' '}
                        <Button color="secondary" onClick={this.toggleMoal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <th>{this.props.index + 1}</th>
                <td >
                    {this.state.collapseEdit ? (<DatePicker
                        selected={date}
                        onChange={this.handleChangeDate}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-M-dd HH:mm:ss"
                        timeCaption="time"
                    />) : (this.formattedDate())}
                </td>
                <td>
                    {this.state.collapseEdit ? (
                        <Select
                            value={type}
                            onChange={this.handleChangeSelect}
                            options={options}
                        />
                    ) : (<h6>{type.value}</h6>)}
                </td>
                <td>
                    {this.state.collapseEdit ? (
                        <Input type="text" name="remark" onChange={this.handleChange} value={remark} />
                    ) : (<h6>{remark}</h6>)}
                </td>
                <td>
                    {this.state.collapseEdit ? (
                        <Input type="number" name="amount" onChange={this.handleChange} value={amount} />
                    ) : (<h6>{amount}</h6>)}
                </td>
                <td>
                    <Button color="link"><img src={iconEdit} style={{ width: 30, height: 30, marginRight: 10 }} alt="" onClick={this.toggle} /></Button>{' '}
                    <Button color="link"><img src={iconDeletefrom} style={{ width: 30, height: 30, marginRight: 10 }} alt="" onClick={() => this.setState(state => ({ modal: !state.modal }))} /></Button>
                    {this.state.collapseEdit ? (
                        <div>
                            <Button color="success" onClick={() => this.handleSave()}>Save</Button>{' '}
                            <Button color="danger" onClick={this.toggle}>Cancel</Button>{' '}
                        </div>
                    ) : (null)}

                </td>
            </tr>
        );
    }
}

export default transactions