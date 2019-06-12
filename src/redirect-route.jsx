import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class RedirectRoute extends Component {

    componentWillMount() {
        if(this.props.location.pathname === '/') this.props.history.push('/dashboard/analytics');
    }
    render() {
        return (<div></div>)
    }
}

export default withRouter(RedirectRoute);