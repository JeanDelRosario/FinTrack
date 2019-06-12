import React, { Component } from 'react';
import './analytics.css';
import {Pie} from 'react-chartjs-2';

import { Form, Segment } from 'semantic-ui-react'

// eslint-disable-next-line no-extend-native
Array.prototype.groupbySum = function(key, value) {
    return(
        this.reduce(function(res, currValue) {
            if (!res[currValue[key]]) {
                res[currValue[key]] = 0;
            }
            res[currValue[key]] = res[currValue[key]] + currValue[value];
            return res;
        }, {})
    )
}

function formatDate(date) {
    var d = new Date(date),
        dUTC = new Date(d.getTime() + d.getTimezoneOffset() * 60000),
        month = '' + (dUTC.getMonth() + 1),
        day = '' + dUTC.getDate(),
        year = dUTC.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function dateMinus(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateString = date.toISOString().split('T')[0];

    return dateString
}

const defaultColors = ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC']

const optionsForm = [
    {value:"Last 7 days", text:"Last 7 days"},
    {value:"Last 30 days", text:"Last 30 days"},
    {value:"This Month", text:"This Month"},
    {value:"This Year", text:"This Year"}
]

class Analytics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expenses: undefined,
            myChartData: undefined
        }
    }

    componentDidMount() {
        this.props.activeItemAnalytics();
    }


    myChartChange = (e) => {
        let expenses, expensesCard;

        if(e.target.innerText === "Last 7 days") {
            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(7)
            }).groupbySum('CATEGORY', 'AMOUNT')

            expensesCard = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(7)
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)

        } else if(e.target.innerText === "Last 30 days") {
            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(30)
            }).groupbySum('CATEGORY', 'AMOUNT')

            expensesCard = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(30)
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)

        }else if(e.target.innerText === "This Month") {

            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                

                return new Date(transaction.DATE).getUTCMonth() === new Date().getUTCMonth()
            }).groupbySum('CATEGORY', 'AMOUNT')

            expensesCard = this.props.currentMonthExpenses.filter((transaction) => {
                return new Date(transaction.DATE).getUTCMonth() === new Date().getUTCMonth()
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)


        }else if(e.target.innerText === "This Year") {
            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return new Date(transaction.DATE).getFullYear() === new Date().getFullYear()
            }).groupbySum('CATEGORY', 'AMOUNT')

            expensesCard = this.props.currentMonthExpenses.filter((transaction) => {
                return new Date(transaction.DATE).getFullYear() === new Date().getFullYear()
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)
        }

        this.setState({expenses: expensesCard})

        const labels = Object.keys(expenses);
        
        const myChartData = {
            datasets: [{
                data: Object.values(expenses),
                backgroundColor: defaultColors.slice(0, labels.length)
            }],
            labels: labels
        }

        this.setState({myChartData})

    }


    render() {

        let expenses = 0;
        let myChartData;

        if( this.state.expenses !== undefined ) {
            expenses = this.state.expenses;

        }else if ( this.props.currentMonthExpenses.length !== 0) {

            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(7)
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)

        }

        if ( this.props.currentMonthExpenses.length !== 0 ) {
            const groupedCurrentMonthExpenses = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(7)
            }).groupbySum('CATEGORY', 'AMOUNT')

            const labels = Object.keys(groupedCurrentMonthExpenses);

            myChartData = {
                datasets: [{
                    data: Object.values(groupedCurrentMonthExpenses),
                    backgroundColor: defaultColors.slice(0, labels.length)
                }],
                labels: labels
            }

        }
        const options = {
            legend: {
                display: false,
            },
        };

        return (
            <div className="main-div">
                <Form.Select className='chart-filter' onChange={this.myChartChange}
                options={optionsForm} defaultValue={"Last 7 days"}/>

                <Segment className='card-holder'>
                    <p>Gastos</p>
                    {expenses.toLocaleString()}
                </Segment>
                
                <div className="charts">
                    <div id="myChart-container">
                        <Pie
                            data={this.state.myChartData || myChartData}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Analytics;