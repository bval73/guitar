import React from 'react';
import Card from '../utils/card';

const CardblockShop = (props) => {

  const renderCards = () => (
    props.list ?
      props.list.map(card => (
        <Card 
          key={card._id}
          {...card}
          grid={props.grid}
        />
      ))
    :null
  )

  return (
    <div className="card_block_shop">
      <div>
        <div>
          {
            props.list ?
              props.list.length === 0 ?
                <div>
                  Sorry there were no results.
                </div>
              :null
            :null
          }
          { renderCards(props.list)}
        </div>
      </div>
    </div>
  );
};

export default CardblockShop;