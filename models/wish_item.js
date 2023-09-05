"use strict";

const mongoose = require( "mongoose" );
const { Schema, ObjectId, model } = mongoose;
const Int32 = require( "mongoose-int32" ).loadType( mongoose );

const schema = new Schema( {
    amount: { type: Int32, required: true },
    category: { type: String },
    family: { type: ObjectId, ref: "Family", index: { name: "family" }, required: true },
    link: { type: String },
    name: { type: String, required: true },
    priority: { type: Int32 },
    type: { type: String, enum: [ "BUY", "PAY" ], required: true },
}, { timestamps: true, collection: "wish_items" } );

const WishItem = model( "WishItem", schema );

module.exports = WishItem;
