import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import Login from "./Login.js";
import VMControl from "./VMControl.js";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: true,
            email: ''
        };
        this.updateLogin = this.updateLogin.bind(this);
    }

    updateLogin(email) {
        this.setState({email: email});
        this.setState({authenticated: true});
    }

    render() {
        return (
            <Router>
                <Fragment>
                    { this.state.authenticated ? <VMControl username = {this.state.email} /> : < Login updateParent = {this.updateLogin} /> }
                </Fragment>
            </Router>
        );
    };
}

export default App;