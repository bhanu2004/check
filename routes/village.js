import express from "express";
import checkUserAuth from "../middlewares/auth-middleware.js";
import villageController from "../controllers/coordinator/village.js";
import fetchSurveyData from "../controllers/fetchSurvey.js";
const router = express.Router();


router.get('/allotted-village',checkUserAuth, villageController.allottedVillage);
router.get('/get-survey/village/:villageId',checkUserAuth, villageController.fetchSurveyList);
router.post('/add-survey',checkUserAuth, villageController.addSurvey);

export default  router;  