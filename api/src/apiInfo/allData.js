const axios = require('axios');
const { Movie, User } = require('../db');

require('dotenv').config();

const allApiData = async () => {

    const aUrl = await axios.get('https://yts.mx/api/v2/list_movies.json?sort=seeds&limit=50');
    const aInfo = await aUrl.data.data.movies.map(e => {

        return {
            id: e.id,
            name: e.title_english,
            year: e.year,
            rating: e.rating,
            genres: e.genres,
            synopsis: e.synopsis,
            image: e.medium_cover_image,
        }
    })

    return aInfo

};


/* const allDbData = async () => {

    return await Recipe.findAll({

        include: {              
            model: Diet,        
            attributes: ['name'],
            through: {
                attributes: []   
            }
        }

    })

}; */

const allData = async () => {

    const apiData = await allApiData();
    /* const dbData = await allDbData(); */
    const allDataContainer = apiData/* .concat(dbData); */

    return allDataContainer

}; 


module.exports = {

     allData,/*
    allDbData, */
    allApiData

};