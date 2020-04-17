import React, { Component } from 'react';

import PaypalExpressBtn from 'react-paypal-express-checkout';


class Paypal extends Component {
  render() {
// documentation is at https://github.com/thinhvo0108/react-paypal-express-checkout
    const onSuccess = (payment) => {
      this.props.onSuccess(payment);
      
      //console.log("Payment successful!", JSON.stringify(payment));

      // {"paid":true,
      //   "cancelled":false,
      //   "payerID":"ALEQ76BNTU6G4",
      //   "paymentID":"PAYID-L2MKTYQ7SR58734S98925335","paymentToken":"EC-78719027ND224074B",
      //   "returnUrl":"https://www.paypal.com/checkoutnow/error?paymentId=PAYID-L2MKTYQ7SR58734S98925335&token=EC-78719027ND224074B&PayerID=ALEQ76BNTU6G4",
      //   "address":{"recipient_name":
      //     "John Doe",
      //     "line1":"1 Main St",
      //     "city":"San Jose",
      //     "state":"CA",
      //     "postal_code":"95131",
      //     "country_code":"US"},
      //   "email":"sb-puutm1476982@personal.example.com"
      // }
		}

		const onCancel = (data) => {
      this.props.transactionCanceled(data);
      console.log('Payment cancelled!', JSON.stringify(data));
			// {
      //   "paymentToken":"EC-8PW26416CN921283P",
      //   "paymentID":"PAYID-L2MKTCY3GR391754J417300J",
      //   "intent":"sale",
      //   "billingID":"EC-8PW26416CN921283P",
      //   "cancelUrl":"https://www.paypal.com/checkoutnow/error?token=EC-8PW26416CN921283P",
      //   "button_version":"2.1.93"
      // }
		}

		const onError = (err) => {
			// The main Paypal script could not be loaded or something blocked the script from loading
			console.log("Error!", JSON.stringify(err));
    }
    
    let env = 'sandbox'; 
		let currency = 'USD'; 
		let total = this.props.toPay;  

		const client = {
			sandbox:    'Af3xdg2qnVGjCztbQbVdX3MbWLmgAYI3G8q_bBhjzqNmprEQejtNEvq3BcETTSKKbuS8g6Vvq_T6O8-y',
			production: 'YOUR-PRODUCTION-APP-ID',
		}
		

    return (
      <div>
        <PaypalExpressBtn 
            env={env} 
            client={client} 
            currency={currency} 
            total={total} 
            onError={onError} 
            onSuccess={onSuccess} 
            onCancel={onCancel} 
            style={{
              size:'large',
              color: 'blue',
              shape: 'rect',
              label: 'checkout'
            }}
        />
      </div>
    );
  }
}

export default Paypal;