const multer = require('multer');
const path = require('path');
const ApiError = require('../api-errors');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb){
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniquePrefix + '-' + path.extname(file.originalname));
    }
    
})

function avatarUpload(req, res, next){
    const upload = multer({storage: storage}).single('avatarFile');
    upload(req, res, function(err){
        if(err instanceof multer.MulterError){
            return next(new ApiError(400, err.message));
        }else if(err){
            return next(new ApiError(500, err.message));
        }
        next();
    });
}
module.exports = avatarUpload;