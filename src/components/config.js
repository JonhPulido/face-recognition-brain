console.log('Enviroment: '+process.env.NODE_ENV)
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://facer-recognition.herokuapp.com/'
  : 'https://facer-recognition.herokuapp.com/'

  //'https://facer-recognition.herokuapp.com/'
  //'http://localhost:3000'