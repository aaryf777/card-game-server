const jwt = require('jsonwebtoken');
const { jwtSecret, jwtAdminKey } = require('../../constants/vars');
function verifyIoToken(socket, next) {
    try {
        console.log('running auth for socket');
        if (socket.handshake.query && socket.handshake.query.token) {
            console.log('socket token is - ', socket.handshake.query.token);
            jwt.verify(socket.handshake.query.token, jwtSecret, function (err, decoded) {
                if (err) {
                    throw new Error('Unauthorize user')
                }
                socket.decoded = decoded;
                next();
            });
        } else{
            throw new Error('Unauthorize user')
        }
    } catch (error) {
        console.log('auth error in socket');
        socket.emit('error', 'Unauthorize user')
    }


}
const verifyJwt = (req, res, next) => {
    try {
        if (req.path === '/create')
            return next();
        let token = req.header("authorization");
        const split = token.split(' ');
        // console.log('split token  = ',split);
        if (split[0] !== "Bearer" && split[0] !== "Basic") {
            throw err;
        }
        if (split[0] == "Basic") {
            return next();
        }
        token = split[1];
        const decoded = jwt.verify(token, jwtSecret);
        for (key of Object.keys(decoded)) {
            // console.log("k"+key)
            req.body[key] = decoded[key];
        }
        next();
    } catch (err) {
        console.log("in verifyJwt auth err");
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        })
    }
}
const verifyAdmin = (req, res, next) => {
    try {
        let token = req.header("authorization");
        const split = token.split(' ');
        if (split[0] !== "Bearer" && split[0] !== "Basic") {
            throw err;
        }
        if (split[0] == "Basic") {
            return next();
        }
        token = split[1];
        const decoded = jwt.verify(token, jwtAdminKey);
        for (key of Object.keys(decoded)) {
            req.body[key] = decoded[key];
        }
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        })
    }
}
module.exports = { verifyJwt, verifyIoToken, verifyAdmin }