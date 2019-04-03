import React from 'react';
import { API_URL } from '../config'
console.log('API URL: '+API_URL)

const initialState = {
	email: '',
	password: '',
	submitError : '',
	emailError : '',
	passError : '',
	formError : '',
}

class Signin extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}
	validateForm = () =>{
	 let emailError = '';
	 let passError = '';

		if(!this.state.email.includes("@")){
			emailError = 'Invalid email address'
		}
		if(this.state.password.length < 6){
			passError = 'At least 6 characters'
		}
		if(emailError|| passError){
			this.setState({emailError, passError})
			return false;
		}
		return true;
	}  
	onEmailChange = (event) => {
		this.setState({email: event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({password: event.target.value})
	}

	onSubmitSignIn = () => {
		const isValid = this.validateForm();
		if(isValid){
			fetch(`${API_URL}/signin`, {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password
				})
			})
			.then(response => response.json())
			.then(user => {
				if (user.id) {
					this.props.loadUser(user)
					this.props.onRouteChange('home');
				}else{
					this.setState({formError : user })
				}
			})
		}		
	}

	render() {
		const { onRouteChange } = this.props;
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
					<div className="measure">
						<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
							<legend className="f1 fw6 ph0 mh0">Sign In</legend>
							<div className="mt3">
								<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
								<input
									className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
									type="email"
									name="email-address"
									id="email-address"
									onChange={this.onEmailChange}
								/>
								<label>{this.state.emailError}</label>
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
								<label>{this.state.passError}</label>
							</div>
						</fieldset>
						<div className="">
							<input
								onClick={this.onSubmitSignIn}
								className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
								type="submit"
								value="Sign in"
							/>
						</div>
						<div className="lh-copy mt3">
							<p  onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
						</div>
						<label>{this.state.formError}</label>
					</div>
				</main>
			</article>
		);
	}
}

export default Signin;