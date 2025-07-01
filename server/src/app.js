const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const api = require("./routes/api");

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
// support for versioning
app.use("/v1", api);
//v2 doesn't exist yet, just used as an example in case of future versions
// app.use("/v2", apiv2);

app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
