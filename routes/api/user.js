var app = require('express');
var router = app.Router();

var userdb = require('../../server/userdb/userdb');

router.post('/loginUser',userdb.loginUsers);
router.post('/counters',userdb.counters);
// router.post('/loginUser',userdb.getUsers);
router.post('/createUser',userdb.createUser);
router.post('/createClient',userdb.createClient);
router.post('/getClient',userdb.getClient);
router.post('/createConsultation',userdb.createConsultation);
router.post('/getConsultation',userdb.getConsultation);
router.post('/getAdminClients',userdb.getAdminClient);
router.post('/getAdminConsultation',userdb.getAdminConsultation);
router.post('/updateConsultation',userdb.updateConsultation);
router.post('/getUserDetails',userdb.getUserDetails);
router.post('/updateUserDetails',userdb.updateUserDetails);
router.post('/updateClient',userdb.updateClient);

// Edit By Me
router.post('/getDashboard',userdb.getDashboard);
router.post('/forgetPassword',userdb.forgetPassword);
router.post('/resetPassword',userdb.resetPassword);
router.post('/delClient',userdb.delClient);
router.post('/delConsultation',userdb.delConsultation);
router.post('/getClients',userdb.getClients);
router.post('/showProgress',userdb.showProgress);
router.post('/createProgress',userdb.createProgress);
router.post('/getClientProgress',userdb.getClientProgress);
router.post('/pusher/auth',userdb.pusherAuth);
router.post('/getConsultNotification',userdb.getConsultNotification);
router.post('/getTrainerNotification',userdb.getTrainerNotification);
router.post('/UpdateNotification',userdb.UpdateNotification);
router.post('/changePassword',userdb.changePassword);


module.exports = router;