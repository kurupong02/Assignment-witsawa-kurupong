import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, FormFeedback, Card, CardHeader, CardBody, Button, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'

const API = 'https://assignment-api.dev.witsawa.com';
// const API = 'http://localhost:8080';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isRegister: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        fetch(`${API}/users`, requestOptions)
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, responseJson]) => {
                if (response.ok) {
                    this.props.history.push('/login')
                }else if(response.status === 400){
                    this.setState({isRegister:false})
                }
            })
    }

    render() {
        const { username, password, isRegister } = this.state;
        return (
            <div className="App-header">
                <div className="col-md-6 col-md-offset-3">
                <Card style={{ color: "#000" }}>
                    <CardHeader style={{ textAlign: "center" }}>Register</CardHeader>
                    <CardBody>
                        {isRegister ? (null) : (
                                <Alert color="danger">
                                    That user already exisits!
                            </Alert>
                            )}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup >
                                <Label for="exampleUser">Username</Label>
                                <Input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} required />
                                <FormFeedback>You will not be able to see this</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} required />
                                <FormFeedback valid>Sweet! that name is available</FormFeedback>
                            </FormGroup>
                            <FormGroup check row>
                                <Button>Register</Button>
                                <Link to="/login" >
                                    <Button color="danger" style={{ marginLeft: 16 }}>Cancel</Button>
                                </Link>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);