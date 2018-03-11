import {
  ENTITY_DUPLICATION_ERROR,
  ENTITY_NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  VALIDATION_ERROR,
  UNAUTHORIZED_RESOURCE_ERROR,
  OK
} from '../config/constants';

const FAIL = 'fail';
const ERROR = 'error';
const SUCCESS = 'success';

module.exports = {
    responseHandler: (result, req, res, next) => { // eslint-disable-line no-unused-vars
        switch (result.status) {
            case OK:
                res.json({
                    status: SUCCESS,
                    data: result.data
                });
                break;
            case ENTITY_DUPLICATION_ERROR:
                res.status(ENTITY_DUPLICATION_ERROR).json({
                    status: FAIL,
                    data: [
                        {
                            msg: result.msg || 'Entity exists in the system'
                        }
                    ]
                });
                break;
            case ENTITY_NOT_FOUND_ERROR:
                res.status(ENTITY_NOT_FOUND_ERROR).json({
                    status: FAIL,
                    data: [
                        {
                            msg: result.msg || 'Entity not found in the system'
                        }
                    ]
                });
                break;
            case VALIDATION_ERROR:
                res.status(VALIDATION_ERROR).json({
                    status: FAIL,
                    data: result.errors
                });
                break;
            case UNAUTHORIZED_RESOURCE_ERROR:
                res.status(UNAUTHORIZED_RESOURCE_ERROR).json({
                    status: FAIL,
                    data: [
                        {
                            msg: result.msg || 'You are not authorized to access this resource'
                        }
                    ]
                });
                break;
            default:
                return res.status(INTERNAL_SERVER_ERROR).json({
                    status: ERROR,
                    data: [
                        {
                            msg: result.msg || 'Internal server error. Please contact with administrator'
                        }
                    ]
                });
        }
    }
};

