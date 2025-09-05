const express = require('express');
const routes = express();
const Candidate = require('./../models/candidate.js');
const User = require('./../models/user.js')
const { jwtAuthMiddleware, generateToken } = require('./../jwt.js');



const checkAdminRole = async (userId) => {

    try {
        console.log("Role of user id:", userId);

        const user = await User.findById(userId);
        console.log("Role of user:", user.role);

        if (user.role === "admin") {
            return true;

        }
    }
    catch (err) {
        return false;
    }

}

routes.post('/', jwtAuthMiddleware, async (req, res) => {
    try {

        if (!(await checkAdminRole(req.user.id))) {

            return res.status(403).json({ message: "User does not have access admin role" })

        }

        const data = req.body;
        const candidate = new Candidate(data);
        const response = await candidate.save();

        console.log('Data is Saved');


        res.status(200).json({ response: response, });
    }

    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });

    }

})

routes.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {

    const candidateId = req.params.candidateID;
    console.log("candidateID: ", candidateId)
    const userId = req.user.id;
    console.log("userId: ", userId)
    try {
        const candidate = await Candidate.findById(candidateId)
        const user = await User.findById(userId);
        if (!candidate) {
            return res.status(404).json({ error: "candidate not found" })
        }
        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }
        if (user.isVoted) {
            return res.status(402).json({ error: "user already voted" })
        }
        if (user.role == 'admin') {
            return res.status(403).json({ error: "Admin not allowed" })
        }

        candidate.votes.push({ voterId: userId });
        candidate.voteCount++;
        await candidate.save();
        user.isVoted = true;
        await user.save();
        return res.status(200).json({ message: "Voted successfully" })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });

    }

})

routes.get('/vote/count', async (req, res) => {
    try {
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });
        const record = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })
        return res.status(200).json(record)
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" })
    }
})



module.exports = routes;