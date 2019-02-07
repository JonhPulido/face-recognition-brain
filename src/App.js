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
import img from './files/images/german1.jpg';
import img2 from './files/images/german2.jpg';
import { API_URL } from './components/config';
import Notifications, { notify } from 'react-notify-toast';

require('dotenv').config();

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: 'f2713fade2dd431395deae7a9c4db24a'
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
let urls = [
  { img : img,
    name : "First Image"} ,
  { img : img2,
    name : "Second Image" }, 
];
const toastColor = { 
  background: '#505050', 
  text: '#fff' 
}

class App extends Component {
  constructor() {
    super();
    this.state = {
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
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('https://facer-recognition.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
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
    this.setState({ uploading: true })
   
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
      let photos = urls
      photos.push(
        { img : image[0].secure_url,
          name : "new Image Uploaded"}
      )
      this.onInputChange(image[0].secure_url)
    })
    .catch(err => {
      err.json().then(e => {
        this.toast(e.message, 'custom', 2000, toastColor)
        this.setState({ uploading: false })
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
					<Gallery 
						imageArray={urls}
						addPic={this.addImage}
					/>
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
