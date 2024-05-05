const successResponse = (statusCode, message, status, data) => {
    return ({
        httpStatus: statusCode,
        message: message,
        status: status,
        data: data
    })
}


module.exports = {
    successResponse
}