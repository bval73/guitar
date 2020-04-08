import React from 'react';
import CardBlockShop from '../utils/card_block_shop';
import { GET_PRODUCTS_TO_SHOP } from '../../actions/types';

const LoadmoreCards = (props) => {
  return (
    <div>
      <div>
        <CardBlockShop 
          grid={props.grid}
          list={props.products}
        />
      </div>
    </div>
  );
};

export default LoadmoreCards;