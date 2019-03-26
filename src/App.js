import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Gallery from './components/Gallery/Gallery'
import './App.css';
import { API_URL } from './components/config';
import Notifications, { notify } from 'react-notify-toast';

require('dotenv').config();

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: 'f6076453971f40e9925a89d743b5d0a4'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const toastColor = { 
  background: '#505050', 
  text: '#fff' 
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      errors: '',
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    if(event.target){
    this.setState({input: event.target.value});
  }else{
    this.setState({input: event});
    this.setState({imageUrl: event});
  }
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    this.setState({errors : ''});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
       const obj = response.outputs[0].data;
       const hasFace  = Object.entries(obj).length === 0 && obj.constructor === Object
        if (!hasFace) {
          console.log('holiii')
          fetch(`${API_URL}/image-save`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
              image_url: this.state.input
            })
          });
          fetch(`${API_URL}/image`, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

          this.displayFaceBox(this.calculateFaceLocation(response))
        }else {throw new Error ('We cant detect any faces on that image')}
      })
      .catch(err => this.setState({errors : err.toString()}));
  }

  onRouteChange = (route) => {
    this.setState({imageUrl: ''})
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toast = notify.createShowQueue()

  onChange = e => {
    const errs = [] 
    const files = Array.from(e.target.files)
    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    files.forEach((file, i) => {

      if (types.every(type => file.type !== type)) {
        errs.push(`'${file.type}' is not a supported format`)
      }

      if (file.size > 150000) {
        errs.push(`'${file.name}' is too large, please pick a smaller file`)
      }
      formData.append(i, file)
    })

    if (errs.length) {
      return errs.forEach(err => this.toast(err, 'custom', 2000, toastColor))
    }
    formData.append('id', 1)
   
   fetch(`${API_URL}/image-upload`, {
      method: 'POST',
      body: formData
      
    })
    .then(res => {
      if (!res.ok) {
        throw res
      }
      return res.json()
    })
    .then(image => {
      this.onInputChange(image[0].secure_url)
    })
    .catch(err => {
      err.json().then(e => {
        this.toast(e.message, 'custom', 2000, toastColor)
      })
    })
  }
  

  renderSwitch = (param) =>{
	const { imageUrl, box } = this.state;  
    switch(param) {
		case 'register':
		case 'signout':
			return <div>  
					<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
				</div>;
		case 'signin':
		return <div>  
				<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
				</div>;	   
		case 'gallery':
			return <div>  
					<Gallery />
				</div>;   
		case 'home':
			return <div>
					<Logo />
					<Rank
						name={this.state.user.name}
						entries={this.state.user.entries}
					/>
					<ImageLinkForm
						onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            onChange={this.onChange}
					/>
          <label>{this.state.errors}</label>
					<FaceRecognition box={box} imageUrl={imageUrl} />
					</div>       
		default:
			return 'foo';
    }
  };

  render() {
    const { isSignedIn, route} = this.state;
    return (
      <div className="App">
         <Notifications />
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
		{this.renderSwitch(route)}
      </div>
    );
  }
}

export default App;
