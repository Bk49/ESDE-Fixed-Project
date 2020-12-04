const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const {responseJson} = require('./responseHandler')


exports.processLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    auth.authenticate(email).then((results)=>{
        if(results.length >= 1){
            if((password == null) || (results[0] == null)) return res.status(500).json(responseJson(500, {message: 'Login Failed'}))
            if(bcrypt.compareSync(password, results[0].user_password) == true){
                let data = {
                    user_id: results[0].user_id,
                    role_name: results[0].role_name,
                    token: jwt.sign({ id: results[0].user_id }, config.JWTKey, {
                        expiresIn: 86400 //Expires in 24 hrs
                    })
                }
                return res.status(200).json(responseJson(200, data))
            }else return res.status(401).json(responseJson(401, {message:'Invalid Password'}))
        }else return res.status(500).json(responseJson(404, {message:'Email Not Found'}))
    }).catch((err) => {
        console.log(err)
        return res.status(500).json(responseJson(500, {message:'Login Failed'}))
    })
}

exports.processRegister = (req, res, next) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,18}$/;

    bcrypt.hash(password, 10, async(err, hash) => {
        if(passwordReg.test(password)){
            if (err) return res.status(500).json(responseJson(500, {message:'Unable to complete registration'}));
            else {
            user.createUser(fullName,email,hash).then((results)=> res.status(200).json(responseJson(200, {message:'Completed Registration'})))
                .catch((err)=>{
                    console.log(err)
                    res.status(500).json(responseJson(500, {message:'Unable to complete registration'}))
                })
            }
        }else{
            return res.status(400).json(responseJson(400, {message:'Insert appropriate passwords'}));
        }
    });
}; //End of processRegister