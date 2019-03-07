import React, { Component } from 'react';
import axios from 'axios';
import { Button, Header, Form, Radio, Popup, Table, Segment, Checkbox} from 'semantic-ui-react'

class VMControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.username,
            VMs: [],
            cost: 0,
            showTemplate: false,
            showCost: false,
            time: null,
            startTime: null,
            endTime: null,
        };
        this.getVMs();
    }

    handleChange = (e, { value }) => this.setState({ value })

    getVMs() {
        axios.post("https://localhost:8080/getVM",
            {
                user: this.state.email,
            }).then(function (response) {
                response.data.forEach(item => this.state.VMs.push(item));
            }).catch(e => console.log(e));
    }

    getCost() {
        if (this.state.showCost === true) {
            this.setState({showCost: false});
        } else {
            this.setState({showCost: true});
            axios.post("https://localhost:8080/getCost",
                {
                    user: this.state.email,
                }).then(function (response) {
                this.state.cost = response.data.cost;
            }).catch(e => console.log(e));
        }
    }

    createVM() {
        this.setState({action: 'create'});
        this.setState({showTemplate: true});
    }

    upgradeVM(id, type) {
        this.setState({value: type});
        this.setState({action: 'upgrade'});
        this.setState({focus: id});
        this.setState({showTemplate: true});
    }

    deleteVM(id) {
        axios.post("https://localhost:8080/delete",
            {
                user: this.state.email,
                vm: id,
            }).then(function (response) {
                let array = this.state.VMs;
                let index = this.state.VMs.indexOf(id);
                array.splice(index, 1);
                this.setState({VMs: array});
        }).catch(e => console.log(e));
    }

    startVM(id) {
        axios.post("https://localhost:8080/start",
            {
                user: this.state.email,
                vm: id,
            }).then(function (response) {
            let array = this.state.VMs;
            let index = this.state.VMs.indexOf(id);
            array[index].status = 'start';
            this.setState({VMs: array});
        }).catch(e => console.log(e));
    }

    stopVM(id) {
        axios.post("https://localhost:8080/stop",
            {
                user: this.state.email,
                vm: id,
            }).then(function (response) {
            let array = this.state.VMs;
            let index = this.state.VMs.indexOf(id);
            array[index].status = 'stop';
            this.setState({VMs: array});
        }).catch(e => console.log(e));
    }

    makeChange(){
        if(this.state.action === 'upgrade') {
            let array = this.state.VMs;
            let index = this.state.VMs.indexOf(this.state.focus);
            if (array[index].type != this.state.value) {
                axios.post("https://localhost:8080/delete",
                    {
                        user: this.state.email,
                        vm: this.state.focus,
                        type: this.state.value,
                    }).then(function (response) {

                    array[index].type = this.state.value;
                    this.setState({VMs: array});
                }).catch(e => console.log(e));
            }
        } else if (this.state.action === 'create') {
            axios.post("https://localhost:8080/create",
                {
                    user: this.state.email,
                    vm: this.state.value,
                }).then(function (response) {
                let array = this.state.VMs;
                array.push(response.data)
                this.setState({VMs: array});
            }).catch(e => console.log(e));
        }

        // Reset the state.
        this.setState({action: null});
        this.setState({showTemplate:false});
        this.setState({value: null});
    }

    requestTime() {
        axios.post("https://localhost:8080/requestTime",
            {
                user: this.state.email,
                start: this.state.startTime,
                end: this.state.endTime,
            }).then(function (response) {
            this.setState({time: response.data});
        }).catch(e => console.log(e));
    }

    handleTimeChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    myVM() {
        let container = [];
        this.state.VMs.map((item, i) => {
            container.push(
                <Table.Row>
                    <Table.Cell>
                        <Header as='h2' textAlign='center'>
                            {item.id}
                        </Header>
                    </Table.Cell>
                    <Table.Cell singleLine>{item.type}</Table.Cell>
                    <Table.Cell singleLine>{item.status}</Table.Cell>
                    <Table.Cell>
                        <Button color='blue' onClick={() => this.upgradeVM(item.id)}>Modify VM</Button>
                    </Table.Cell>
                    <Table.Cell textAlign='right'>
                        <Button color='red' onClick={() => this.deleteVM(item.id)}>Delete VM</Button>
                    </Table.Cell>
                    <Table.Cell textAlign='right'>
                        <Button onClick={() => this.startVM(item.id)}>Start VM</Button>
                    </Table.Cell>
                    <Table.Cell textAlign='right'>
                        <Button onClick={() => this.stopVM(item.id)}>Stop VM</Button>
                    </Table.Cell>
                </Table.Row>
            )
        });
        return container;
    }

    render() {
        return (
            <div>
                <div>
                    <Button onClick={() => this.getCost()}>Get Cost</Button>
                    { this.state.showCost ? (<Segment>{this.state.cost}</Segment>) : null}
                </div>
                <div>
                    <Form>
                        <Form.Field>
                            <label>Start Time</label>
                            <input value={this.state.startTime} onChange={this.handleTimeChange}  />
                        </Form.Field>
                        <Form.Field>
                            <label>End Time</label>
                            <input value={this.state.endTime} onChange={this.handleTimeChange} />
                        </Form.Field>
                        <Button onClick={() => this.requestTime()}>Submit</Button>
                        <p>{this.state.time}</p>
                    </Form>
                </div>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell singleLine>VM ID</Table.HeaderCell>
                            <Table.HeaderCell>VM Type</Table.HeaderCell>
                            <Table.HeaderCell>VM Status</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.myVM()}
                    </Table.Body>
                </Table>
                <br/>
                <div>
                    <Button onClick={() => this.createVM()}>Create VM</Button>
                </div>
                <br/>
                { this.state.showTemplate ? (
                    <Form>
                        <Form.Field>
                            <Popup trigger={
                                <Radio
                                    label='Basic Virtual Server Instance'
                                    name='radioGroup'
                                    value='basic'
                                    checked={this.state.value === 'basic'}
                                    onChange={this.handleChange}
                                />
                            } content='8 virtual processor cores, 16 GB of virtual RAM, 20 GB of storage space in the root file
                    system - 5 cents/minute' />
                        </Form.Field>
                        <Form.Field>
                            <Popup trigger={
                                <Radio
                                    label='Large Virtual Server Instance'
                                    name='radioGroup'
                                    value='large'
                                    checked={this.state.value === 'large'}
                                    onChange={this.handleChange}
                                />
                            } content='32 virtual processor cores, 64 GB of virtual RAM, 20 GB of storage space in the root file
                     system -10 cents/minute' />
                        </Form.Field>
                        <Form.Field>
                            <Popup trigger={
                                <Radio
                                    label='Ultra-Large Virtual Server Instance'
                                    name='radioGroup'
                                    value='ultra'
                                    checked={this.state.value === 'ultra'}
                                    onChange={this.handleChange}
                                />
                            } content='128 virtual processor cores, 512 GB of virtual RAM, 40 GB of storage space in the root
                    file system- 15 cents /minute' />
                        </Form.Field>
                        <div>
                            <Button onClick={() => this.makeChange()}>Submit</Button>
                        </div>
                    </Form>
                ) : null }
            </div>
        )
    }
}

export default VMControl;