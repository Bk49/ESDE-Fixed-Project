module.exports.responseJson = (statusCode, message)=>{
    let status
    switch(statusCode){
        case 200: status = "OK"
        break;
        case 201: status = "No Content"
        break;
        case 400: status = "Bad Request"
        break;
        case 401: status = "Unauthorized"
        break;
        case 403: status = "Forbidden"
        break;
        case 404: status = "Not Found"
        break;
        case 500: status = "Internal Server Error"
        break;
    }

    const err = (status >= 201)

    message.state = {
        code: statusCode,
        status: status,
        error: err
    }

    return message
}