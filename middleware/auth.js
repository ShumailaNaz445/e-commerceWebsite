const jwt = require("jsonwebtoken");


const authorizationToken = (req , res , next) => {
 
    const header = req.headers['authorization'];
    console.log(header);
    if(!header) return res.send("invalid user")
    const tokensplit = header.split(' ')[1]

    if(!tokensplit) return res.send ('access denied')


        jwt.verify(tokensplit , process.env.JWT_SECRET_KEY , (err , data) =>{
           if(err) return res.send({err:err})
            req.user = data
            next()
        })
    
}


module.exports = authorizationToken