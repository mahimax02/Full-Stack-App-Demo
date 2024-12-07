import jwt from 'jsonwebtoken';
import ENV from '../config.js';


export default async function Auth(req, res, next) {
    try {
        // access authorize header to validate request
        const tocken = req.headers.authorization.split(" ")[1];

        // retrive the user details for the logged in user
        const decodedToken = await jwt.verify(tocken, ENV.JWT_SECRET);

        req.user = decodedToken;
        // res.json(tocken);
        next();
    } catch (error) {
        return req.status(400).json({ error: "Authentication Failed" });
    }
}

// export default async function Auth(req, res, next) {
//     try {
//         // Access the Authorization header to validate the request
//         const token = req.headers.authorization?.split(" ")[1];

//         // For debugging purposes, you can log the token
//         // console.log('Token:', token);

//         // If no token is provided, return an error response
//         if (!token) {
//             return res.status(401).json({ error: 'Authentication token is missing' });
//         }

//         const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

//         req.user = decodedToken;

//         // res.json(decodedToken);

//         // (Optional) You can add further validation for the token here

//         // If the token is valid, call the next middleware or route handler
//         next();
//     } catch (error) {
//         return res.status(400).json({ error: 'Authentication Failed' });
//     }
// }



export function localVariables(req, res, next) {
    req.app.locals = {
        OPT: null,
        resetSession: false
    }
    next();
}