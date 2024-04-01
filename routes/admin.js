import express from "express";
import checkUserAuth from "../middlewares/auth-middleware.js";
import crudState from "../controllers/crud/state.js";
import crudDistrict from "../controllers/crud/district.js";
import crudVillage from "../controllers/crud/village.js";
import userController from "../controllers/user.js";
import checkAdminAuth from "../middlewares/authAdmin.js";
import updateCoordinator from "../controllers/updateCoordinator.js";
import fetchSurveyData from "../controllers/fetchSurvey.js";
const router = express.Router();

// State CRUD operations ------>
router.post('/create-state',checkUserAuth,checkAdminAuth,crudState.create);
router.get('/read-state',checkUserAuth,checkAdminAuth,crudState.read);
router.put('/update-state',checkUserAuth,checkAdminAuth, crudState.update);
router.delete('/delete-state/:id',checkUserAuth,checkAdminAuth,crudState.delete);

// District CRUD operations ------->
router.post('/create-district',checkUserAuth,checkAdminAuth,crudDistrict.create);
router.get('/read-district/:stateId',checkUserAuth,checkAdminAuth,crudDistrict.read);
router.put('/update-district',checkUserAuth,checkAdminAuth, crudDistrict.update);
router.delete('/delete-district/:id',checkUserAuth,checkAdminAuth,crudDistrict.delete);

// Village CRUD operations ------->
router.post('/create-village',checkUserAuth,checkAdminAuth,crudVillage.create);
router.get('/read-village/state/:stateId/district/:districtId',checkUserAuth,checkAdminAuth,crudVillage.read);
router.put('/update-village', checkUserAuth,checkAdminAuth,crudVillage.update);
router.delete('/delete-village/:id',checkUserAuth,checkAdminAuth,crudVillage.delete);

// user CRUD operations ------->
router.post('/create-user',checkUserAuth,checkAdminAuth,userController.registration);
router.get('/read-user',checkUserAuth,checkAdminAuth,userController.fetchUser);
router.put('/update-user',checkUserAuth,checkAdminAuth, userController.updateAccount);
router.delete('/delete-user/:id',checkUserAuth,checkAdminAuth,userController.removeAccount);


// update coordinator operations ------------->
router.put('/update-State-coordinator',checkUserAuth, checkAdminAuth, updateCoordinator.stateUpdate);
router.put('/update-district-coordinator',checkUserAuth, checkAdminAuth, updateCoordinator.districtUpdate);
router.put('/update-village-coordinator',checkUserAuth, checkAdminAuth, updateCoordinator.villageUpdate);

// fetch survey data ---------------------->
router.get('/fetch-survey/state/:stateId/district/:districtId/village/:villageId',checkUserAuth,checkAdminAuth,fetchSurveyData);

// fetch area list
router.get('/get-state-list',checkUserAuth,checkAdminAuth,crudState.stateList);

export default  router;   
