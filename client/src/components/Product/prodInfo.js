import React, { Fragment } from 'react';
import Button from '../utils/button';

import FontAwsomeIcon from '@fortawesome/react-fontawesome';
import faTruck from '@fortawesome/fontawesome-free-solid/faTruck';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';

const ProdInfo = (props) => {

  const showProdTags = (detail) => (
    <div className="product_tags">
      {detail.shipping ? 
        <div className="tag">
          <div><FontAwsomeIcon icon={faTruck}></FontAwsomeIcon></div>
          <div className="tag_text">
            <div>Free Shipping</div>
            <div>And Return</div>
          </div>
        </div>
      :null
      }
     
      <div className="tag">
        <div><FontAwsomeIcon icon={detail.availale ? faCheck : faTimes}></FontAwsomeIcon></div>
        <div className="tag_text">
          {detail.availale ?
            <Fragment>
              <div>Available </div>
              <div>in store</div>
            </Fragment>
          :
            <Fragment>
              <div>Not Available </div>
              <div>in store</div>
            </Fragment>
          }
        </div>
      </div>
    </div>
  )

  const showProdActions = (detail) => (
    <div className="product_actions">
      <div className="price"> ${detail.price} </div>
      <div className="cart">
        <Button 
          type="add_to_cart_link"
          runAction={() => {
            props.addToCart(detail._id)
          }}
        />
      </div>
    </div>
  )

  const showProdSpecifications = (detail) => (
    <div className="product_specifications">
      <h2>Specs:</h2>
      <div>
        <div className="item">
          <strong>Frets:</strong> {detail.frets}
        </div>
        <div className="item">
          <strong>Wood:</strong> {detail.wood.name}
        </div>
      </div>
    </div>
  )

  const detail = props.detail;
  return (
    <div>
      <h1>{detail.brand.name} {detail.name}</h1>
      <p>
        {
          detail.description
        }
      </p>
      {showProdTags(detail)}
      {showProdActions(detail)}
      {showProdSpecifications(detail)}
    </div>
  );
};

export default ProdInfo;