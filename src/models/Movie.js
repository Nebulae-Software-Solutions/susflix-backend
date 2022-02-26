const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('movie', {
    id: {
      type: DataTypes.INTEGER,
      // type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    imdb_code: {
      type: DataTypes.STRING,
      allowNull: true,
      },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    title_long: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rating: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },

    runtime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    genres: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

    synopsis: {
      type: DataTypes.TEXT,
      // type: DataTypes.STRING,
      allowNull: false,
    },

    description_full: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    yt_trailer_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    background_image: {
      type: DataTypes.STRING,
      allowNull: false
    },

    background_image_original: {
      type: DataTypes.STRING,
      allowNull: false
    },

    small_cover_image: {
      type: DataTypes.STRING,
      allowNull: false
    },

    medium_cover_image: {
      type: DataTypes.STRING,
      allowNull: false
    },

    large_cover_image: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    timestamps: false
  });
};
