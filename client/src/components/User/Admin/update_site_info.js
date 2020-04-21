import React, { Component } from 'react';
import Formfield from '../../utils/Form/formfield';
import { update, generateData, isFormValid, populateFields } from '../../utils/Form/formActions';

import { connect } from 'react-redux';
import { getSiteData, updateSiteData } from '../../../actions/site_actions';

class UpdateSiteInfo extends Component {

  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      address: {
        element: 'input',
        value: '',
        config: {
          label: 'Address',
          name: 'address.input',
          type: 'text',
          placeholder: 'Enter the address of store'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      hours: {
        element: 'input',
        value: '',
        config: {
          label: 'Working Hours',
          name: 'hours.input',
          type: 'text',
          placeholder: 'Enter the working hours of store'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      phone: {
        element: 'input',
        value: '',
        config: {
          label: 'Phone',
          name: 'phone.input',
          type: 'phone',
          placeholder: 'Enter the phone number of store'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      email: {
        element: 'input',
        value: '',
        config: {
          label: 'Email',
          name: 'email.input',
          type: 'email',
          placeholder: 'Enter the email contact of store'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      }
    }
  }

  updateForm =(element) => {
    const newFormdata = update(element, this.state.formdata, 'site_info');
    
    this.setState({
      formError: false,
      formdata: newFormdata
    })
  }

  submitForm = (event) => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'site_info');
    let formIsValid = isFormValid(this.state.formdata, 'site_info');

    if(formIsValid) {
      this.props.dispatch(updateSiteData(dataToSubmit)).then(() => {
        this.setState({
          formSuccess: true
        }, () => {
          setTimeout(() => {
            this.setState({
              formSuccess: false
            })
          },2000)
        })
      })
    } else {
      this.setState({formError: true})
    }
  }

  componentDidMount() {
    this.props.dispatch(getSiteData()).then(() => {
      const newFormData = populateFields(this.state.formdata, this.props.site.siteData[0]);
      
      this.setState({
        formdata: newFormData
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Site information</h1>
        <form onSubmit={(event) => this.submitForm(event)}>
          <Formfield
            id={'address'}
            formdata={this.state.formdata.address}
            change={(element) => this.updateForm(element)}
          />
          <Formfield
            id={'hours'}
            formdata={this.state.formdata.hours}
            change={(element) => this.updateForm(element)}
          />
          <Formfield
            id={'phone'}
            formdata={this.state.formdata.phone}
            change={(element) => this.updateForm(element)}
          />
          <Formfield
            id={'email'}
            formdata={this.state.formdata.email}
            change={(element) => this.updateForm(element)}
          />

          <div>
            {
              this.state.formSuccess ?
                <div className="form_success">
                  Store information was updated!
                </div>
              :null
            }
            {this.state.formError ?
              <div className="error_label">
                Please check the information entered!
              </div>
              : null
            }
            <button onClick={(event) => this.submitForm(event)}>Update store information</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  return {
    site: state.site
  }
}

export default connect(mapStateToProps)(UpdateSiteInfo);
