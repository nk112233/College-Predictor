import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { showTable } from "./controllers/college_data.controller.js";
import clgRouter from "./routes/clgdata.routes.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended:true , limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/" , showTable );
app.use("/data",clgRouter);

app.use(express.static(path.join(__dirname , '../frontend/dist')))

app.get('*' , (req , res) => res.sendFile(path.join(__dirname , '../frontend/dist/index.html')))


export {app};