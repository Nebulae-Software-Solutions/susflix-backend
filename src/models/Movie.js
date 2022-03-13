const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const tableName = 'movie'
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    imdb_code: { type: DataTypes.STRING, allowNull: true, },
    yt_trailer_code: { type: DataTypes.STRING, allowNull: true, },

    title: { type: DataTypes.STRING, allowNull: false, },
    title_long: { type: DataTypes.STRING, allowNull: false, },

    year: { type: DataTypes.INTEGER, allowNull: false, },
    rating: { type: DataTypes.DECIMAL, allowNull: false, },
    runtime: { type: DataTypes.INTEGER, allowNull: true, },

    language: { type: DataTypes.STRING, allowNull: false, },
    synopsis: { type: DataTypes.TEXT, allowNull: false, },
    description_full: { type: DataTypes.TEXT, allowNull: false, },
    genres: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, },

    small_cover_image: { type: DataTypes.STRING, allowNull: false },
    medium_cover_image: { type: DataTypes.STRING, allowNull: false },
    large_cover_image: { type: DataTypes.STRING, allowNull: false },
    background_image: { type: DataTypes.STRING, allowNull: false },
    background_image_original: { type: DataTypes.STRING, allowNull: false },
  }
  const options = { timestamps: false }


  sequelize.define(tableName, attributes, options)
}
