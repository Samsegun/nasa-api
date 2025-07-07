const {
    getAllLaunches: launches,
    removeLaunch,
    existsLaunchWithId,
    abortLaunchWithId,
    scheduleNewLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function getAllLaunches(req, res) {
    console.log(req.query);
    const { skip, limit } = getPagination(req.query);
    const launch = await launches(skip, limit);

    return res.status(200).json(launch);
}

async function postLaunch(req, res) {
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

    let newLaunch;
    try {
        newLaunch = await scheduleNewLaunch(launch);
    } catch (error) {
        return res.status(400).json({
            error: `Launch schedule failed ${error}`,
        });
    }

    return res.status(201).json(newLaunch);
}

async function deleteLaunch(req, res) {
    const { id } = req.params;

    const launchId = parseInt(id);

    const launchExists = await existsLaunchWithId(launchId);
    if (!launchExists) {
        return res.status(404).json({
            error: "Launch not found",
        });
    }

    const aborted = await abortLaunchWithId(launchId);
    if (!aborted) {
        return res.status(400).json({
            error: "Launch not aborted",
        });
    }

    return res.status(200).json({ ok: true });
}

module.exports = {
    getAllLaunches,
    postLaunch,
    deleteLaunch,
};
