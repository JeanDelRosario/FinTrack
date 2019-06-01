import React, { Component } from 'react';

import './insert-info.css';

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

class InsertInfo extends Component {



render() {

    const tableBodyItems = [];
    const dbFinancialInfo = JSON.parse(JSON.stringify(this.props.dbFinancialInfo));

    for(let value of dbFinancialInfo ) {
        for(let key of Object.keys(value) ) {
            if( (key !== 'EMAIL') & (key !== 'PRIMARY_INT') ) {
                if(key === 'DATE') value[key] = formatDate(value[key]);
                tableBodyItems.push(<div className='table-body-item'>{value[key]}</div>);
            }
        }
        tableBodyItems.push(<button className="table-body-delete"
                            id={value['PRIMARY_INT']}
                            onClick={this.props.deleteItem}>Delete</button>)
    }

    return (
        <div className="insert-info">
            <form onSubmit={this.props.handleSubmit}>
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

            <div className="table">
                <div className="table-header">
                    <div className="table-header-item">Fecha</div>
                    <div className="table-header-item">Transaction</div>
                    <div className="table-header-item">Amount</div>
                    <div className="table-header-item">Description</div>
                </div>

                <div className="table-body">
                    {tableBodyItems}
                </div>
            </div>
        </div>
    )
}
}

export default InsertInfo;