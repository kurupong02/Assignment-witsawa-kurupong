import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../components/header'
import Login from '../screens/login'
import Home from '../screens/home'
import Register from '../screens/register'
import { PrivateRoute } from './privateRoute';

class Router extends Component {
    render() {
        return (
            <BrowserRouter >
                <Header />
                <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute exact path="/home" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;