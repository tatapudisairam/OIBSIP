import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://tatapudisairam:Prabhash76@cluster0.lb4vndj.mongodb.net/pizza_delivery')
    .then(()=>console.log("DB connected"));
}
