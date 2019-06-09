import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react'
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

class InsertInfo extends Component {

    componentDidMount() {
        this.props.activeItemInsertInfo();
    }
render() {

    const tableBodyRows = [];
    const dbFinancialInfo = JSON.parse(JSON.stringify(this.props.dbFinancialInfo));

    for(let value of dbFinancialInfo ) {
        let row = [];
        for(let key of Object.keys(value) ) {
            if( (key !== 'EMAIL') & (key !== 'PRIMARY_INT') ) {
                if(key === 'DATE') value[key] = formatDate(value[key]);
                if(key === 'AMOUNT') value[key] = value[key].toLocaleString();
                if(value[key] === 'NAN' ) value[key] = "";
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
            <form className="form-info" onSubmit={this.props.handleSubmit}>
                <input onChange={this.props.handleTyping}
                    type="date" name="date" placeholder="Date..."
                    value={this.props.date} required/>
                 <select onChange={this.props.handleTyping} name="category" required>
                    <option value="Food and Drinks" selected>Food and Drinks</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Housing">Housing</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Gas">Gas</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="PC">PC</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Financial Expenses">Financial Expenses</option>
                    <option value="Investmens">Investmens</option>
                    <option value="Other">Other</option>
                </select> 
                <input onChange={this.props.handleTyping}
                    type="number" name="amount" placeholder="Amount..."
                    value={this.props.amount} required />
                <input onChange={this.props.handleTyping}
                    type="text" name="description"
                    value={this.props.description} placeholder="Description..." />

                <button>Submit</button>
            </form>
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