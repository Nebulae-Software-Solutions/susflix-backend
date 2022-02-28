const { Movie } = require('../db');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

const get = async (req, res) => {

    var { title, year, genre, rating, order_by, sort, limit, page } = req.query;

    // We need to make sure that year can be converted to an array of numbers.
    // If that's not the case, we need to set it to an array of all possible numbers.
    if (!year ||                                    // If year is not defined.
        year.length == 0 ||                         // Or it is an empty string.
        typeof year != 'string' ||                  // Or it is not a valid string.
        year.split('-').length == 0 ||              // Or it does not have a valid delimiiter.
        year.split('-').map(Number).some(isNaN)     // Or some of its sectors can't be converted to numbers...
    ) year = [-1, 9999];                                // ...we then set it to an array of all possible years.
    // When the year is valid, we convert it from a string to an array of numbers:
    else if (year) year = year.split('-').map(Number);
    // If there is only one year, we need to convert it into an array of itself twice:
    if (year.length === 1) year = [year[0], year[0]];
    // If there are more than two years, we need to pick the smallest and the biggest:
    if (year.length > 2) year = [Math.min(...year), Math.max(...year)];

    // We also need to convert genre into an array of TitleCase strings:
    if (genre) genre = genre
        .split(',')
        .map(str => str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()));

    // We also need to convert rating into an array of numbers:
    if (rating) rating = rating.split('-').map(Number) || [0, 10];

    // We also need to convert page, limit, and offset from string to number and asign sensible defaults
    page = +page || 1;
    limit = +limit || 50;

    // Now we calculate offset based on page and limit:
    const offset = (page - 1) * limit;

    // And finally, assign a descending value to the sort variable in case it's ommitted
    sort = sort?.length > 2 ? sort : 'desc'


    // ####################################################
    // Options for the database query:
    const where = {};

    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (year) where.year = { [Op.between]: year };
    if (genre) where.genres = { [Op.overlap]: genre };
    if (rating) where.rating = { [Op.between]: rating };

    try {
        const movies = await Movie.findAll({
            where,
            // We need to sort the movies by the order_by parameter, and in the direction of the sort parameter
            order: order_by && sort && [sequelize.literal(`${order_by} ${sort}`)], // Just so we don't receive only one of them
            limit,
            offset,
        })

        res.json(movies);
    } catch (error) {
        console.log("Something went wrong: ");
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    // get: memoGet,
    get,
}
