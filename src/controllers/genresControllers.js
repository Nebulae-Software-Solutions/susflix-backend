const { Movie } = require('../db.js')

const get = async (req, res) => {

    /* 
        // Initially, the plan was to just return the 'genres' column from the 'Movie' table:

        let genres = await Movie.findAll({
            attributes: ['genres'],
            raw: true,          // To return the raw data instead of the sequelize object.
        })
    
        // Genres is an array of objects. Each object has a property named "genres",
        // which is also an array of strings. We want to return only an array of strings.
        genres = genres
            .map(genre => genre.genres)                     // Array of arrays of strings.
            .flat()                                         // Array of strings.
            .sort()                                         // Sorted alphabetically.
            .filter(g => g != null)                         // Only valid genres.
    
        genres = [...new Set(genres)]                       // Remove duplicates.
     */

    const genres = [
        "Action",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "Film-Noir",
        "Game-Show",
        "History",
        "Horror",
        "Music",
        "Musical",
        "Mystery",
        "News",
        "Reality-TV",
        "Romance",
        "Sci-Fi",
        "Sport",
        "Talk-Show",
        "Thriller",
        "War",
        "Western"
    ]

    res.status(200).json(genres)

}


module.exports = {
    get,
}
