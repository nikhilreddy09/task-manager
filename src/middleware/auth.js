const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async(req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer' , '')
        token1 = token.trim()
        const decoded = jwt.verify(token1, process.env.JWT_SECRET)
        //console.log(decoded._id)
        const user = await User.findOne({_id : decoded._id , 'tokens.token' : token1})

        if(!user) {
            throw new Error()
        }
        req.user = user
        req.token = token1
        next()
    }catch (e) {
        res.status(401).send({error : 'please authenticate'})
    }

}

module.exports = auth