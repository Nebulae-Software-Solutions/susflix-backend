const { Movie, User } = require('../db');

const allDbData = async () => {

    return await Movie.findAll({
        attributes: ['id', 'imdb_code', 'title', 'title_long', 'year', 'rating', 'runtime', 'genres', 'synopsis', 'description_full', 'yt_trailer_code', 'language', 'background_image', 'background_image_original', 'small_cover_image', 'medium_cover_image', 'large_cover_image'],
    })
};

module.exports = {

    allDbData

};