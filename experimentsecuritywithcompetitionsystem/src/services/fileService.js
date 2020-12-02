//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
const { assert } = require('console');
const config = require('../config/config');
const pool = require('../config/database')
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    upload_preset: 'upload_to_design'
});

module.exports.uploadFile = async (file) => {

    // upload image here
    return await cloudinary.uploader.upload(file.path, { upload_preset: 'upload_to_design' })
        .then((result) => {
            const imageURL = result.url
            const publicId = result.public_id
            
            //Inspect whether I can obtain the file storage id and the url from cloudinary
            //after a successful upload.
            //console.log({imageURL: result.url, publicId: result.public_id});
            let data = { imageURL: imageURL, publicId: publicId, status: 'success' };
            return data;

        }).catch((error) => {
            return error;
        });

} //End of uploadFile
module.exports.createFileData = async (imageURL, publicId, userId, designTitle, designDescription) => {
    console.log('createFileData method is called.');

    try{
        return await pool.query(`INSERT INTO file ( cloudinary_file_id, cloudinary_url , design_title, design_description,created_by_id ) VALUES (?,?,?,?,?)`,[publicId, imageURL, designTitle, designDescription, userId])
    }catch(err){
        return new Error(err);
    }


} //End of createFileData

module.exports.getFileData = async (userId, pageNumber, search) => {
    const page = pageNumber;
    if (search == null) { search = ''; };
    const limit = 4; //Due to lack of test files, I have set a 3 instead of larger number such as 10 records per page
    const offset = (page - 1) * limit;
    let designFileDataQuery = '';
    let parameters = [];
    //If the user did not provide any search text, the search variable
    //should be null. The following console.log should output undefined.
    //console.log(search);
    //-------------- Code which does not use stored procedure -----------
    //Query for fetching data with page number and offset (and search)
    if ((search == '') || (search == null)) {
        console.log('Prepare query without search text');
        designFileDataQuery = `SELECT file_id,cloudinary_url,design_title,design_description 
        FROM file  WHERE created_by_id=?  LIMIT ? OFFSET ?;
        SET @total_records =(SELECT count(file_id) FROM file WHERE created_by_id= ?   );SELECT @total_records total_records; `;
        parameters = [userId, limit, offset, userId]
    } else {
        designFileDataQuery = `SELECT file_id,cloudinary_url,design_title,design_description 
            FROM file  WHERE created_by_id=? AND design_title LIKE ?  LIMIT ? OFFSET ?;
            SET @total_records =(SELECT count(file_id) FROM file WHERE created_by_id= ? AND design_title LIKE ? );SELECT @total_records total_records;`;
        parameters = [userId, "%" + search + "%", limit, offset, userId, "%" +search + "%"]

    }
    //--------------------------------------------------------------------
    //designFileDataQuery = `CALL sp_get_paged_file_records(?,?,?,?, @total_records); SELECT @total_records total_records;`;

    try{
        return await pool.query(designFileDataQuery,parameters)
    }catch(err){
        return new Error(err)
    }
} //End of getFileData