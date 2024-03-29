import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.validateLogin = this.validateLogin.bind(this);
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    validateLogin() {
        axios.post("http://se4455-wang4009kai.c9users.io:8080/login",
            {
                userName: this.state.email,
                password: this.state.password
            }).then( (response) => {
                if(response.data) { this.props.updateParent(this.state.email);}
            }).catch(e => console.log(e));
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {
        return (
            <div className="Login">
                <form>
                    <FormGroup controlId="email" bsSize="large">
                        <FormLabel>Email</FormLabel>
                        <FormControl
                            autoFocus
                            type="username"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        
                        onClick={this.validateLogin}
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}

export default Login;