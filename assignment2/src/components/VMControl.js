import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Button, Header, Form, Radio } from 'semantic-ui-react'

class VMControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.username,
            VMs: [],
            cost: 0,
        };
    }

    getVMs() {
        axios.post("https://localhost:8080/getVM",
            {
                user: this.state.email,
            }).then(function (response) {
                response.data.forEach(item => this.state.VMs.push(item));
            }).catch(e => console.log(e));
    }

    getCost() {
        axios.post("https://localhost:8080/getCost",
            {
                user: this.state.email,
            }).then(function (response) {
            this.state.cost = response.data.cost;
        }).catch(e => console.log(e));
    }

    createVM(id) {

    }

    upgradeVM(id) {

    }

    deleteVM(id) {

    }

    VMTemplate(id, type) {
        return(
            <Grid.Column>
                <div>
                    <Header size='medium'>{id}</Header>
                    <Header size='medium'>{type}</Header>
                </div>
                <div>
                    <Button color='green' onClick={() => this.createVM(id)}>Create VM</Button>
                    <Button color='blue' onClick={() => this.upgradeVM(id)}>Modify VM Config</Button>
                    <Button color='red' onClick={() => this.deleteVM(id)}>Delete VM</Button>
                </div>
            </Grid.Column>
        );
    }

    VMSelection(type) {
        return(
            <Form>
                <Form.Field>
                    Selected value: <b>{this.state.value}</b>
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Basic Virtual Server Instance - 8 virtual processor cores, 16 GB of virtual RAM, 20 GB
                        of storage space in the root file system - 5 cents/minute '
                        name='radioGroup'
                        value='this'
                        checked={this.state.value === 'this'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Or that'
                        name='radioGroup'
                        value='that'
                        checked={this.state.value === 'that'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
            </Form>
        );
    }

    render() {
        return (
            <div>
                <p>Welcome to Todos List Component!!</p>
            </div>
        )
    }
}

export default VMControl;