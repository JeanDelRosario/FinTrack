import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
            dbFinancialInfo: []
        }
        this.renderAnalyticsTab = this.renderAnalyticsTab.bind(this)
    }

    handleLogOut = () => {
        fetch('/api/logout')
            .then(res => {
                if (res.status === 200) {
                    this.props.history.push('/signIn');
                }
            });
    }

    // Methods for insert-info.jsx
    handleTyping = (event) => {

        const inputName = event.target.name;
        const inputValue = event.target.value;
        console.log(event.target.value)
        this.setState({
            [inputName]: inputValue
        });

        

    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.category)
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
                        description: ""
                    })
            }
        )
        .catch(err => console.error(err))
    }

    deleteItem = (event) => {
        console.log( event.target.id )
        fetch('/api/finantial-info', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'PRIMARY_INT': event.target.id })
        })
        .then(this.getFinancialInfo())
    }

    // End of methods for insert-info.jsx
    componentWillMount() {
        this.getFinancialInfo();
    }


    renderAnalyticsTab() {

        return (<Analytics
            currentMonthExpenses = {this.state.dbFinancialInfo}

            getFinancialInfo = {this.getFinancialInfo}

        />)
    }


    render() {

        return (
            <Router>

                <div className="dashboard">
                    <nav className="nav-side">
                        <Link to='/dashboard/insert-info'><div className="nav-el">Insert Info</div></Link>
                        <Link to='/dashboard/analytics'><div className="nav-el">Analiticas</div></Link>
                    </nav>
                    <div>
                        <div className="dashboard-banner">
                            <p>Hola</p>
                            <button onClick={this.handleLogOut}>Logout</button>
                        </div>

                        <Route path='/dashboard/insert-info' render={ () =>
                            (<InsertInfo
                                date = {this.state.date}
                                category = {this.state.category}
                                amount = {this.state.amount}
                                description = {this.state.description}
                                dbFinancialInfo = {this.state.dbFinancialInfo}

                                handleTyping = {this.handleTyping}
                                handleSubmit = {this.handleSubmit}
                                getFinancialInfo = {this.getFinancialInfo}
                                deleteItem = {this.deleteItem}
                            />
                            )}
                        />
                        <Route path='/dashboard/analytics' render={this.renderAnalyticsTab}
                        />

                    </div>
                </div>
            </Router>
        )
    }
}

export default DashboardMain;