import React from 'react';
import { API_URL } from '../config'

const initialState = {
  email: '',
  password: '',
  name: '',
  submitError : '',
  emailError : '',
  passError : '',
  nameError : '',
}
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  onEmailChange = (event) => {
    this.setState({email: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({password: event.target.value})
  }

 validateForm = () =>{
   let emailError = '';
   let nameError = '';
   let passError = '';

    if(!this.state.email.includes("@")){
      emailError = 'Invalid email address'
    }
    if(!this.state.name){
      nameError = 'Name cannot be blank'
    }
    if(this.state.password.length < 7){
      passError = 'At least 7 characters'
    }
    if(emailError || nameError || passError){
      this.setState({emailError,nameError, passError})
      return false;
    }
    return true;
  }

  onSubmitSignIn = () => {
    const isValid = this.validateForm();
    if(isValid){
    fetch(`${API_URL}/register`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      })
    })
      .then(response => response.json())
      .then(user => {
        if (user.id) {
          this.props.loadUser(user)
          this.props.onRouteChange('home');
        }else{
          this.setState({submitError : user })
        }
      })
      this.setState(initialState)
    }
  }
  render() {
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset ref="signUp" id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                />
                 <label> {this.state.nameError}</label>
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
                <label> {this.state.emailError}</label>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
                 <label> {this.state.passError}</label>
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
                id="btnSubmit"
              />
            </div>
            <label>{this.state.submitError}</label>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;