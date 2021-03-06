const paramsNormalization = (params) => {

    var { title, year, genre, rating, order_by, sort, limit, page } = params

    if (!year ||                                    // If year is not defined.
        year.length == 0 ||                         // Or it is an empty string.
        typeof year != 'string' ||                  // Or it is not a valid string.
        year.split('-').length == 0 ||              // Or it does not have a valid delimiiter.
        year.split('-').map(Number).some(isNaN)     // Or some of its sectors can't be converted to numbers...
    ) year = [-1, 9999]                                // ...we then set it to an array of all possible years.
    // When the year is valid, we convert it from a string to an array of numbers:
    else if (year) year = year.split('-').map(Number)
    // If there is only one year, we need to convert it into an array of itself twice:
    if (year.length === 1) year = [year[0], year[0]]
    // If there are more than two years, we need to pick the smallest and the biggest:
    if (year.length > 2) year = [Math.min(...year), Math.max(...year)]

    // We also need to convert genre into an array of TitleCase strings:
    if (genre) genre = genre
        .split(',')
        .map(str => str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()))

    // We also need to convert rating into an array of numbers:
    if (rating) rating = rating.split('-').map(Number) || [0, 10]

    // We also need to convert page, limit, and offset from string to number and asign sensible defaults
    page = +page || 1
    limit = +limit || 50
    if (limit > 100) limit = 100

    // Now we calculate offset based on page and limit:
    const offset = (page - 1) * limit

    // We also need to verify order_by and sort are valid values:
    const validOrderBy = ['title', 'year', 'rating', 'runtime']
    order_by = validOrderBy.includes(order_by) ? order_by : 'rating'
    // And finally, assign a descending value to the sort variable in case it's ommitted or invalid:
    const validSort = ['asc', 'desc']
    sort = validSort.includes(sort) ? sort : 'desc'

    return { title, year, genre, rating, order_by, sort, limit, page, offset }

}

module.exports = paramsNormalization
