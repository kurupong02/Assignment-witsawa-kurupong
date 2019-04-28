import React, { Component } from 'react';
import { Table, Button, Input } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import Footer from '../components/footer'
import { connect } from 'react-redux'
import Transactions from '../components/transactions'
import Navbar from '../components/navbar'
import TitleSort from '../components/titleSort'

const API = 'https://assignment-api.dev.witsawa.com';
// const API = 'http://localhost:8080';
const options = [
    { value: 'income', label: 'income' },
    { value: 'expense', label: 'expense' },
];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapse: false,
            date: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            type: { value: 'income', label: 'income' },
            remark: '',
            amount: 0,
            transactions: [],
            income: 0.0,
            expense: 0.0,
            total: 0.0,
            sort: 'date'
        };
        this.toggle = this.toggle.bind(this);
        this.isToggleChart = this.isToggleChart.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeRangeDate = this.handleChangeRangeDate.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSortBy = this.handleSortBy.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
    }

    componentDidMount() {
        this.getTransactions();
    }

    isToggleChart() {
        this.setState(state => ({
            isChart: !state.isChart
        }))
    }

    toggle() {
        this.setState(state => ({
            isCollapse: !state.isCollapse,
            date: new Date(),
            type: { value: 'income', label: 'income' },
            remark: '',
            amount: 0,
        }));
    }

    handleChangeDate(date) {
        this.setState({
            date: date
        });
    }

    handleChangeRangeDate(date, type) {
        this.setState({
            [type]: date
        }, () => { this.getTransactions(); });
    }

    handleChangeSelect = (type) => {
        this.setState({ type });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSortBy(title, value) {
        const response = this.state.transactions
        this.setState({ transactions: [] }, () => {
            var data = []
            if (value) {
                data = response.sort((a, b) => (a[title] > b[title]) ? 1 : ((b[title] > a[title]) ? -1 : 0));
            } else {
                data = response.sort((a, b) => (a[title] > b[title]) ? -1 : ((b[title] > a[title]) ? 1 : 0));
            }
            this.setState({ transactions: data, sort: title })
        })
    }

    handleSubmit() {
        const { remark, amount, date, type } = this.state;
        const { users } = this.props;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: users._id,
                amount: amount,
                type: type.value,
                remark: remark,
                date: date.toISOString()
            })
        };
        fetch(`${API}/transactions`, requestOptions)
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, responseJson]) => {
                if (response.ok) {
                    this.toggle()
                    this.getTransactions();
                }
            })
            .catch(error => this.setState({ error }));
    }

    getTransactions = () => {
        const { users } = this.props;
        const { startDate, endDate } = this.state;
        this.setTime()
        fetch(`${API}/transactions?user=${users._id}`)
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, responseJson]) => {
                if (response.ok) {
                    this.setState({ transactions: [] }, () => {
                        var income = 0.0
                        var expense = 0.0
                        var data = responseJson.filter(response => new Date(response.date) >= startDate && new Date(response.date) <= endDate)
                        for (var n in data) {
                            if (data[n].type === 'income') {
                                income += data[n].amount
                            } else {
                                expense += data[n].amount
                            }
                        }
                        var total = income - expense
                        this.setState({ income, expense, total })
                        this.setState({ transactions: data, transactionsSearch: data  })
                    })
                }
            })
            .catch(error => this.setState({ error }));
    }

    onChangeSearch(e){
        const {  value } = e.target;
        const { transactionsSearch} = this.state;
        this.setState({
            transactions:[]
        },()=>{
            if(value !== ''){
                const filterTransactions = transactionsSearch.filter(transactions =>{
                    return transactions.remark.toLowerCase().indexOf(value.toLowerCase()) !== -1 
                })
                this.setState({ transactions: filterTransactions })
            }else{
                this.setState({ transactions: transactionsSearch })
            }
        })
    }

    setTime() {
        const { startDate, endDate } = this.state;
        startDate.setHours(0)
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        endDate.setHours(23)
        endDate.setMinutes(59)
        endDate.setSeconds(59)
    }

    render() {
        const { date, type, remark } = this.state;
        return (
            <div className="home">
                <Navbar state={this.state} handleChangeRangeDate={this.handleChangeRangeDate} onChangeSearch = {this.onChangeSearch}/>
                <Button color="warning" style={{ margin: 16 }} size="sm" onClick={() => this.setState({ isCollapse: true })}><h6> + Add Transaction</h6></Button>
                {this.state.isCollapse ? (
                    <div style={{ float: "right" }}>
                        <Button color="success" style={{ margin: 16 }} size="sm" onClick={() => this.handleSubmit()}><h6>Save</h6></Button>
                        <Button color="danger" style={{ margin: 16 }} size="sm" onClick={this.toggle}><h6>Cancel</h6></Button>
                    </div>
                ) : (null)}
                <Table hover>
                    <thead>
                        <tr>
                            <th style={{ width: "1%" }}>#</th>
                            <th style={{ width: "15%" }}><TitleSort handleSortBy={this.handleSortBy} state={this.state} title={'date'} /></th>
                            <th style={{ width: "15%" }}><TitleSort handleSortBy={this.handleSortBy} state={this.state} title={'type'} /></th>
                            <th style={{ width: "35%" }}>remark</th>
                            <th style={{ width: "15%" }}><TitleSort handleSortBy={this.handleSortBy} state={this.state} title={'amount'} /></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.isCollapse ? (
                            <tr style={{ backgroundColor: '#282c34' }}>
                                <th>1</th>
                                <td >
                                    <DatePicker
                                        autoFocus={true}
                                        selected={date}
                                        onChange={this.handleChangeDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="yyyy-M-dd  h:mm aa"
                                        timeCaption="time"
                                    />
                                </td>
                                <td>
                                    <Select
                                        value={type}
                                        onChange={this.handleChangeSelect}
                                        options={options}
                                    />
                                </td>
                                <td>
                                    <Input type="text" name="remark" onChange={this.handleChange} value={remark} />
                                </td>
                                <td>
                                    <Input type="number" name="amount" onChange={this.handleChange} placeholder="0" />
                                </td>
                                <td></td>
                            </tr>
                        ) : (null)}
                    </tbody>
                    <tbody>
                        {this.state.transactions.map((data, index) =>
                            <Transactions key={index} data={data} index={index} getTransactions={this.getTransactions} />
                        )}
                    </tbody>
                </Table>
                <Footer state={this.state} />
            </div>
        );
    }
}

const mapStateToProp = (state) => {
    return {
        users: state.users.user
    };
};

export default connect(mapStateToProp)(Home)