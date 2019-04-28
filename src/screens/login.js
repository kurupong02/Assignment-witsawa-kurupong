import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Alert, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const API = 'https://assignment-api.dev.witsawa.com';
// const API = 'http://localhost:8080'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLogin: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        localStorage.removeItem('user')
        this.props.USERS_LOGIN({})
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        };

        fetch(`${API}/users/login`, requestOptions)
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, responseJson]) => {
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(responseJson));
                    this.props.USERS_LOGIN(responseJson)
                    this.props.history.push('/home')
                } else {
                    this.setState({ isLogin: false })
                }
            })
            .catch(error => this.setState({ error }));
    }

    render() {
        const { username, password, isLogin } = this.state;
        return (
            <div className="App-header">
                <div className="col-md-6 col-md-offset-3">
                    <Card style={{ color: "#000" }}>
                        <CardHeader style={{ textAlign: "center" }}>Login</CardHeader>
                        <CardBody>
                            {isLogin ? (null) : (
                                <Alert color="danger">
                                    Username or password is incorrect
                            </Alert>
                            )}
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup >
                                    <Label for="exampleUser">Username</Label>
                                    <Input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} required />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="examplePassword">Password</Label>
                                    <Input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} required />
                                </FormGroup>
                                <FormGroup check row>
                                    <Button>Login</Button>
                                    <Link to="/register" className="btn btn-link">Register</Link>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }
}

const mapStateToProp = (state) => {
    return {
        userss: state.users
    };
};

const mapDispatchToProp = (dispatch) => {
    return {
        "USERS_LOGIN": (user) => {
            dispatch({
                type: 'USERS_LOGIN',
                payload: { user: user }
            })
        }
    }
}

export default connect(mapStateToProp, mapDispatchToProp)(withRouter(Login))