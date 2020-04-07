import React, { Component } from 'react';
import PageTop from '../utils/page_top';
import { frets, prices } from '../utils/Form/fixed_categories';

import { connect } from 'react-redux';
import { getProductsToShop, getBrands, getWoods } from '../../actions/products_actions';

import CollapseCheckbox from '../utils/collapseCheckbox';
import CollapseRadio from '../utils/collapseRadio';

class Shop extends Component {

  state = {
    grid:'',
    limit:6,
    skip:0,
    filters: {
      brands: [],
      frets: [],
      woods: [],
      prices: []
    }
  }

  componentDidMount() {
    this.props.dispatch(getBrands()); 
    this.props.dispatch(getWoods());

    this.props.dispatch(getProductsToShop(
      this.state.skip,
      this.state.limit,
      this.state.filters
    ))

  }

  handlePrice = (value) => {
    const data = prices;
    let array = [];

    for(let key in data) {
      if(data[key]._id === parseInt(value,10)) {
        array = data[key].array;
      }
    }
    return array;
  }

  handleFilters = (filters, category) => {
    const newFilters = {...this.state.filters}
    newFilters[category] = filters;

    if(category === "prices") {
      let priceValues = this.handlePrice(filters)
      newFilters[category] = priceValues;
    }

    this.setState({
      filters: newFilters
    })

  }

  render() {
//    const products = this.props.products;
    console.log('filters ', this.state.filters)
//    console.log('the price ', prices)
    const brands = this.props.products.brands ? this.props.products.brands.brands : null;
    const woods = this.props.products.woods ? this.props.products.woods.woods : null;

    return (
      <div>
        <PageTop title="Browse Products"/>
        <div className="container">
          <div className="shop_wrapper">
            <div className="left">
              <CollapseCheckbox
                initState={false}
                title="brands"
                list={brands}
                handleFilters={(filters) => this.handleFilters(filters,'brands')}
              />
              <CollapseCheckbox
                initState={false}
                title="frets"
                list={frets}
                handleFilters={(filters) => this.handleFilters(filters,'frets')}
              />
              <CollapseCheckbox
                initState={false}
                title="woods"
                list={woods}
                handleFilters={(filters) => this.handleFilters(filters,'woods')}
              />
              <CollapseRadio
                initState={true}
                title="price"
                list={prices}
                handleFilters={(filters) => this.handleFilters(filters,'prices')}
              />
            </div>
            <div className="right">
              right
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products
  }
}

export default connect(mapStateToProps)(Shop);
