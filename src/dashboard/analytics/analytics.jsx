import React, { Component } from 'react';
import './analytics.css';
import Chart from 'chart.js';

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
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

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

class Analytics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chart: {},
            expenses: undefined
        }
    }

    componentDidMount() {
        const groupedCurrentMonthExpenses = this.props.currentMonthExpenses.groupbySum('CATEGORY', 'AMOUNT');

        const data = {
            datasets: [{
                data: Object.values(groupedCurrentMonthExpenses)
            }],
            labels: Object.keys(groupedCurrentMonthExpenses)
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        // For a pie chart
        var PieChart = new Chart(ctx, {
            type: 'pie',
            data: data
        });

        this.setState({chart: PieChart})
    }

    componentDidUpdate(prevProps) {

        const groupedCurrentMonthExpenses = this.props.currentMonthExpenses.groupbySum('CATEGORY', 'AMOUNT');

        const labels = Object.keys(groupedCurrentMonthExpenses);
        
        const data = {
            datasets: [{
                data: Object.values(groupedCurrentMonthExpenses),
                backgroundColor: defaultColors.slice(0, labels.length)
            }],
            labels: labels
        }

        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.chart.data = data;

        this.state.chart.update();
    }

    myChartChange = (e) => {
        let expenses, expensesCard;

        if(e.target.value === "Last 30 days") {
            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(30)
            }).groupbySum('CATEGORY', 'AMOUNT')

            expensesCard = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(30)
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)

        }else if(e.target.value === "This Month") {
            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return new Date(transaction.DATE).getMonth() === new Date().getMonth()
            }).groupbySum('CATEGORY', 'AMOUNT')

            expensesCard = this.props.currentMonthExpenses.filter((transaction) => {
                return new Date(transaction.DATE).getMonth() === new Date().getMonth()
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)


        }else if(e.target.value === "This Year") {
            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return new Date(transaction.DATE).getFullYear() === new Date().getFullYear()
            }).groupbySum('CATEGORY', 'AMOUNT')

            expensesCard = this.props.currentMonthExpenses.filter((transaction) => {
                return new Date(transaction.DATE).getFullYear() === new Date().getFullYear()
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0)
        }

        this.setState({expenses: expensesCard})

        const labels = Object.keys(expenses);
        
        const data = {
            datasets: [{
                data: Object.values(expenses),
                backgroundColor: defaultColors.slice(0, labels.length)
            }],
            labels: labels
        }

        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.chart.data = data;

        this.state.chart.update();
    }

    render() {
        let expenses = 0;

        if( this.state.expenses !== undefined ) {
            expenses = this.state.expenses;

        }else if ( this.props.currentMonthExpenses.length !== 0) {

            expenses = this.props.currentMonthExpenses.filter((transaction) => {
                return formatDate(transaction.DATE) >= dateMinus(30)
            }).reduce((acc, curr) => acc + curr.AMOUNT, 0);
        }

        return (
            <div>
                <div>
                    <p>Gastos Mes</p>
                    {expenses.toLocaleString()}
                </div>
                <select onChange={this.myChartChange}>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="This Month">This Month</option>
                    <option value="This Year">This Year</option>
                </select>
                <div id="myChart-container">
                <canvas id="myChart"></canvas>
                </div>

            </div>
        )
    }
}

export default Analytics;