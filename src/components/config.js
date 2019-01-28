console.log(process.env.NODE_ENV)
export const API_URL = process.env.NODE_ENV === 'development'
  ? 'https://facer-recognition.herokuapp.com'
  : 'http://localhost:3000'