import React, { Component } from 'react';
import Button from '../utils/button';


import { connect } from 'react-redux';
import { addToCart } from '../../actions/user_actions';

class Card extends Component {

  renderCardImage(images) {
    if(images.length > 0) {
      return images[0].url;
    } else {
      return '/images/image_not_availble.png';
    }
  }

  render() {
    const props = this.props;

    return (
      <div className={`card_item_wrapper ${props.grid}`}>
        <div className="image"
          style={{
            background: `url(${this.renderCardImage(props.images)}) no-repeat`
          }}
        >
        </div>
        <div className="action_container">
          <div className="tags">
            <div className="brand">{props.brand.name}</div>
            <div className="name">{props.name}</div>
            <div className="name">${props.price}</div>
          </div>

          {
            props.grid ?
              <div className="description">
                <p>
                  {props.description}
                </p>
              </div>
            :null
          }
          <div className="actions">
            <div className="button_wrapp">
              <Button 
                type="default"
                altClass="card_link"
                title="View Product"
                linkTo={`/product_detail/${props._id}`}
                addStyles={{
                  margin: '10px 0 0 0'
                }}
              />
            </div>
            <div className="button_wrapp">
                <Button 
                  type="bag_link"
                  runAction={() => {
                    props.user.userData.isAuth ?
                      this.props.dispatch(addToCart(props._id))
                    :
                      //TODO need to let people know to log in first a modal with log in area would be a good idea.
                      console.log('You need to be signed in before you can add to the cart');
                  }}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Card);

