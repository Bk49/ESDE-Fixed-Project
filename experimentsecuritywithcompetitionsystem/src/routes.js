// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const log = require('./middlewares/log')

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', log.logRequest, authController.processLogin); // done
    router.post('/api/user/register', log.logRequest, authController.processRegister); // done
    router.post('/api/user/process-submission', log.logRequest, checkUserFn.getClientUserId, userController.processDesignSubmission); // done
    router.put('/api/user/', log.logRequest, userController.processUpdateOneUser); // done
    router.put('/api/user/design/', log.logRequest, userController.processUpdateOneDesign); // done

    router.get('/api/user/process-search-design/:pagenumber/:search?', log.logRequest, checkUserFn.getClientUserId, userController.processGetSubmissionData); // done
    router.get('/api/user/process-search-user/:pagenumber/:search?', log.logRequest , checkUserFn.getClientUserId, userController.processGetUserData); // done
    router.get('/api/user/:recordId', log.logRequest , userController.processGetOneUserData); // done
    router.get('/api/user/design/:fileId', log.logRequest , userController.processGetOneDesignData); // done

};