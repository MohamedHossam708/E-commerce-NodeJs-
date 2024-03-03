
import mongoose from "mongoose"


export function mongoConection(){
mongoose.connect(process.env.MONGO_CONN)
.then(()=>{console.log("Mongo is running too ..")})
.catch((err)=>{console.log("DataBase error", err)})
}