import mongoose from "mongoose";
const { Schema, model } = mongoose;
import Int32 from "mongoose-int32";
const Number = Int32.loadType(mongoose);

const schema = new Schema( {
    type: { type: String, enum: ["USD", "EUR"], required: true },
    value: { type: Number, required: true },
}, { timestamps: true, collection: "currencies" } );

const Currency = model( "Currency", schema );

export default Currency;
