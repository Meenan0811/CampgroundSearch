

//****************************************************
//-ERROR HANDLING FUNCTION - adds .catch to end of 
//-function vs adding try/catch block
//****************************************************

module.exports = func => {
    return function (req, res, next) {
        func(req, res, next).catch(e => next(e))
    };
}