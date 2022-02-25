import './App.css';
import Home from './components/principal/home/Home';

function App() {

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;




/* const axios = require('axios');
const aUrl =  axios.get('https://yts.mx/api/v2/list_movies.json?sort=seeds&limit=50');
console.log(aUrl) */