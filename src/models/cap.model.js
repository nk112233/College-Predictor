import mongoose from "mongoose";

const capSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    },
    branch :{
        type : String,
        required : true 
    },
    category : {
        type : String,
        required : true 
    },
    percentile : {
        type : Number,
        required : true 
    },
    rank : {
        type : Number,
        required : true 
    },
    status : {
        type : String,
        required : true 
    },
    city : {
        type : String,
        required : true 
    },
    round : {
        type : Number,
        required : true 
    }
});

export const Cap  = mongoose.model("Cap" , capSchema);