import React, { Component } from 'react';
import axios from 'axios'

import Formfield from '../utils/Form/formfield';
import { update, generateData, isFormValid } from '../utils/Form/formActions';

class ResetUser extends Component {

  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email.input',
          type: 'email',
          placeholder: 'Enter your email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
    }
  }

  //TODO NEED TO PUT IN A COMPONENT BY ITSELF SINCE IT'S CALLED MORE THAN TWICE
  updateForm =(element) => {
    const newFormdata = update(element, this.state.formdata, 'reset_update');
    this.setState({
      formError: false,
      formdata: newFormdata
    })
  }

  submitForm = (event) => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'reset_update');
    let formIsValid = isFormValid(this.state.formdata, 'reset_update');

    if(formIsValid) {
      axios.post('/api/users/reset_user', dataToSubmit)
        .then(response => {
          if(response.data.success) {
            this.setState({
              formSuccess: true,
              formError: false
            })
          } else {
            this.setState({
              formSuccess: false,
              formError: true
            })
          }
        })
    } else {
      this.setState({
        formError: true
    })
  }
}

  render() {
    return (
      <div className="container">
        <h1>Reset Password</h1>
        <form onSubmit={(event) => this.submitForm(event)}>

        <Formfield 
          id={'email'}
          formdata={this.state.formdata.email}
          change={(element) => this.updateForm(element)}
        />

        {this.state.formSuccess ?
          <div className="form_success">
            An email has been sent please follow the link in email!
          </div>
        :null
        }


        {this.state.formError ?
          <div className="error_label">
            The email supplied cannot be found!
          </div>
          : null
        }
        <button onClick={(event) => this.submitForm(event)}>Reset Password</button>
        </form>

      </div>

    );
  }
}

export default ResetUser;