import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';
import SignUp from './sign-up/sign-up';
import SignIn from './sign-in/sign-in';


class App extends Component {
  render() {
    return (
      <div className="App">

        <Router>

          <Route path='/signIn' component={SignIn} />
          <Route path='/signUp' component={SignUp} />
          {// <Route path='/tutor-main' component={withAuth(TutorMain)} /> 
          }

        </Router>
      </div>
    );
  }
}

export default App;