const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    launchDate: new Date("December 27, 2030"),
    target: "Kepler-442 b",
    rocket: "Explorer IS1",
    mission: "Kepler Exploration X",
    customers: ["NASA", "ZTM"],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addLaunch(launchData) {
    latestFlightNumber++;

    launches.set(latestFlightNumber, {
        ...launchData,
        flightNumber: latestFlightNumber,
        customers: ["NASA", "Samsegun"],
        upcoming: true,
        success: true,
    });

    return launches.get(latestFlightNumber);
}

function existsLaunchWithId(launchId) {
    return launches.has(parseInt(launchId));
}

function abortLaunchWithId(launchId) {
    const aborted = launches.get(launchId);

    aborted.upcoming = false;
    aborted.success = false;

    return aborted;
}

module.exports = {
    getAllLaunches,
    addLaunch,
    abortLaunchWithId,
    existsLaunchWithId,
};
