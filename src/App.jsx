import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

import './App.css';
import SignUp from './sign-up/sign-up';
import SignIn from './sign-in/sign-in';
import DashboardMain from './dashboard/dashboard-main';
import withAuth from './withAuth';
import RedirectRoute from './redirect-route';

class App extends Component {


    render() {


        return (
            <div>
                <Router >
                    <div>
                        <RedirectRoute />
                        <Route exact path='/'
                            component={RedirectRoute} />
                        <Route path='/login'
                            component={SignIn} />
                        <Route path='/signUp'
                            component={SignUp} />
                        <Route path='/dashboard'
                            component={withAuth(DashboardMain)}
                        />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;