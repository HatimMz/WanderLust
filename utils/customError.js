class customError extends Error{
    constructor(statusCode, msg)
    {
        super(msg);
        this.statusCode = statusCode;
        this.message = msg;
    }
}

module.exports = customError;