import 'dotenv/config';
import { app } from "./app.js";
import { connectDB } from './db/index.js';


connectDB()
.then(() => {
    app.on("error" , (error) => {
        console.log(error);
        throw error;
    });
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running at ${process.env.PORT}`);
    });

})
.catch((err) => {
    console.log("MONGODB Connection Failed!!" , err);
})





