import React, { Component } from 'react';
import axios from 'axios';
import { Button, Header, Form, Radio, Popup, Table, Segment, Checkbox} from 'semantic-ui-react'

class VMControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.username,
            VMs: [],
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
        axios.post("http://se4455-wang4009kai.c9users.io:8080/getVM",
            {
                userName: this.state.email,
            }).then( (response) =>{
                let storage = [];
                response.data.forEach(item => {
                    console.log(item);
                    if(item.vmStatus === 'Started') {
                        item.startBtn = true;
                        item.stopBtn = false;
                    } else if(item.vmStatus === 'Stopped') {
                        item.startBtn = false;
                        item.stopBtn = true;
                    }
                    storage.push(item);
                });
                this.setState({VMs: storage});
            }).catch(e => console.log(e));
    }

    getCost() {
        axios.post("http://se4455-wang4009kai.c9users.io:8080/totalCharges",
            {
                userName: this.state.email,

            }).then((response) => {
            this.setState({cost: response.data});
        }).catch(e => console.log(e));
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
        axios.post("http://se4455-wang4009kai.c9users.io:8080/deleteServer",
            {
                userName: this.state.email,
                vm: id,
            }).then( (response) => {
                let array = this.state.VMs;
                let index;
                this.state.VMs.map((item, i) => {
                    if(item.vmID === id)
                        index = i;
                });
                array.splice(index, 1);
                this.setState({VMs: array});
            }).catch(e => console.log(e));

            this.setState({action: null});
            this.setState({showTemplate:false});
            this.setState({value: null});
            this.setState({focus: null});
    }

    startVM(id) {
        axios.post("http://se4455-wang4009kai.c9users.io:8080/startServer",
            {
                userName: this.state.email,
                vm: id,
            }).then( (response) => {
            let array = this.state.VMs;
            let index;
            this.state.VMs.map((item, i) => {
                if(item.vmID === id)
                    index = i;
            });
            array[index].vmStatus = 'Started';
            array[index].startBtn = true;
            array[index].stopBtn = false;
            this.setState({VMs: array});
        }).catch(e => console.log(e));
    }

    stopVM(id) {
        axios.post("http://se4455-wang4009kai.c9users.io:8080/stopServer",
            {
                userName: this.state.email,
                vm: id,
            }).then( (response) => {
            let array = this.state.VMs;
            let index;
            this.state.VMs.map((item, i) => {
                if(item.vmID === id)
                    index = i;
            });
            array[index].vmStatus = 'Stopped';
            array[index].startBtn = false;
            array[index].stopBtn = true;
            this.setState({VMs: array});
        }).catch(e => console.log(e));
    }

    makeChange(){
        if(this.state.action === 'upgrade') {
            let array = this.state.VMs;
            let index;
            this.state.VMs.map((item, i) => {
                if(item.vmID === this.state.focus)
                    index = i;
            });
            let type = this.state.value;
            if (array[index].vmType!= this.state.value) {
                axios.post("http://se4455-wang4009kai.c9users.io:8080/upgrade",

                    {
                        userName: this.state.email,
                        vm: this.state.focus,
                        type: type,
                    }).then( (response) =>{
                        array[index].vmType = type;
                        this.setState({VMs: array});
                }).catch(e => console.log(e));
            }
        } else if (this.state.action === 'create') {
            axios.post("http://se4455-wang4009kai.c9users.io:8080/createServer",
                {
                    userName: this.state.email,
                    type: this.state.value,
                }).then( (response) =>{
                let array = this.state.VMs;
                array.push(response.data)
                this.setState({VMs: array});
            }).catch(e => console.log(e));
        }

        // Reset the state.
        this.setState({action: null});
        this.setState({showTemplate:false});
        this.setState({value: null});
        this.setState({focus: null});
    }

    requestTime(id, i) {
        axios.post("http://se4455-wang4009kai.c9users.io:8080/requestTime",
            {
                userName: this.state.email,
                start: this.state.VMs[i].start,
                end: this.state.VMs[i].end,
                vm: id,
            }).then( (response) =>{
                let usageList = this.state.VMs;
                usageList[i].usage = response.data;
                this.setState({VMs: usageList});
        }).catch(e => console.log(e));
    }

    handleTimeStart(i, e) {
        let vms = this.state.VMs;
        const { name, value } = e.target;
        vms[i].start = value;
        this.setState({VMs: vms});
    }

    handleTimeEnd(i, e) {
        let vms = this.state.VMs;
        const { name, value } = e.target;
        vms[i].end = value;
        this.setState({VMs: vms});
    }

    myVM() {
        let container = [];
        this.state.VMs.map((item, i) => {
            container.push(
                <Table.Row>
                    <Table.Cell>
                        <Header as='h2' textAlign='center'>
                            {item.vmID}
                        </Header>
                    </Table.Cell>
                    <Table.Cell singleLine> {item.vmType} </Table.Cell>
                    <Table.Cell singleLine> {item.vmStatus} </Table.Cell>
                    <Table.Cell>
                        <Button color='blue' onClick={() => this.upgradeVM(item.vmID, item.vmType)}>Modify VM</Button>
                    </Table.Cell>
                    <Table.Cell textAlign='right'>
                        <Button color='red' onClick={() => this.deleteVM(item.vmID)}>Delete VM</Button>
                    </Table.Cell>
                    <Table.Cell textAlign='right'>
                        <Button disabled={item.startBtn} onClick={() => this.startVM(item.vmID)}>Start VM</Button>
                    </Table.Cell>
                    <Table.Cell textAlign='right'>
                        <Button disabled={item.stopBtn} onClick={() => this.stopVM(item.vmID)}>Stop VM</Button>

                    </Table.Cell>
                    <Table.Cell textAlign='right' key={i}>
                        <label>Start Time</label>
                        <input type='date' value={item.start} onChange={this.handleTimeStart.bind(this, i)}  />
                    </Table.Cell>
                    <Table.Cell textAlign='right' key={i}>
                        <label>End Time</label>
                        <input type='date' value={item.end} onChange={this.handleTimeEnd.bind(this, i)} />
                    </Table.Cell>
                    <Table.Cell textAlign='right' key={i}>
                        <Button onClick={() => this.requestTime(item.vmID, i)}>Get Usage Time</Button>
                        <p>{item.usage}</p>
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
                    <Segment>{this.state.cost}</Segment>
                </div>
                <br/>
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