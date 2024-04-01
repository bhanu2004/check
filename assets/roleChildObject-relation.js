import District from "../models/districtModel.js";
import Village from "../models/villageModel.js";
import Info from "../models/infoModel.js";

function getChildObject(role){
    if(role==='state-coordinator') return District;
    else if(role==='district-coordinator') return Village;
    else if(role==='village-coordinator') return Info;
}
export default getChildObject;