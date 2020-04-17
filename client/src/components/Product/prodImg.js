import React, { Component } from 'react';

import ImageLightbox from '../utils/lightbox';

class ProdImg extends Component {

  state = {
    lightbox: false,
    imagePos:0,
    lightboxImages:[]
  }

  componentDidMount() {
    let cnt = this.props.detail.images.length;
    const imgs = this.props.detail.images;

    if(cnt > 0) {
      let lightboxImages = [];

      imgs.forEach(item => {
        lightboxImages.push(item.url)
      })

      this.setState({
        lightboxImages
      })
    }
  }

  renderCardImage = (imgs) => {
    if(imgs.length > 0) {
      return imgs[0].url;
    } else {
      return '/images/image_not_availble.png';
    }
  }

  handleLightBox = (pos) => {
    const imgCnt = this.state.lightboxImages.length;

    if(imgCnt > 0) {
      this.setState({
        lightbox: true,
        imagePos: pos
      })
    }
  }

  handleLightBoxClose = () => {
    this.setState({
      lightbox: false
    })
  }

  showThumbs = () => (
    this.state.lightboxImages.map((item,i) => (
      i > 0 ?
        <div
        key={i}
        onClick={() => this.handleLightBox(i)}
        className="thumb"
        style={{background: `url(${item}) no-repeat`}}
        >
        </div>
      :null
    ))
  )

  render() {
    const {detail} = this.props;
    const imgs = detail.images;
    return (
      <div className="product_image_container">
        <div className="main_pic">
          <div
            style={{background: `url(${this.renderCardImage(imgs)}) no-repeat`}}
            onClick={() => this.handleLightBox(0)}
          >
          </div>
        </div>
        <div className="main_thumbs">
          { this.showThumbs()}
        </div>
        {
          this.state.lightbox ?
            <ImageLightbox 
              id={detail.id}
              images={this.state.lightboxImages}
              open={this.state.open}
              pos={this.state.imagePos}
              onclose={() => this.handleLightBoxClose()}
            />
          :null
        }
      </div>
    );
  }
}

export default ProdImg;