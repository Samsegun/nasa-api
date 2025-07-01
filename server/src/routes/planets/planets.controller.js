const {
    getAllPlanets: getAllHabitablePlanets,
} = require("../../models/planets.model");

async function getAllPlanets(req, res) {
    return res.status(200).json(await getAllHabitablePlanets());
}

module.exports = {
    getAllPlanets,
};
