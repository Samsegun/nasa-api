const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const planetsSchema = mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    },
});

// connects planetsSchema with the "planets" collection on mongoDB
module.exports = mongoose.model("Planet", planetsSchema);
