const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');



exports.processLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

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
        console.log(err)
        return res.status(500).json({message:'login failed'})
    })
}

exports.processRegister = (req, res, next) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,18}$/;

    bcrypt.hash(password, 10, async(err, hash) => {
        if(passwordReg.test(password)){
            if (err) {
                console.log('Error on hashing password');
                return res.status(500).json({ message: 'Unable to complete registration' });
            } else {
            user.createUser(fullName,email,hash).then((results)=> res.status(200).json({message: 'Completed Registration'}))
                .catch((err)=>{
                    console.log(err)
                    res.status(500).json({ message: 'Unable to complete registration' })
                })
            }
        }else{
            return res.status(500).json({ message: 'Insert appropriate passwordS' });
        }
    });
}; //End of processRegister