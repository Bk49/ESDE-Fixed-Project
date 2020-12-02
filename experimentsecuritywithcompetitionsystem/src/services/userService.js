const config = require('../config/config');
const pool = require('../config/database')

module.exports.createUser = async (fullname, email, password) => {
        try{
            return await pool.query(`INSERT INTO user ( fullname, email, user_password, role_id) VALUES (?,?,?,2) `, [fullname, email, password])
        }catch(err){
            return new Error(err)
        }
    } //End of createUser

module.exports.updateUser = async (recordId, newRoleId) => {
        try{
            return await pool.query(`UPDATE user SET role_id =? WHERE user_id=?`,[newRoleId, recordId])
        }catch(err){
            return new Error(err)
        }
    } //End of updateUser


module.exports.getUserData = async (pageNumber, search) => {
        const page = pageNumber;
        if (search == null) { search = ''; };
        const limit = 4; //Due to lack of test files, I have set a 3 instead of larger number such as 10 records per page
        const offset = (page - 1) * limit;
        let userDataQuery;
        let parameters;

        if ((search == '') || (search == null)) {
            console.log('Prepare query without search text');
            userDataQuery = `SELECT user_id, fullname, email, role_name 
        FROM user INNER JOIN role ON user.role_id = role.role_id LIMIT ? OFFSET ?;
        SET @total_records =(SELECT count(user_id) FROM user    );SELECT @total_records total_records; `;
            parameters = [limit, offset]
        } else {
            userDataQuery = `SELECT user_id, fullname, email, role_name 
        FROM user INNER JOIN role ON user.role_id = role.role_id AND fullname LIKE ?  LIMIT ? OFFSET ?;
    SET @total_records =(SELECT count(user_id) FROM user WHERE fullname LIKE ? );SELECT @total_records total_records;`;
            parameters = [`%${search}%`, limit, offset, `%${search}%`]
        }

        try{
            return await pool.query(userDataQuery, parameters)
        }catch(err){
            return new Error(err)
        }
    } //End of getUserData

module.exports.getOneUserData = async (recordId)=> {
        try{
            return await pool.query(`SELECT user_id, fullname, email, user.role_id, role_name 
            FROM user INNER JOIN role ON user.role_id = role.role_id WHERE user_id=?`, [recordId])
        }catch(err){
            return new Error(err)
        }
    } //End of getOneUserData

module.exports.getOneDesignData = async (recordId)=> {
        try{
            return await pool.query(`SELECT file_id,cloudinary_file_id,cloudinary_url,design_title,design_description FROM file WHERE file_id=?`, [recordId])
        }catch(err){
            return new Error(err)
        }
    } //End of getOneDesignData

module.exports.updateDesign = async (recordId, title, description) => {
        try{
            return await pool.query(`UPDATE file SET design_title =? , design_description=? WHERE file_id=?`, [title, description, recordId])
        }catch(err){
            return new Error(err)
        }
    } //End of updateDesign