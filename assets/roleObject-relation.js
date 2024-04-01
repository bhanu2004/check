import District from "../models/districtModel";
import State from "../models/stateModel";
import Village from "../models/villageModel";

function getObject(role){
    if(role==='state-coordinator') return State;
    else if(role==='district-coordinator') return District;
    else if(role==='village-coordinator') return Village;
}
export default getObject;