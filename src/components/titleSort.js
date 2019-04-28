import React, { Component } from 'react';
import iconSortDown from '../resource/image/sort-down.png'
import iconSortUp from '../resource/image/sort-up.png'

class TitleSort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true
        };
    }

    handleClick() {
        const { title, handleSortBy } = this.props
        const { click } = this.state
        this.setState({
            click: !click
        }, () => {
            handleSortBy(title, click)
        })
    }

    render() {
        const { title, state, } = this.props
        const { click } = this.state
        return (
            <div >
                <button onClick={() => this.handleClick()}  >
                    {title}&nbsp;&nbsp;
                    <img className = {state.sort === title ? "icon-sort":"icon-sort-un"} src={click ?iconSortDown:iconSortUp}  alt="" />
                </button>
            </div>
        );
    }
}

export default TitleSort