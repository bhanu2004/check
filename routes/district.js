import express from "express";
import checkUserAuth from "../middlewares/auth-middleware.js";
import districtController from "../controllers/coordinator/district.js";
import updateCoordinator from "../controllers/updateCoordinator.js";
import fetchSurveyData from "../controllers/fetchSurvey.js";
const router = express.Router();

router.get('/allotted-district',checkUserAuth, districtController.allottedDistrict);
router.get('/get-village/:districtId',checkUserAuth, districtController.fetchVillageList);
router.get('/get-only-village/:districtId',checkUserAuth, districtController.fetchOnlyVillageList);
router.get('/survey-data/district/:districtId/village/:villageId',checkUserAuth, districtController.fetchSurveyList);
router.put('/update-coordinator',checkUserAuth, updateCoordinator.villageUpdate);


export default  router;  