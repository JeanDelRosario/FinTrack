import React, { Component } from 'react';
import { Icon, Form, Segment, Button } from 'semantic-ui-react'
import './insert-info.css';

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

const options = [{ value: "Food and Drinks", text: "Food and Drinks" },
{ value: "Shopping", text: "Shopping" },
{ value: "Housing", text: "Housing" },
{ value: "Transportation", text: "Transportation" },
{ value: "Vehicle", text: "Vehicle" },
{ value: "Gas", text: "Gas" },
{ value: "PC", text: "PC" },
{ value: "Entertainment", text: "Entertainment" },
{ value: "Electronics", text: "Electronics" },
{ value: "Financial Expenses", text: "Financial Expenses" },
{ value: "Investmens", text: "Investmens" },
{ value: "Other", text: "Other" }]

class InsertInfo extends Component {

    componentDidMount() {
        this.props.activeItemInsertInfo();
    }
    render() {

        const tableBodyRows = [];
        const dbFinancialInfo = JSON.parse(JSON.stringify(this.props.dbFinancialInfo));

        for (let value of dbFinancialInfo) {
            let row = [];
            for (let key of Object.keys(value)) {
                if ((key !== 'EMAIL') & (key !== 'PRIMARY_INT')) {
                    if (key === 'DATE') value[key] = formatDate(value[key]);
                    if (key === 'AMOUNT') value[key] = value[key].toLocaleString();
                    if (value[key] === 'NAN') value[key] = "";
                    row.push(<div className={`table-body-item ${key.toLowerCase()}`}>{value[key]}</div>);
                }
            }
            row.push(<Icon name="delete" className="table-body-delete"
                id={value['PRIMARY_INT']}
                onClick={this.props.deleteItem} />)

            tableBodyRows.push(<div className='table-body-row'>{row}</div>);
        }

        return (
            <div className="insert-info">
                <div id="c">
                    <Form className="form-info" onSubmit={this.props.handleSubmit}>
                        <Segment >
                            <Form.Group widths='equal'>
                                <Form.Input onChange={this.props.handleTyping}
                                    icon='calendar' iconPosition='left'
                                    type="date" name="date" placeholder="Date..."
                                    value={this.props.date} required />
                                <Form.Select onChange={this.props.handleTyping}
                                    icon='columns' iconPosition='left'
                                    name="category"
                                    placeholder="Expense category" options={options} required />

                                <Form.Input onChange={this.props.handleTyping}
                                    icon="money bill alternate" iconPosition="left"
                                    type="number" name="amount" placeholder="Amount"
                                    value={this.props.amount} required />
                            </Form.Group>
                            <Form.Input onChange={this.props.handleTyping}
                                icon="pencil alternate" iconPosition="left"
                                type="text" name="description"
                                value={this.props.description} placeholder="Description" />

                            <Button>Submit</Button>
                        </Segment>
                    </Form>
                </div>
                <div className="table">
                    <div className="table-header">
                        <div className="table-header-item">Fecha</div>
                        <div className="table-header-item">Transaction</div>
                        <div className="table-header-item">Amount</div>
                        <div className="table-header-item">Description</div>
                    </div>

                    <div className="table-body">
                        {tableBodyRows}
                    </div>
                </div>
            </div>
        )
    }
}

export default InsertInfo;