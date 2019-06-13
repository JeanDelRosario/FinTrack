import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class RedirectRoute extends Component {

    componentDidMount() {
        if((this.props.location.pathname === '/') | (this.props.location.pathname === '')) this.props.history.push('/dashboard/analytics');
    }
    render() {
        return (<span style={{width: "0px", margin: "0px"}}></span>)
    }
}

export default withRouter(RedirectRoute);