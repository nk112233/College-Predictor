import mongoose from "mongoose";
import { Cap } from "../models/cap.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const showTable = asyncHandler(async(req , res) => {
    
    const categoryls = await Cap.distinct("category");
    const branchls = await Cap.distinct("branch");
    const statusls = await Cap.distinct("status");
    const cityls = await Cap.distinct("city");
    const clgls = await Cap.distinct("name");
    const limit = 25; 
    const showAll = req.query.showAll === 'true';

    let tabledata;

    if (showAll) {
        // If showAll is true, fetch all records without pagination
        tabledata = await Cap.find({
            name: {
                $regex: "",
            }
        });
    } else {
        // Otherwise, apply pagination logic
        tabledata = await Cap.find({
            name: {
                $regex: "",
            }
        })
        .limit(limit);
    }

    
    res
    .status(200)
    .json(new ApiResponse(200, 
        {
            clgname : clgls ,
            category : categoryls , 
            branch : branchls , 
            status : statusls,
            city : cityls,
            tableData : tabledata 
             

         }
          , "Data Fetched!"));
})
const getTable = asyncHandler(async (req , res) => {
    const {rank , percentile} = req.body;
    let name = req.query.clg;
    let category = req.query.category;
    let branch = req.query.branch;
    let status = req.query.status;
    let city = req.query.city;

    let query = {};

    let limit = 100;
    // console.log(category, branch, status, city, name);
    // Add query parameters if they exist
    if (category){
        category = category.split(",");
        query.category = { $in: category };
    } 
    if (branch){
        branch = branch.split(",");
        query.branch = { $in: branch };
    }
    if (status) {
        status = status.split(",");
        query.status = { $in: status };
    }
    if (city){
        city = city.split(",");
        query.city = { $in: city };
    }
    if (name) {
        name = name.split(",").map(n => new RegExp(n.trim(), "i"));
        query.name = { $in: name };
    }

    // Add rank or percentile conditions if they exist
    if (rank) {
        query.rank = { $gte: rank };
    }
    else if (percentile){
        query.percentile = { $lte: percentile }
}
    else {
        throw new ApiError(400 , "Percentile or Rank Required!");
    }
    // console.log("query" , query);
    const results = await Cap.find(query)
    .sort({rank : 1})
    .limit(limit)

    res.status(200).json(new ApiResponse(200 , results , "Colleges Fetched Successfully!"));
})

export {showTable  , getTable};