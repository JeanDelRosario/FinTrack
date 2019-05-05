import React, { Component } from 'react';

import './sign-in.css';

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

        fetch('/api/authenticate', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log(res.status)
                if (res.status === 200) {
                    this.props.history.push('/');
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

    render() {
        return (

            <div id='sign-in-container'>

                <div id='logo'>
                    FinTrack LOGO
            </div>
                <div id='inputs'>

                    <form onSubmit={this.handleSubmit}>
                        <input id='email-input'
                            type='text'
                            name='email'
                            placeholder='Email...'
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            required />

                        <input id='password-input'
                            type='text'
                            name='password'
                            placeholder='Password...'
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            required />

                        <div id='buttons'>
                            <div id='create-new-acc'>
                                <button type="button" id='create-new-acc-button'
                                    onClick={this.handleNewUser}>Nuevo Usuario</button>
                            </div>
                            <div id='login'>
                                <button id='sign-in-button'>Login</button>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        )};
};

export default SignIn;