import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class RedirectRoute extends Component {

    componentDidMount() {
        console.log('hi')
        console.log(this.props.location.pathname )
        if((this.props.location.pathname === '/') | (this.props.location.pathname === '')) this.props.history.push('/dashboard/analytics');
    }
    render() {
        return (<span style={{width: "0px", margin: "0px"}}></span>)
    }
}

export default withRouter(RedirectRoute);