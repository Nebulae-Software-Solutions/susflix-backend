const bcrypt = require('bcryptjs')
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    
    const tableName = 'User'
    const attributes = {
        firstName: { type: DataTypes.STRING, allowNull: false, unique: false, },
        lastName: { type: DataTypes.STRING, allowNull: false, unique: false, },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true, }, },
        password: { type: DataTypes.STRING, allowNull: false, },
    }
    
    const User = sequelize.define(tableName, attributes)

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password)
    }

    User.addHook('beforeCreate', (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    })

    return User
}
