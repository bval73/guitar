import React, { Component } from 'react';
import UserLayout from '../../../hoc/user';
import Formfield from '../../utils/Form/formfield';
import { update, generateData, isFormValid, populateOptionFields, resetFields } from '../../utils/Form/formActions';
import FileUpload from '../../utils/Form/fileupload';

//import Dialog from '@material-ui/core/Dialog';

import { connect } from 'react-redux';
import { getBrands, getWoods, addProduct, clearProduct } from '../../../actions/products_actions';

class AddProduct extends Component {

  state = {
    formError:false,
    formSuccess:false,
    formdata: {
      name: {
        element: 'input',
        value: '',
        config: {
          label: 'Product Model',
          name: 'name.input',
          type: 'text',
          placeholder: 'Enter product name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      description: {
        element: 'textarea',
        value: '',
        config: {
          label: 'Product Description',
          name: 'description.input',
          type: 'text',
          placeholder: 'Enter product description'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      price: {
        element: 'input',
        value: '',
        config: {
          label: 'Product Price',
          name: 'price.input',
          type: 'number',
          placeholder: 'Enter product price'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      brand: {
        element: 'select',
        value: '',
        config: {
          label: 'Product Brand',
          name: 'brand.input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      shipping: {
        element: 'select',
        value: '',
        config: {
          label: 'Product Shipping',
          name: 'shipping.input',
          options: [
            {key:true, value: 'Yes'},
            {key:false, value: 'No'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      available: {
        element: 'select',
        value: '',
        config: {
          label: 'Available, in stock',
          name: 'available.input',
          options: [
            {key:true, value: 'Yes'},
            {key:false, value: 'No'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      wood: {
        element: 'select',
        value: '',
        config: {
          label: 'Wood Material',
          name: 'wood.input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      frets: {
        element: 'select',
        value: '',
        config: {
          label: 'Frets',
          name: 'fret.input',
          options: [
            {key:20, value: 20},
            {key:21, value: 21},
            {key:22, value: 22},
            {key:24, value: 24}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      publish: {
        element: 'select',
        value: '',
        config: {
          label: 'Show on site',
          name: 'publish.input',
          options: [
            {key:true, value: 'Public'},
            {key:false, value: 'Hidden'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      images: {
        value:[],
        validation:{
          required: false
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: false
      }
//      user: {}
    }
  }
  
//TODO need to finish this up. 
  buildFormFields = () => {
    //flip through the object keys in the render to fill the form
    let formFieldsLength = Object.keys(this.state.formdata).length;
    // console.log('length is ', formFieldsLength);
    // console.log(Object.keys(this.state.formdata)[5]);
    // return (
    //   <Formfield 
    //     id={'name'}
    //     formdata={this.state.formdata.name}
    //     change={(element) => this.updateForm(element)}
    //   />
    // )
  }

  updateFields = (newFormData) => {
    this.setState({
      formdata: newFormData
    })
  }

  updateForm =(element) => {
    const newFormdata = update(element, this.state.formdata, 'product');
//    newFormdata['user'] = this.props.user.userData.user;
//console.log('newFormdata user is ', newFormdata['user']);    
    this.setState({
      formError: false,
      formdata: newFormdata
    })
  }

  resetFieldHandler = () => {
    const newFormData = resetFields(this.state.formdata, 'product');
    this.setState({
      formdata: newFormData,
      formSuccess: true
    });
    setTimeout(() => {
      this.setState({
        formSuccess: false
      })
    }, () => {
      this.props.dispatch(clearProduct())  
    },3000)
  }

  submitForm = (event) => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'product');
    let formIsValid = isFormValid(this.state.formdata, 'product');

    if(formIsValid) {
      this.props.dispatch(addProduct(dataToSubmit))
      .then((response) => {
        if(this.props.products.addProduct.success) {
          this.resetFieldHandler();
        } else {
          this.setState({formError: true})
//          console.log('data to submit add_product error', dataToSubmit);
//          console.log(response);
        }
      })
    } else {
      this.setState({formError: true})
    }
  }

  componentDidMount() {
    const formdata = this.state.formdata;

    this.props.dispatch(getBrands()).then( response => {
//      console.log('Brands ', this.props.products.brands);
      const newFormData = populateOptionFields(formdata, this.props.products.brands, 'brand');
      this.updateFields(newFormData);
    })

    this.props.dispatch(getWoods()).then( response => {
//      console.log('Woods ', this.props.products.woods);
      const newFormData = populateOptionFields(formdata, this.props.products.woods, 'wood');
      this.updateFields(newFormData);
    })
  }

  imagesHandler = (images) => {
    const newFormData = {
      ...this.state.formdata
    }
    newFormData['images'].value = images;
    newFormData['images'].valid = true;

    this.setState({
      formdata: newFormData
    })
  }

 
  render() {
//    this.buildFormFields();
    return (
      <UserLayout>
        <div>
          <h1>Add Product</h1>
          <form onSubmit={(event) => this.submitForm(event)}>
{
// finish function buildFormFields to clean up code ... 
}
            <FileUpload 
              imagesHandler={(images) => this.imagesHandler(images)}
              reset={this.state.formSuccess}
            />
            <Formfield 
              id={'name'}
              formdata={this.state.formdata.name}
              change={(element) => this.updateForm(element)}
            />
            <Formfield 
              id={'description'}
              formdata={this.state.formdata.description}
              change={(element) => this.updateForm(element)}
            />
            <Formfield 
              id={'price'}
              formdata={this.state.formdata.price}
              change={(element) => this.updateForm(element)}
            />

            <div className="form_devider"></div>

            <Formfield 
              id={'brand'}
              formdata={this.state.formdata.brand}
              change={(element) => this.updateForm(element)}
            />
            <Formfield 
              id={'shipping'}
              formdata={this.state.formdata.shipping}
              change={(element) => this.updateForm(element)}
            />
            <Formfield 
              id={'available'}
              formdata={this.state.formdata.available}
              change={(element) => this.updateForm(element)}
            />
            <div className="form_devider"></div>
            <Formfield 
              id={'wood'}
              formdata={this.state.formdata.wood}
              change={(element) => this.updateForm(element)}
            />
            <Formfield 
              id={'frets'}
              formdata={this.state.formdata.frets}
              change={(element) => this.updateForm(element)}
            />

            <div className="form_devider"></div>
            <Formfield 
              id={'publish'}
              formdata={this.state.formdata.publish}
              change={(element) => this.updateForm(element)}
            />

            { // TODO trigger a dialog popup to say it was a success then go to product page with product
              this.state.formSuccess ? 
                <div className="form_success">
                  Success
                </div>
              :null
            }

            {
              this.state.formError ?
              <div className="error_label">
                Please check the information entered!
              </div>
              : null
            }
            <button onClick={(event) => this.submitForm(event)}>Add Product</button>

          </form>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products
  }
}

export default connect(mapStateToProps)(AddProduct);