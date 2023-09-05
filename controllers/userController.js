import asyncHandler from 'express-async-handler';
import dayjs from 'dayjs';
import Joi from 'joi';
import User from '../models/user.js';
import Family from '../models/family.js';

import generateToken from '../utils/generateToken.js';
import Currency from '../models/currency.js';
import countBusinessDays from '../utils/countBusinessDays.js';

// @desc Register user & get token
// route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const schema = Joi.object( {
        firstName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        familyName: Joi.string().required(),
    } );
    const { error, value: { firstName, email, password, familyName } } = schema.validate( req.body, { allowUnknown: false } );
    if( error ) {
        console.error( "registerUser; schema.validate error:", error );
        return res.status( 400 ).json( { message: "Bad Request" } );
    }

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const family = await Family.create({
        name: familyName
    })

    const user = await User.create({
        name: firstName,
        email,
        password,
        family: family.id
    });

    generateToken(res, user._id);

    res.status(201).json({ 
        _id: user._id,
        name: user.name,
        email: user.email
     });
});

// @desc Auth user & get token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const schema = Joi.object( {
        email: Joi.string().email().required(),
        password: Joi.string().required()
    } );
    const { error, value: { email, password } } = schema.validate( req.body, { allowUnknown: false } );

    if( error ) {
        console.error( "authUser; schema.validate error:", error );
        return res.status( 400 ).json( { message: "Bad Request" } );
    }

    const user = await User.findOne({ email }).populate('family');

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(200).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            family: user.family
         });
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});

// @desc Logout user
// route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', null, {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'User Logged out' });
});

// @desc Save user income information
// route POST /api/users/income
// @access Private
const saveUserIncome = asyncHandler(async (req, res) => {
    const schema = Joi.object( {
        hourlyRateIncome: Joi.boolean().required(),
        hourlyRate: Joi.number().optional(),
        monthlyIncome: Joi.number().optional(),
        taxPercent: Joi.number().optional(),
        currency: Joi.string().optional()
    } );

    const { error, value: { hourlyRateIncome, hourlyRate, monthlyIncome, taxPercent, currency } } = schema.validate( req.body, { allowUnknown: false } );

    if( error ) {
        console.error( "saveUserIncome; schema.validate error:", error );
        return res.status( 400 ).json( { message: "Bad Request" } );
    }

    await User.findByIdAndUpdate(req.user._id, { 
        hourly_rate_income: hourlyRateIncome, 
        hourly_rate: hourlyRate, 
        monthly_income: monthlyIncome, 
        tax_percent: taxPercent, 
        currency 
    } );

    res.status(200).json({ message: 'User income information saved' });
});

// @desc Get user income information
// route GET /api/users/income
// @access Private
const getUserIncome = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('currency');

    let monthIncome;

    if(user.hourly_rate_income) {
        const rate = user.hourly_rate;
        const businessDays = countBusinessDays( dayjs().year(), dayjs().month() );

        const totalAmount = rate * 8 * user.currency.value * businessDays;
        monthIncome = totalAmount - (totalAmount * user.tax_percent / 100);
    } else {
        monthIncome = user.monthly_income;
    }

    res.status(200).json({ monthIncome });
});

export {
    authUser,
    logoutUser,
    registerUser,
    saveUserIncome,
    getUserIncome
}