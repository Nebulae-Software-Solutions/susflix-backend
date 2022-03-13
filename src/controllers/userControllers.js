const { User } = require('../db')

const post = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const newUser = await User.create({
            name,
            email,
            password
        })
        res.status(201).send(newUser)
    } catch {
        return res.status(400).send('Invalid input.')
    }
}

module.exports = {
    post
}
