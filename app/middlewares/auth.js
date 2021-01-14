const jwt=require('jsonwebtoken')
const jwtPrivateKey=process.env.JWT_PRIVATE_KEY

module.exports=function auth(req,res,next) {
    const token=req.header('x-auth-token')
    console.log("header",token)
    if (!token) {
        return res.status(401).send({message:"Access denied.No token Provided. "})
    }
    try {
        const decode=jwt.verify(token,jwtPrivateKey)
        req.user=decode
        next()
    } catch (error) {
        res.status(400).send({message:"invalid Token."})
    }
}

// const jwt = require('jsonwebtoken')
// const jwtPrivateKey = process.env.JWT_PRIVATE_KEY


// module.exports = function auth(req, res, next) {
//     console.log(req.useragent);
//     console.log(req.useragent.browser);
//     if(req.useragent.browser =='Dart'){
//         process.env.isMobile = 'YES';
//     }
//     console.log(req.header('x-auth-token'));
//    const brtoken = req.header('X-browser-token');
//     console.log(req.header('X-browser-token'));
    
//     if (process.env.isMobile == 'NO' ) {
//         console.log(process.env.isMobile);
//         const token = req.header('x-auth-token')
//         if (!token) {
//             return res.status(401).send({
//                 status: false,
//                 message: "Access denied!! Unauthorized access."
//             })
//         }
//         try {
//             if (token != 'INIT') {
//                 // console.log("if part");
//                 const decode = jwt.verify(token, jwtPrivateKey, { expiresIn: '180s' })
//                 req.user = decode
//                 console.log("Verified");
//                 next()
//             } else {
//                 // console.log("Else Part");
//                 next()
//             }

//         } catch (error) {
//             res.status(400).send({ message: "invalid Token." })
//         }
//     } else {
//     console.log("Authentication by pass in case req arrived from mobile");
//         next()
//     }
// }
