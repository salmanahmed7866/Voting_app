const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    cnicNo: {
        type: Number,
        unique: true,
        required: true

    },
    address: {
        type: String,

    },
    phoneNo: {
        type: Number,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
        
    }

})
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt)

        user.password = hashPassword;
        next();
    }
    catch (err) {
        return next(err);
    }

});


userSchema.methods.comparePassword = async function (userPassword){
    try {
        const isMatch = await bcrypt.compare(userPassword, this.password,)
        return isMatch
    }
    catch (err) {

        throw err;
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User;