import React, { Component } from 'react';
import iconUser from '../resource/image/user.png';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

class Header extends Component {
    isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    render() {
        const { users } = this.props;
        return (
            <div className="header">
                <div className="row" style={{ margin: 0 }}>
                    <div className="col" style={{ padding: 20 }}><h1>WITSAWA</h1></div>
                    <div className="row" style={{ padding: 20 }}>
                        <img src={iconUser} style={{ width: 40, height: 40, marginRight: 10 }} alt="" />
                        {this.isEmpty(users) ?(null):(
                             <div>
                             <h3>{users.username}</h3>
                             <Link to="/login" className="btn btn-link">Logout</Link>
                         </div>
                        )}
                       
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProp = (state) => {
    return {
        users: state.users.user
    };
};

export default connect(mapStateToProp)(Header)