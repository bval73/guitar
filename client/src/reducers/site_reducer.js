import { 
  GET_SITE_INFO,
  UPDATE_SITE_INFO
} from '../actions/types';

export default function (state={}, action) {
  switch(action.type) {
    case GET_SITE_INFO:
      return {...state, siteData: action.payload}

    case UPDATE_SITE_INFO:
      return {...state, siteData: action.payload.siteInfo}
      
    default:
      return state;
  }
}