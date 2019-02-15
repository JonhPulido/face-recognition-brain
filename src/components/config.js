console.log('Enviroment: '+process.env.NODE_ENV)
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:3000'
  : 'http://localhost:3000'

  //'https://facer-recognition.herokuapp.com/'
  //'http://localhost:3000'