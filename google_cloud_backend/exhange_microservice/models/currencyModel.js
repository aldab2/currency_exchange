import mongoose from "mongoose";

const currencySchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    abbreviation:{
        type: String,
        required: true,
        unique: true
    },
    dollarRate:{
        type: Number,
        required: true
    },
});

const Currency = mongoose.model('Currency',currencySchema);

export default Currency;