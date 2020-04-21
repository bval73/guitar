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
} from '../actions/types';
 
export default function (state={}, action) {
  switch(action.type) {
    case REGISTER_USER:
      return {...state, registerSuccess: action.payload }

    case LOGIN_USER:
      return {...state, loginSuccess: action.payload }

    case AUTH_USER:
      return {...state, userData: action.payload }

    case ADD_TO_CART:
      return {...state, userData:{
          ...state.userData,
          cart: action.payload
      } }

    case GET_CART_ITEMS:
      return {...state, cartDetail: action.payload }

    case REMOVE_CART_ITEM:
      return {
        ...state, 
        cartDetail: action.payload.cartDetail,
        userData: {
          ...state.userData,
          cart: action.payload.cart
        } 
      }

      case ON_SUCCESS_BUY:
        return {
          ...state,
          successBuy: action.payload.success,
          userData: {
            ...state.userData,
            cart: action.payload.cart
          },
          cartDetail: action.payload.cartDetail
        }

      case LOGOUT_USER:
        return {...state}

      case UPDATE_USER:
        return {...state, updateUser: action.payload}
        
      case CLEAR_UPDATE_USER:
        return {...state, updateUser: action.payload}

    default:
      return state;
  }
}