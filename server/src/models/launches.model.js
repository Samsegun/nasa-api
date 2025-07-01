const axios = require("axios");

const Launch = require("./launches.mongo");

const Planet = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const SAPCEX_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
    console.log("downloading launch data...");

    const response = await axios.post(SAPCEX_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1,
                    },
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    });

    if (response.status !== 200) {
        console.log("problem downloading launch data");
        throw new Error("Launch data failed to download");
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc["payloads"];
        const customers = payloads.flatMap(payload => {
            return payload["customers"];
        });

        const launch = {
            flightNumber: launchDoc["flight_number"],
            launchDate: launchDoc["date_local"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            customers,
        };

        // console.log(`${launch.flightNumber} ${launch.mission}`);

        await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });

    if (firstLaunch) {
        console.log("Launch data already loaded");
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await Launch.findOne(filter);
}

async function getLatestFlightNumber() {
    const latestLaunch = await Launch.findOne().sort("-flightNumber");

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await Launch.find(
        {},
        {
            __v: 0,
        }
    )
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch) {
    return await Launch.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        },
        launch,
        {
            upsert: true,
            new: true,
        }
    );
}

async function scheduleNewLaunch(launchData) {
    const planetExists = await Planet.findOne({
        keplerName: launchData.target,
    });

    if (!planetExists) {
        throw new Error("Planet does not exist");
    }

    const newFlightNumber = (await getLatestFlightNumber()) + 1;

    const newLaunch = {
        ...launchData,
        customers: ["NASA", "Samsegun"],
        upcoming: true,
        success: true,
        flightNumber: newFlightNumber,
    };

    return await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
}

async function abortLaunchWithId(launchId) {
    const aborted = await Launch.updateOne(
        {
            flightNumber: launchId,
        },
        {
            upcoming: false,
            success: false,
        }
    );

    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchWithId,
    existsLaunchWithId,
    loadLaunchData,
};
