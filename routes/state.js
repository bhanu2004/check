import express from "express";
import checkUserAuth from "../middlewares/auth-middleware.js";
import stateController from "../controllers/coordinator/state.js";
import updateCoordinator from "../controllers/updateCoordinator.js";
import fetchSurveyData from "../controllers/fetchSurvey.js";
const router = express.Router();

router.get('/allotted-state',checkUserAuth,stateController.allottedState);
router.get('/get-district/:stateId',checkUserAuth, stateController.fetchDistrictList);
router.get('/survey-data/state/:stateId/district/:districtId/village/:villageId',checkUserAuth, fetchSurveyData);
router.put('/update-coordinator',checkUserAuth, updateCoordinator.districtUpdate);
router.get('/read-village/state/:stateId/district/:districtId',checkUserAuth,stateController.fetchVillageList);

export default  router;  