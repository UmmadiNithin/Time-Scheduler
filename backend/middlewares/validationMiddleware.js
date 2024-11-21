const {
    signupSchema,
    loginSchema,
    createSlotSchema,
    viewDoctorSlotsSchema,
    viewAllSlotsSchema,
    bookSlotSchema,
    cancelSlotSchema
} = require('../validations/uservalidations');

const validationMiddleware = (req, res, next) => {
    let schema;

    switch (req.path) {
        case '/register':
            schema = signupSchema;
            break;
        case '/login':
            schema = loginSchema;
            break;
        case '/create-slots':
            schema = createSlotSchema;
            break;
        case '/view-slots':
            schema = viewDoctorSlotsSchema;
            break;
        case '/viewAll-slots':
            schema = viewAllSlotsSchema;
            break;
        case '/book-slot':
            schema = bookSlotSchema;
            break;
        case '/cancel-slot':
            schema = cancelSlotSchema;
            break;
        default:
            schema = null;
    }
    if (schema) {
        if (schema === viewDoctorSlotsSchema){
            const { error } = schema.validate(req.query);
            if (error) {
                return res.status(400).json({
                result: {},
                message: error.details[0].message,
                status: 'error',
                responseCode: 400,
                });
            }
        }
        else if (schema === viewAllSlotsSchema){
            const { error } = schema.validate(req.query);
            if (error) {
                return res.status(400).json({
                result: {},
                message: error.details[0].message,
                status: 'error',
                responseCode: 400,
                });
            }
        }
        else{
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                result: {},
                message: error.details[0].message,
                status: 'error',
                responseCode: 400,
                });
            }
        }

    }


    next(); 
};

module.exports = validationMiddleware;

