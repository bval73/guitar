import React, { Component } from 'react';
import Formfield from '../utils/Form/formfield';

import { connect } from 'react-redux';
import { updateUser, clearUpdateUser } from '../../actions/user_actions';

import { update, generateData, isFormValid, populateFields } from '../utils/Form/formActions';

class UpdatePersonalInfo extends Component {
  

  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: 'input',
        value: '',
        config: {
          name: 'name.input',
          type: 'text',
          placeholder: 'Enter your first name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          name: 'lastname.input',
          type: 'text',
          placeholder: 'Enter your last name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
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

  updateForm =(element) => {
    const newFormdata = update(element, this.state.formdata, 'update_user');
    console.log('updateForm ', newFormdata);
    this.setState({
      formError: false,
      formdata: newFormdata
    })
  }

  submitForm = (event) => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'update_user');
    let formIsValid = isFormValid(this.state.formdata, 'update_user');

    if(formIsValid) {
      this.props.dispatch(updateUser(dataToSubmit)).then(() => {
        if(this.props.user.updateUser.success) {
          this.setState({
            formSuccess: true
          },() => {
            setTimeout(() => {
              this.props.dispatch(clearUpdateUser());
              this.setState({
                formSuccess: false
              })
            },2000)
          })
        }
      })
    } else {
      this.setState({formError: true})
    }
  }

  componentDidMount() {
    const newFormData = populateFields(this.state.formdata, this.props.user.userData);

    this.setState({
      formdata: newFormData
    });

  }

  render() {
    return (
      <div>
        <form onSubmit={(event) => this.submitForm(event)}>
          <h2>Personal Information</h2>
          <div className="form_block_two">
            <div className="block">
              <Formfield 
                id={'name'}
                formdata={this.state.formdata.name}
                change={(element) => this.updateForm(element)}
              />
            </div>
            <div className="block">
              <Formfield 
                id={'lastname'}
                formdata={this.state.formdata.lastname}
                change={(element) => this.updateForm(element)}
              />
            </div>
          </div>
          <div>
            <Formfield 
              id={'email'}
              formdata={this.state.formdata.email}
              change={(element) => this.updateForm(element)}
            />
          </div>
          <div>
            {
              this.state.formSuccess ?
                <div className="form_success">Your information has been updated. </div>
              :null
            }
            {this.state.formError ?
              <div className="error_label">
                Please check the information entered!
              </div>
            : null
            }
            <button onClick={(event) => this.submitForm(event)}>Update Account</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(UpdatePersonalInfo);