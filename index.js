import express from "express";
import adminRouter from "./routes/admin.js";
import stateRouter from "./routes/state.js";
import districtRouter from "./routes/district.js";
import villageRouter from "./routes/village.js";
import homeRouter from "./routes/home.js";
import dotenv from 'dotenv'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/home',homeRouter);
app.use('/admin',adminRouter);
app.use('/state',stateRouter);
app.use('/district',districtRouter);
app.use('/village',villageRouter);


app.listen(8000, ()=>{
    console.log("Server is running on port 8000");
});