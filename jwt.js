const jwt = require('jsonwebtoken')


const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) return res.status(401).json({ error: 'Token not found' });

    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded
      //  console.log("user Id",decodedd)
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid Token' })
    }

}

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY)
}

module.exports={jwtAuthMiddleware,generateToken}