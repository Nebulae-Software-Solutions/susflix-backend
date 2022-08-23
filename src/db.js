const fs = require('fs')
const path = require('path')
const {
  DATABASE_URL,
  DB_USER,
  DB_PASSWORD,
  DB_HOST
} = process.env
const { Sequelize } = require('sequelize')


const isGitpod = !!fs.existsSync('/ide/bin/gitpod-code')
const isHeroku = !!process.env.DATABASE_URL?.includes('amazonaws')
const isElephantSQL = !!process.env.DATABASE_URL?.includes('elephantsql')
const sequelizeUrl = isElephantSQL ? `${DATABASE_URL}` :
  isHeroku ? `${DATABASE_URL}?sslmode=no-verify` :
    isGitpod ? `postgres://gitpod:gitpod@localhost:5432/movies?sslmode=disable` :
      `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/movies?sslmode=disable`


console.log(`isHeroku: ${isHeroku}`)
console.log(`isGitpod: ${isGitpod}`)
console.log(`Using database url: ${sequelizeUrl}`)

const sequelize = new Sequelize(sequelizeUrl, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  "dialect": "postgres",
  "dialectOptions": {
    "ssl": true,
    "rejectUnauthorized": false
  }
})

const basename = path.basename(__filename)

const modelDefiners = []

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)))
  })

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize))
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models)
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]])
sequelize.models = Object.fromEntries(capsEntries)

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { User, Movie } = sequelize.models

Movie.belongsToMany(User, { through: 'user_movie' })
User.belongsToMany(Movie, { through: 'user_movie' })

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
  isHeroku: isHeroku,
}
