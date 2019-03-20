import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

// configuration for particles lib (background)
const particlesOptions = {
        particles: {
          numbers: {
            value: 30
          },
          density: {
            enable: true,
            value_area: 800
          }
        }
      };

const defaultImage = 'https://www.thesun.co.uk/wp-content/uploads/2016/04/1807626.main_image.jpg?strip=all&w=620&h=413&crop=1';

const url ='https://frozen-depths-91991.herokuapp.com'

const initalState = {
  input: defaultImage,
  imageUrl: '',
  boxes:[],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor(){
    super();
    this.state = initalState;
  }

  // componentDidMount(){
  //   fetch('http://localhost:3001/')
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  // }

  loadUser = (data) => {
    const { id, name, email, entries, joined } = data;
    this.setState({ user: {
        id: id,
        name: name,
        email: email,
        entries: entries,
        joined: joined
      }
    });
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const retVal = data.outputs[0].data.regions.map( (element) => {
      let clarifaiFace = element.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
    return retVal;
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // call ai-api
  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});

    fetch(url+'/imageurl',{ 
      method:'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then((response) => {
      if (response) {
        fetch(url+'/image',{ 
          method:'put',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count } ))
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch((err) => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signedout'){
      this.setState(initalState);
    } else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { input, imageUrl, route, boxes, isSignedIn } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? 
          <div>
              <Logo />
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onPictureSubmit={this.onPictureSubmit}
                input={input}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
            </div>
          : (
              route === 'signin'
              ?
              <Signin 
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
                url={url}
              />
              :
              <Register 
                onRouteChange={this.onRouteChange} 
                loadUser={this.loadUser}
                url={url}
              />
            )
        }
      </div>
    );
  }
}

export default App;
