import axios from 'axios';
import { LOGIN_USER,
         REGISTER_USER,
         AUTH_USER,
         LOGOUT_USER,
         UPDATE_USER,
         CLEAR_UPDATE_USER,
         ADD_TO_CART,
         GET_CART_ITEMS,
         REMOVE_CART_ITEM,
         ON_SUCCESS_BUY
} from './types';

import { USER_SERVER, PRODUCT_SERVER } from '../components/utils/misc';


export function loginUser(dataToSubmit) {
  const request = axios.post(`${USER_SERVER}/login`, dataToSubmit)
      .then(response => response.data);

      return {
        type: LOGIN_USER,
        payload: request
      }
}

export function registerUser(dataToSubmit) {
  const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
    .then(response => response.data);
    
    return {
      type: REGISTER_USER,
      payload: request
    }
}

export function auth() {
  const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
      type: AUTH_USER,
      payload: request
    }
}

export function logoutUser() {
  const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

  return {
    type: LOGOUT_USER,
    payload: request
  }
}

export function addToCart(_id) {

  const request = axios.post(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then(response => response.data )
  
  return {
    type: ADD_TO_CART,
    payload: request
  }
}

//prepare for the user cart page
export function getCartItems(cartItems, userCart) {

  const request = axios.get(`${PRODUCT_SERVER}/articles_by_id?id=${cartItems}&type=array`)
    .then(response => {
      
      userCart.forEach(item => {
        response.data.forEach((k,i) => {
          if(item.id === k._id) {
            response.data[i].quantity = item.quantity;
          }
        })
      });
      return response.data;
    })
  
  return {
    type: GET_CART_ITEMS,
    payload: request
  }
}

export function removeCartItem(id) {

  const request = axios.get(`${USER_SERVER}/RemoveFromCart?_id=${id}`)
    .then(response => {
      response.data.cart.forEach(item => {
        response.data.cartDetail.forEach((k,i) => {
          if(item.id === k._id) {
            response.data.cartDetail[i].quantity = item.quantity;
          }
        })
      })
      return response.data;
    })

  return {
    type: REMOVE_CART_ITEM,
    payload: request
  }
}

export function onSuccessBuy(data) {

  const request = axios.post(`${USER_SERVER}/successBuy`, data)
                    .then(response => response.data);

  return {
    type: ON_SUCCESS_BUY,
    payload: request
  }
}

export function updateUser(data) {

  const request = axios.post(`${USER_SERVER}/update_profile`, data)
          .then(response => {
            return response.data
          });

  return {
    type: UPDATE_USER,
    payload: request
  }
}

export function clearUpdateUser() {
  return {
    type: CLEAR_UPDATE_USER,
    payload:''
  }
}

