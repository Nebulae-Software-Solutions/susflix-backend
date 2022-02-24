const initialState = {
    movies: [],
    allmovies: [],
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_MOVIES':
            return {
                ...state,
                movies: action.payload,
                allmovies: action.payload
            }

        /*    case 'GET_NAME_RECIPES':
               return {
                   ...state,
                   recipes: action.payload
               }
           case 'GET_DIETS':
               return {
                   ...state,
                   diets: action.payload
               }
   
           case 'POST_RECIPE':
               return {
                   ...state,   //post no necesita-> crea en otra ruta
               }
   
           case 'FILTER_BY_DIET':
               const allRecipes = state.allRecipes //copia del estado
               const dietsFilter = action.payload === "All" ? allRecipes :
                   allRecipes.filter(recipe => {
                       let names = recipe.diets.map(d => d.name)
                       if (names.includes(action.payload)) return recipe
                       else return null;
                   })
               return {
                   ...state,
                   recipes: dietsFilter
               }
   
           case 'FILTER_BY_NAME':
               let orderName = action.payload === "asc" ?
                   state.recipes.sort(function (a, b) {     //sort-> compara y ordena izq o der d
                       if (a.name > b.name) return 1
                       if (b.name > a.name) return -1
                       return 0   //si son iguales
                   }) :
                   state.recipes.sort(function (a, b) {
                       if (a.name > b.name) return -1
                       if (b.name > a.name) return 1
                       return 0
                   })
               return {
                   ...state,
                   recipes: orderName
               }
   
   
   
           case 'FILTER_BY_SCORE':
               const recipesByScore = action.payload === 'asc' ?
                   state.recipes.sort((a, b) => {
                       if (a.healthScore > b.healthScore) return 1;
                       if (b.healthScore > a.healthScore) return -1;
                       return 0;
                   }) :
                   state.recipes.sort((a, b) => {
                       if (a.healthScore > b.healthScore) return -1;
                       if (b.healthScore > a.healthScore) return 1;
                       return 0;
                   });
               return {
                   ...state,
                   recipes: recipesByScore
               }
   
           case 'GET_DETAIL':
               return {
                   ...state,
                   detail: action.payload
               }
   
           case 'GET_CLEAN':
               return {
                   ...state,
                   datail: []
               } */

        default:
            return state
    }

}



export default rootReducer; 