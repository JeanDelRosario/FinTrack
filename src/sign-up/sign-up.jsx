import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

import './sign-up.css';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            dbAnswer: ""
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    redirectLogin = () => {
        this.props.history.push('/login');
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { email, password } = this.state;

        fetch('/api/sign-up', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(err => console.log(err))
            .then(res => {
                if (res.message === 'Duplicated') {
                    alert('Email already registered.');
                } else if (res.message === 'Error') {
                    alert('There was an error, try again later.');
                } else {
                    this.props.history.push('/login');
                }

            });
    }

    render() {
        return (

            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        Create your FinTrack account
                    </Header>
                    <Form size='large' onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid icon='user'
                                iconPosition='left'
                                placeholder='E-mail address'
                                id='email-input'
                                type='text'
                                name='email'
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                required />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                name='password'
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                required
                            />

                            <Button color='teal' fluid size='large'>
                                Sign Up
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Alredy have an account? <p style={{"color": "teal", "cursor": "pointer"}}
                            onClick={this.redirectLogin}>Log in</p>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    };
}

export default withRouter(SignUp);