const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const tableName = 'movie'
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    imdb_code: { type: DataTypes.STRING, allowNull: true, },
    yt_trailer_code: { type: DataTypes.STRING, allowNull: true, },

    title: { type: DataTypes.STRING, allowNull: false, },
    title_long: { type: DataTypes.STRING, allowNull: true, },

    year: { type: DataTypes.INTEGER, allowNull: true, },
    rating: { type: DataTypes.DECIMAL, allowNull: true, },
    runtime: { type: DataTypes.INTEGER, allowNull: true, },

    language: { type: DataTypes.STRING, allowNull: true, },
    synopsis: { type: DataTypes.TEXT, allowNull: true, },
    description_full: { type: DataTypes.TEXT, allowNull: true, },
    genres: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, },

    small_cover_image: { type: DataTypes.STRING, allowNull: true },
    medium_cover_image: { type: DataTypes.STRING, allowNull: true },
    large_cover_image: { type: DataTypes.STRING, allowNull: true },
    background_image: { type: DataTypes.STRING, allowNull: true },
    background_image_original: { type: DataTypes.STRING, allowNull: true },
  }
  const options = { timestamps: false }


  sequelize.define(tableName, attributes, options)
}
