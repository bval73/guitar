import React from 'react';
import moment from 'moment';

const UserHistoryBlock = (props) => {

  const renderHistory = () => (

    props.products ?
      props.products.map((item, i) => (
        <tr key={i}>
          <td>{item.porder}</td>
          <td>{moment(item.dateOfPurchase).format("MM-DD-YYYY")}</td>
          <td>{item.brand} {item.name}</td>
          <td>${item.price}</td>
          <td>{item.quantity}</td>
        </tr>
      ))
    :<tr><td>You don't have any purchase history..</td></tr>

  )

  return (
    <div className="history_blocks">
      <table>
        <thead>
          <tr>
            <th>Purchase order#</th>
            <th>Date of Purchase</th>
            <th>Product</th>
            <th>Price paid</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {renderHistory()}
        </tbody>
      </table>
      
    </div>
  );
};

export default UserHistoryBlock;