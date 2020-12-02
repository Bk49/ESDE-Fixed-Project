const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');

exports.processDesignSubmission = (req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.body.userId;
    let file = req.body.file;

    let imageUrl;
    fileDataManager.uploadFile(file).then((results)=>{
        imageUrl = results.imageURL
        return fileDataManager.createFileData(results.imageURL, results.publicId, userId, designTitle, designDescription)
    }).then((results)=>{
        return res.status(200).json({message:'File Submission completed.', imageURL:imageUrl})
    }).catch((err)=>{
        return res.status(500).json({message:'Unable to complete file submission'})
    })
}; //End of processDesignSubmission

exports.processGetSubmissionData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;

    fileDataManager.getFileData(userId, pageNumber, search).then((results)=>{
        // console.log(results)
        const jsonResult = {
            'number_of_records': results[0].length,
            'page_number': pageNumber,
            'filedata': results[0],
            'total_number_of_records': results[2][0].total_records
        }
        res.status(200).json(jsonResult)
    }).catch((err)=> res.status(500).json({message: 'Server is unable to process your request'}))

}; //End of processGetSubmissionData
exports.processGetUserData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;

    userManager.getUserData(pageNumber, search).then((results)=>{
        if(!results) throw new Error(results)
        const jsonResult = {
            'number_of_records': results[0].length,
            'page_number': pageNumber,
            'userdata': results[0],
            'total_number_of_records': results[2][0].total_records
        }
        return res.status(200).json(jsonResult);
    }).catch((err)=> res.status(500).json({message: 'Server is unable to process your request.'}))

}; //End of processGetUserData

exports.processGetOneUserData = async(req, res, next) => {
    let recordId = req.params.recordId;

    userManager.getOneUserData(recordId).then((results)=>{
        if(!results) throw new Error(results)
        const jsonResult = {
            'userdata':results[0]
        }
        return res.status(200).json(jsonResult)
    }).catch((err)=> res.status(500).json({message:'Server is unable to process your request.'}))
}; //End of processGetOneUserData


exports.processUpdateOneUser = async(req, res, next) => {
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;
    
    userManager.updateUser(recordId, newRoleId).then((results)=>{
        if(results.affectedRows <1) throw new Error(results)
        return res.status(200).json({message:'Completed update'})
    }).catch((err)=>{
        return res.status(500).json({message: "Unable to complete update operation"})
    })
}; //End of processUpdateOneUser

exports.processGetOneDesignData = async(req, res, next) => {
    let recordId = req.params.fileId;

    userManager.getOneDesignData(recordId).then((results)=>{
        if(!results) throw new Error(results)
        const jsonResult = {
            'filedata': results[0]
        }
        return res.status(200).json(jsonResult)
    }).catch((err)=> res.status(500).json({message:'Server is unable to process the request'}))
}; //End of processGetOneDesignData

exports.processUpdateOneDesign = async(req, res, next) => {
    console.log('processUpdateOneFile running');
    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;

    userManager.updateDesign(fileId, designTitle, designDescription).then((results)=>{
        if(results.affectedRows < 1) throw new Error(results)
        return res.status(200).json({message :'Completed update'})
    }).catch((err)=>{
        return res.status(500).json({message:'Unable to complete update operation'})
    })

};