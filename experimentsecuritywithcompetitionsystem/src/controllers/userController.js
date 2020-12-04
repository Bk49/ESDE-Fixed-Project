const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const { responseJson } = require('./responseHandler');

exports.processDesignSubmission = (req, res, next) => {
    const designTitle = req.body.designTitle;
    const designDescription = req.body.designDescription;
    const userId = req.body.userId;
    const file = req.body.file;

    fileDataManager.uploadFile(file).then((results)=>{
        const imageUrl = results.imageURL
        return fileDataManager.createFileData(results.imageURL, results.publicId, userId, designTitle, designDescription)
    }).then((results)=>{
        return res.status(200).json(responseJson(200, {message:'File Submission completed.', imageURL:imageUrl}))
    }).catch((err)=>{
        console.log(err)
        return res.status(500).json(responseJson(500, {message:'Unable to complete file submission'}))
    })
}; //End of processDesignSubmission

exports.processGetSubmissionData = async(req, res, next) => {
    const pageNumber = req.params.pagenumber;
    const search = req.params.search;
    const userId = req.body.userId;

    fileDataManager.getFileData(userId, pageNumber, search).then((results)=>{
        const jsonResult = {
            'number_of_records': results[0].length,
            'page_number': pageNumber,
            'filedata': results[0],
            'total_number_of_records': results[2][0].total_records
        }
        return res.status(200).json(responseJson(200, jsonResult))
    }).catch((err)=> {
        console.log(err)
        return res.status(500).json(responseJson(500, {message: 'Server is unable to process your request'}))
    })

}; //End of processGetSubmissionData
exports.processGetUserData = async(req, res, next) => {
    const pageNumber = req.params.pagenumber;
    const search = req.params.search;

    userManager.getUserData(pageNumber, search).then((results)=>{
        const jsonResult = {
            'number_of_records': results[0].length,
            'page_number': pageNumber,
            'userdata': results[0],
            'total_number_of_records': results[2][0].total_records
        }
        return res.status(200).json(responseJson(200, jsonResult));
    }).catch((err)=> {
        console.log(err)
        return res.status(500).json(responseJson(500, {message: 'Server is unable to process your request.'}))
    })

}; //End of processGetUserData

exports.processGetOneUserData = async(req, res, next) => {
    const recordId = req.params.recordId;

    userManager.getOneUserData(recordId).then((results)=>{
        if(!results) throw new Error(results)
        const jsonResult = {
            'userdata':results[0]
        }
        return res.status(200).json(responseJson(200, jsonResult))
    }).catch((err)=> {
        console.log(err)
        return res.status(500).json(responseJson(500, {message:'Server is unable to process your request.'}))
    })
}; //End of processGetOneUserData


exports.processUpdateOneUser = async(req, res, next) => {
    //Collect data from the request body 
    const recordId = req.body.recordId;
    const newRoleId = req.body.roleId;
    
    userManager.updateUser(recordId, newRoleId).then((results)=>{
        return res.status(200).json(responseJson(200, {message:'Completed update'}))
    }).catch((err)=>{
        console.log(err)
        return res.status(500).json(responseJson(500, {message: "Unable to complete update operation"}))
    })
}; //End of processUpdateOneUser

exports.processGetOneDesignData = async(req, res, next) => {
    const recordId = req.params.fileId;

    userManager.getOneDesignData(recordId).then((results)=>{
        if(!results) throw new Error(results)
        const jsonResult = {
            'filedata': results[0]
        }
        return res.status(200).json(responseJson(200, jsonResult))
    }).catch((err)=>{
        console.log(err)
        return res.status(500).json(responseJson(500, {message:'Server is unable to process the request'}))
    })
}; //End of processGetOneDesignData

exports.processUpdateOneDesign = async(req, res, next) => {
    console.log('processUpdateOneFile running');
    //Collect data from the request body 
    const fileId = req.body.fileId;
    const designTitle = req.body.designTitle;
    const designDescription = req.body.designDescription;

    userManager.updateDesign(fileId, designTitle, designDescription).then((results)=>{
        return res.status(200).json(responseJson(200, {message :'Completed update'}))
    }).catch((err)=>{
        console.log(err)
        return res.status(500).json(responseJson(500, {message:'Unable to complete update operation'}))
    })

};