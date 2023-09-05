"use strict";

const mongoose = require( "mongoose" );
const { Schema, ObjectId, model } = mongoose;

const schema = new Schema( {
	due_date: { type: Date, required: true	},
    family: { type: ObjectId, ref: "Family", index: { name: "family" }, required: true },
	invoice_closing_date: { type: Date, required: true	},
    name: { type: String, required: true },
    status: { type: String, enum: [ "PAID", "PENDING", "OVERDUE" ], required: true },
}, { timestamps: true, collection: "credit_cards" } );

const CreditCard = model( "CreditCard", schema );

module.exports = CreditCard;
