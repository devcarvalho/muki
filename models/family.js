import mongoose from "mongoose";
const { Schema, ObjectId, model } = mongoose;

const schema = new Schema( {
    name: { type: String, required: true }
}, { timestamps: true, collection: "families" } );

const Family = model( "Family", schema );

export default Family;
