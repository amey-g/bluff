// init
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        unique : true,
        required : true,
        // index : true,
    },
    name : { 
        type : String,
        // index : true,
    },
    email : {
        type : String,
        required : true,
        // index : true
    },
    tokens : [{ 
        token : {
            type : String,
            required : true
        }
    }]
})

userSchema.set('autoIndex', false) 

userSchema.methods.generateAuthToken = async function (res) { // function for instance of userSchema
    const token = jwt.sign( { email : this.email, id : this._id }, process.env.JWT_SECRET, { expiresIn : '7d' } ) // generating jwt token with user email embedded in it
    this.tokens = this.tokens.concat({ token })
    
    /*Setting up Cookie*/
    res.cookie("token", token)
    res.cookie("email", this.email)
    
    await this.save()
    return token
}

const userModel = mongoose.model('user', userSchema)
module.exports =  userModel