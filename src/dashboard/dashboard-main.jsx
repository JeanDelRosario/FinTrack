import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import { Icon, Menu, Segment, Sidebar, Dropdown } from 'semantic-ui-react'

import './dashboard-main.css';

import InsertInfo from './insert-info/insert-info';
import Analytics from './analytics/analytics';

class DashboardMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            category: "Food and Drinks",
            amount: "",
            description: "",
            dbFinancialInfo: [],

            email: "",

            activeItem: ""
        }
        this.renderAnalyticsTab = this.renderAnalyticsTab.bind(this)
    }
    activeItemAnalytics = () => {
        this.setState({ activeItem: "analytics" });
    }
    activeItemInsertInfo = () => {
        this.setState({ activeItem: "insert-info" });
    }

    handleLogOut = () => {
        fetch('/api/logout')
            .then(res => {
                if (res.status === 200) {
                    this.props.history.push('/login');
                }
            });
    }

    // Methods for insert-info.jsx
    handleTyping = (event) => {

        const inputName = event.target.name;
        const inputValue = event.target.value;
        this.setState({
            [inputName]: inputValue
        });



    }

    handleSubmit = (event) => {
        event.preventDefault();
        fetch('/api/finantial-info', {
            method: 'POST',
            body: JSON.stringify(
                {
                    date: this.state.date,
                    category: this.state.category,
                    amount: this.state.amount,
                    description: this.state.description
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => this.getFinancialInfo())

    }

    getFinancialInfo = () => {

        fetch('/api/finantial-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(err => console.error(err))

            .then(res => {
                this.setState({
                    dbFinancialInfo: res.info,
                    date: "",
                    amount: "",
                    description: "",
                    email: res.email
                })
            }
            )
            .catch(err => console.error(err))
    }

    deleteItem = (event) => {
        fetch('/api/finantial-info', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'PRIMARY_INT': event.target.id })
        })
            .then(this.getFinancialInfo())
    }

    // End of methods for insert-info.jsx
    componentWillMount() {
        this.getFinancialInfo();
    }



    renderAnalyticsTab() {

        return (<Analytics
            currentMonthExpenses={this.state.dbFinancialInfo}

            getFinancialInfo={this.getFinancialInfo}

            history={this.props.history}

            activeItemAnalytics={this.activeItemAnalytics}

        />)
    }


    render() {
        let activeItem = this.state.activeItem;

        return (
            <Router>

                <Sidebar.Pushable as={Segment} style={{ 'height': '100vh'}}>
                    <Sidebar className="desktop-view"
                        as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin'
                    >
                        <Menu.Item as={Link} to="/dashboard/insert-info" >
                            <Icon name='keyboard' />
                            Insert Info
                            </Menu.Item>
                        <Menu.Item as={Link} to="/dashboard/analytics">
                            <Icon name='chart line' />
                            Analytics
                            </Menu.Item>
                    </Sidebar>
                    <div>
                        <Segment inverted className="mobile-view-segment">
                            <Dropdown text={this.state.email} style={{ position: 'fixed', right: '0px' }}>
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Logout" onClick={this.handleLogOut} />
                                </Dropdown.Menu>

                            </Dropdown>
                            <Menu className="mobile-view" visible inverted color="black" pointing secondary
                            >
                                <Menu.Item as={Link} name="insert-info" active={activeItem === 'insert-info'}
                                    to="/dashboard/insert-info" onClick={this.handleItemClick}>
                                    <Icon name='keyboard' />
                                    Insert Info
                            </Menu.Item>
                                <Menu.Item as={Link} name="analytics" active={activeItem === 'analytics'}
                                    to="/dashboard/analytics" onClick={this.handleItemClick}>
                                    <Icon name='chart line' />
                                    Analiticas
                            </Menu.Item>
                            </Menu>


                        </Segment>
                    </div>
                    <Sidebar.Pusher>
                        <Segment basic>

                            <Route path='/dashboard/insert-info' render={() =>
                                (<InsertInfo
                                    date={this.state.date}
                                    category={this.state.category}
                                    amount={this.state.amount}
                                    description={this.state.description}
                                    dbFinancialInfo={this.state.dbFinancialInfo}

                                    handleTyping={this.handleTyping}
                                    handleSubmit={this.handleSubmit}
                                    getFinancialInfo={this.getFinancialInfo}
                                    deleteItem={this.deleteItem}

                                    history={this.props.history}

                                    activeItemInsertInfo={this.activeItemInsertInfo}
                                />
                                )}
                            />
                            <Route path='/dashboard/analytics' render={this.renderAnalyticsTab}
                            />
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Router>
        )
    }
}

export default withRouter(DashboardMain);