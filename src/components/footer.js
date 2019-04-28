import React, { Component } from 'react';

class Footer extends Component {
    render() {
        const { state} = this.props;
        return (
            <div className="footer">
                <div className="row" >
                    <div style={{ margin: 16 }}>
                        <h6>Income</h6>
                        <h3>{state.income}</h3>
                    </div>
                    <div style={{ margin: 16 }}>
                        -
                </div>
                    <div style={{ margin: 16 }} >
                        <h6>Expense</h6>
                        <h3>{state.expense}</h3>
                    </div>
                    <div style={{ margin: 16 }}>
                        =
                </div>
                    <div style={{ margin: 16 }} >
                        <h6>Total</h6>
                        <h3 style ={{color : state.total <0 ? "Red":"Green"}}>{state.total}</h3>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;