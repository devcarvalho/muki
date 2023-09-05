import mongoose from "mongoose";
const { Schema, ObjectId, model } = mongoose;
import Int32 from "mongoose-int32";
const Number = Int32.loadType(mongoose);
import bcrypt from "bcryptjs";

const schema = new Schema( {
    currency: { type: ObjectId, ref: "Currency", index: { name: "currency" } },
    email: { type: String, required: true },
    family: { type: ObjectId, ref: "Family", index: { name: "family" }, required: true },
    hourly_rate_income: { type: Boolean },
    hourly_rate: { type: Number },
    monthly_income: { type: Number },
    name: { type: String, required: true },
    password: { type: String, required: true },
    tax_percent: { type: Number },
}, { timestamps: true, collection: "users" } );

schema.pre( "save", async function( next ) {
    if( !this.isModified( "password" ) ) {
       next();
    } else {
        const salt = await bcrypt.genSalt( 10 );
        this.password = await bcrypt.hash( this.password, salt );
    }
} );

schema.methods.matchPassword = async function( enteredPassword ) {
    return await bcrypt.compare( enteredPassword, this.password );
}

const User = model( "User", schema );

export default User;
