const express = require('express');
const routes = express();
const User = require('./../models/user.js')
const { jwtAuthMiddleware, generateToken } = require('./../jwt.js');

routes.post('/signup', async (req, res) => {
    try {
        const userData = req.body;
        const user = new User(userData);
        const response = await user.save();
        console.log('Data is Saved', response);
        const payload = { id: response.id };
        const token = generateToken(payload);

        res.status(200).json({ response: response, token, token });
    }

    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });

    }

});

routes.post('/login', async (req, res) => {
    try {
        const { cnicNo, password } = req.body;
        const user = await User.findOne({ cnicNo: cnicNo });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username and password' })

        }

        const payload = { id: user.id };
        const token = generateToken(payload);

        res.status(200).json({ response: user, token, token });
    }

    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });

    }

});

routes.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne(userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' })

        }


        res.status(200).json({ response: user });
    }

    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });

    }

})

routes.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        const { currentPassword, newPassword } = req.body;
console.log("current Password:",currentPassword)
        const comparePassword = await user.comparePassword(currentPassword);
        if (!comparePassword) {
            return res.status(401).json({ message: 'Invalid password' })

        }
        user.password = newPassword
        await user.save();
        console.log("Password updated")
        res.status(200).json({ response: "password updated" });

    }

    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });

    }

})

module.exports = routes;