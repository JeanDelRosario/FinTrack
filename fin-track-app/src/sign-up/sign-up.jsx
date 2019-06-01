import React, { Component } from 'react';

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

    handleSubmit = (event) => {
        event.preventDefault();
        
        const { email, password } = this.state;

        fetch('/api/sign-up', {
            method: 'POST',
            body: JSON.stringify( { email, password } ),
            headers: {
                'Content-Type': 'application/json'
            }
            }).then(res => res.json())
              .catch(err => console.log(err))
              .then(res => {
                  if(res.message === 'Duplicated') {
                      alert('Email already registered.');
                  } else if (res.message === 'Error') {
                      alert('There was an error, try again later.');
                  } else {
                    this.props.history.push('/signIn');
                  }

                });
    }

    render() {
        return (
            <div>
                <div id='sign-in-container'>

                    <div id='logo'>
                        FinTrack LOGO
                    </div>
                </div>
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

                    <button id='sign-in-button'>Sign Up</button>

                </form>
            </div>
        )};
}

export default SignUp;