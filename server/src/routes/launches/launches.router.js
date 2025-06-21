const express = require("express");
const {
    getAllLaunches,
    postLaunch,
    deleteLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", postLaunch);
launchesRouter.delete("/:id", deleteLaunch);

module.exports = launchesRouter;
