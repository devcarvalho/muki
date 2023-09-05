"use strict";

const mongoose = require( "mongoose" );
const { Schema, ObjectId, model } = mongoose;
const Int32 = require( "mongoose-int32" ).loadType( mongoose );

const schema = new Schema( {
    amount: { type: Int32, required: true },
    category: { 
        type: String, 
        enum: [ "EDUCATION", "HOUSING", "HEALTH", "FOOD", "LEISURE", "TRANSPORT", "BEAUTY", "WORK" ],
        required: true
    },
    credit_card: { type: ObjectId, ref: "CreditCard", index: { name: "credit_card" } },
    is_credit: { type: Boolean, default: false },
    type: { type: String, enum: [ "FIXED", "INSTALLMENTS", "ONE_TIME" ], required: true },
    due_date: { type: Date, required: true },
    installments_end: { type: Date }
}, { timestamps: true, collection: "transactions" } );

const Transaction = model( "Transaction", schema );

module.exports = Transaction;
