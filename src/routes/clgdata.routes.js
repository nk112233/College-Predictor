import {Router} from "express";
import { getTable } from "../controllers/college_data.controller.js";
const clgRouter =  Router();


clgRouter.route("/getclgs").post(
    getTable
)

export default clgRouter