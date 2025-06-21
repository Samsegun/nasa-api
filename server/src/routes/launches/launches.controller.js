const {
    getAllLaunches: launches,
    addLaunch,
    removeLaunch,
    existsLaunchWithId,
    abortLaunchWithId,
} = require("../../models/launches.model");

function getAllLaunches(req, res) {
    return res.status(200).json(launches());
}

function postLaunch(req, res) {
    const launch = req.body;

    if (
        !launch.launchDate ||
        !launch.mission ||
        !launch.rocket ||
        !launch.target
    ) {
        return res.status(400).json({
            error: "Missing one or more launch property",
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (launch.launchDate.toString() === "Invalid Date") {
        return res.status(400).json({
            error: "Invalid launch date",
        });
    }

    return res.status(201).json(addLaunch(launch));
}

function deleteLaunch(req, res) {
    const { id } = req.params;

    const launchId = parseInt(id);

    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: "Launch not found",
        });
    }

    const aborted = abortLaunchWithId(launchId);
    return res.status(200).json(aborted);
}

module.exports = {
    getAllLaunches,
    postLaunch,
    deleteLaunch,
};
