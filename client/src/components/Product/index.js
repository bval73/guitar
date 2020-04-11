import React, { Component } from 'react';
import PageTop from '../utils/page_top';

import { connect } from 'react-redux';
import { getProductDetail, clearProductDetail} from '../../actions/products_actions';


class ProductPage extends Component {

  componentDidMount () {
    const id = this.props.match.params.id;

    this.props.dispatch(getProductDetail(id));
  }


  render() {
    return (
      <div>
        Product Page
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products
  }
}

export default connect(mapStateToProps)(ProductPage);
