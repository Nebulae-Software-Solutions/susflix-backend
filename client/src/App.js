import './App.css';
const axios = require('axios');

const aUrl =  axios.get('https://api.spoonacular.com/recipes/complexSearch?apiKey=866b5b6e90614cdcb597cf6d92717f4a&number=100&addRecipeInformation=true');
console.log(aUrl)

function App() {
  
  return (
    <div className="App">
      <h1>Henry Food</h1>
    </div>
  );
}

export default App;
