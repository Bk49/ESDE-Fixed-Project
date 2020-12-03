// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', authController.processLogin); // done
    router.post('/api/user/register', authController.processRegister); // done
    router.post('/api/user/process-submission', checkUserFn.getClientUserId, userController.processDesignSubmission); // done
    router.put('/api/user/', userController.processUpdateOneUser); // done
    router.put('/api/user/design/', userController.processUpdateOneDesign); // done

    router.get('/api/user/process-search-design/:pagenumber/:search?', checkUserFn.getClientUserId, userController.processGetSubmissionData); // done
    router.get('/api/user/process-search-user/:pagenumber/:search?', checkUserFn.getClientUserId, userController.processGetUserData); // done
    router.get('/api/user/:recordId', userController.processGetOneUserData); // done
    router.get('/api/user/design/:fileId', userController.processGetOneDesignData); // done

};