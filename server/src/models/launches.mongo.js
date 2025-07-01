const mongoose = require("mongoose");
// const { Schema } = require("mongoose");

const launchesSchema = mongoose.Schema(
    {
        flightNumber: {
            type: Number,
            required: true,
        },
        launchDate: {
            type: Date,
            required: true,
        },
        target: {
            type: String,
        },
        rocket: {
            type: String,
            required: true,
        },
        mission: {
            type: String,
            required: true,
        },
        customers: [String],
        upcoming: {
            type: Boolean,
            required: true,
        },
        success: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// const launchSchema = mongoose.Schema(
//     {
//         flightNumber: {
//             type: Number,
//             required: true,
//         },
//         launchDate: {
//             type: Date,
//             required: true,
//         },
//         target: {
//             type: Schema.Types.ObjectId,
//             ref: "Planet",
//             required: true,
//         },
//         rocket: {
//             type: String,
//             required: true,
//         },
//         mission: {
//             type: String,
//             required: true,
//         },
//         customers: [String],
//         upcoming: {
//             type: Boolean,
//             required: true,
//         },
//         success: {
//             type: Boolean,
//             required: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// connects launchesSchema with the "launches" collection on mongoDB
module.exports = mongoose.model("Launch", launchesSchema);
