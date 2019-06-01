import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';
import SignUp from './sign-up/sign-up';
import SignIn from './sign-in/sign-in';
import DashboardMain from './dashboard/dashboard-main';
import withAuth from './withAuth';


class App extends Component {
  render() {
    return (
      <div className="App">

        <Router>

          <Route path='/signIn' component={SignIn} />
          <Route path='/signUp' component={SignUp} />
          <Route path='/dashboard' component={withAuth(DashboardMain)} />
          {// <Route path='/tutor-main' component={withAuth(TutorMain)} /> 
          }

        </Router>
      </div>
    );
  }
}

export default App;