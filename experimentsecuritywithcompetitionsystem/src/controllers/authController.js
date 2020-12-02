const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');



exports.processLogin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    // try {
    auth.authenticate(email).then((results)=>{
        if(results.length == 1){
            if((password == null) || (results[0] == null)) return res.status(500).json({message: 'login failed'})
            if(bcrypt.compareSync(password, results[0].user_password) == true){
                let data = {
                    user_id: results[0].user_id,
                    role_name: results[0].role_name,
                    token: jwt.sign({ id: results[0].user_id }, config.JWTKey, {
                        expiresIn: 86400 //Expires in 24 hrs
                    })
                }
                return res.status(200).json(data)
            }
        }else return res.status(500).json({message:'login failed'})
    }).catch((err) => {
        return res.status(500).json({message:'login failed'})
    })
}

// If user submitted data, run the code in below
exports.processRegister = (req, res, next) => {
    console.log('processRegister running');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;
    var passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,18}$/;
    console.log(passwordReg.test(password))

    bcrypt.hash(password, 10, async(err, hash) => {
        if(passwordReg.test(password)){
            if (err) {
                console.log('Error on hashing password');
                return res.status(500).json({ message: 'Unable to complete registration' });
            } else {
            user.createUser(fullName,email,hash).then((results)=> res.status(200).json({message: 'Completed Registration'}))
                .catch((err)=> res.status(500).json({ message: 'Unable to complete registration' }))
            }
        }else{
            return res.status(500).json({ message: 'Insert appropriate passwordS' });
        }

    });


}; //End of processRegister