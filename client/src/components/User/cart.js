import React, { Component } from 'react';
import UserLayout from '../../hoc/user';
import UserProductBlock from '../utils/User/product_block';

import { connect } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../actions/user_actions';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faFrown from '@fortawesome/fontawesome-free-solid/faFrown';
import faSmile from '@fortawesome/fontawesome-free-solid/faSmile';

import Paypal from '../utils/paypal';

// secrete 
//EIutPyFswcubU8OxdvrIAZZNyTmm0TACHdpEF2Vn8pAQW9yJf49RKO1fmNDNLp-O_qmSSyHRGhTbU3IW

//Client Id
///Af3xdg2qnVGjCztbQbVdX3MbWLmgAYI3G8q_bBhjzqNmprEQejtNEvq3BcETTSKKbuS8g6Vvq_T6O8-y

class UserCart extends Component {

  state = {
    loading: true,
    total: 0,
    showTotal: false,
    showSuccess: false
  }

  componentDidMount() {
    let cartItems = [];
    let user = this.props.user;
    let cart = user.userData.cart;
    let cartDetail;
   

    if(cart) {
      if(cart.length > 0) {
        cart.forEach(item => {
          cartItems.push(item.id)
        });
        this.props.dispatch(getCartItems(cartItems, cart))
          .then(() => {
            cartDetail = this.props.user.cartDetail
            if(cartDetail.length > 0) {
              this.calculateTotal(cartDetail)
            }
          })

      }
    }
  }

  calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.forEach(item => {
      total += parseInt(item.price, 10) * item.quantity;
    })

    this.setState({
      total,
      showTotal: true
    })

  }

  removeFromCart = (id) => {
    this.props.dispatch(removeCartItem(id))
      .then(() => {
        if(this.props.user.cartDetail.length <= 0) {
          this.setState({
            showTotal: false
          })
          this.props.history.push('/shop');
        } else {
          this.calculateTotal(this.props.user.cartDetail);
        }
      })
  }

  showNoItemsMessage = () => (
    <div className="cart_no_items">
      <FontAwesomeIcon icon={faFrown} />
      <div>
        You have no items in your cart.
      </div>
    </div>
  )

  transactionError = (data) => {
    console.log('transactionError ', data);
  }

  transactionCanceled = (data) => {
    console.log('transactionCanceled ', data);
  }

  transactionSuccess = (data) => {
    this.props.dispatch(onSuccessBuy({
      cartDetail: this.props.user.cartDetail,
      paymentData: data
    })).then(() => {
      if(this.props.user.successBuy) {
        this.setState({
          showTotal: false,
          showSuccess: true
        })
      }
    })
  }
    

  render() {
    return (
      <UserLayout>
        <div>
          <h1>My Cart</h1>
          <div className="user_cart">
            <UserProductBlock 
              products={this.props.user}
              type="cart"
              removeItem={((id) => this.removeFromCart(id))}
            />

            {
              this.state.showTotal ?
                <div>
                  <div className="user_cart_sum">
                    <div>
                      Total amount: ${this.state.total}
                    </div>
                  </div>
                </div>
              :
                this.state.showSuccess ?
                  <div className="cart_success"> 
                    <FontAwesomeIcon icon={faSmile} />
                    <div>
                      THANK YOU
                    </div>
                    <div>
                      Your order has been compleated. 
                    </div>
                  </div>
                :
                  this.showNoItemsMessage()
            }
          </div>
          {
            this.state.showTotal ?
              <div className="paypal_button_container">
                <Paypal 
                  toPay={this.state.total}
                  transactionError={(data) => this.transactionError(data)}
                  transactionCanceled={(data) => this.transactionCanceled(data)}
                  onSuccess={(data) => this.transactionSuccess(data)}
                />
              </div>
            :null
          }
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}


export default connect(mapStateToProps)(UserCart);