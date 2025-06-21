const API_URL = "http://localhost:8000";

async function httpGetPlanets() {
    try {
        const response = await fetch(`${API_URL}/planets`);
        const planets = await response.json();

        return planets;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function httpGetLaunches() {
    try {
        const response = await fetch(`${API_URL}/launches`);
        const fetchedLaunches = await response.json();

        return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function httpSubmitLaunch(launch) {
    try {
        return await fetch(`${API_URL}/launches`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(launch),
        });
    } catch (error) {
        return {
            ok: false,
        };
    }
}

async function httpAbortLaunch(id) {
    try {
        return await fetch(`${API_URL}/launches/${id}`, {
            method: "DELETE",
        });
    } catch (error) {
        return {
            ok: false,
        };
    }
}

export { httpAbortLaunch, httpGetLaunches, httpGetPlanets, httpSubmitLaunch };
