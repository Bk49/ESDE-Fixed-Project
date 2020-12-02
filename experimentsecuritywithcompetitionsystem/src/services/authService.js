config = require('../config/config');
const pool = require('../config/database')

module.exports.authenticate = async (email) =>{
    try{
        return await pool.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id FROM user INNER JOIN role ON user.role_id=role.role_id AND email=?`, [email])
    }catch(err){
        return new Error(err)
    }

}