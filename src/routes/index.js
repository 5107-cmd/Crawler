const router = require("express").Router();
const userController = require('../controller/user');
const companyController = require('../controller/company.controller');


router.post('/clients', userController.insertObjectIntoTable);
router.post('/clients/:id', userController.updateClientById);
router.get('/clients/:id', userController.getClientById);
router.delete('/clients/:id', userController.deleteClientById);
router.get('/clients', userController.getClient);

router.post('/company/scrap', companyController.scrapCompanyDetails);


module.exports = router;