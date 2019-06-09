import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'


class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        fetch('/api/signIn', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log(res.status)
                if (res.status === 200) {
                    this.props.history.push('/dashboard/analytics');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleNewUser = () => {
        this.props.history.push('/signUp');
    }

    componentDidMount() {
        console.log(this.props)
    }

    render() {
        return (
            (
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                  <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                      <Image src='/logo.png' /> Log-in to your account
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
                          Login
                        </Button>
                      </Segment>
                    </Form>
                    <Message>
                      New to us? <p id='create-new-acc-button'
                                    onClick={this.handleNewUser}>Sign Up</p>
                    </Message>
                  </Grid.Column>
                </Grid>
              )
              
        )};
};

export default withRouter(SignIn);


