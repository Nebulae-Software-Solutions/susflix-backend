import axios from 'axios';

export function getMovies() {

  return async function (dispatch) {
    let json = await axios.get("https://c398e4e3de4365.lhrtunnel.link/movies");
    return dispatch({
      type: 'GET_MOVIES',
      payload: json.data

    })
    
  }

};

