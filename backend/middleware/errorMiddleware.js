/** @type {import("express").RequestHandler} */
const notFound = (req,res,next) =>{
    const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
    res.status(404);
    next(error);
}

/*** @type {import("express").ErrorRequestHandler} */
const errorHandler = (err,req,res,next) =>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if(err.name === 'CastError' && err.kind === 'ObjectId'){
        statusCode = 404;
        message = 'Resource not found';
    }

    const error = new Error(`Not Found - ${req.originalUrl}`);
    
    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production'? null : err.stack
    });
}

export { notFound,errorHandler};