const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
    it("should respond with 200 success", async () => {
        const response = await request(app)
            .get("/launches")
            .expect("Content-Type", /json/)
            .expect(200);
    });
});

describe("Test POST /launch", () => {
    const completeLaunchData = {
        launchDate: "July 27, 2032",
        target: "MSC 91f",
        rocket: "NSS 124",
        mission: "Spy Exploration A",
    };

    const launchDataWithoutDate = {
        target: "MSC 91f",
        rocket: "NSS 124",
        mission: "Spy Exploration A",
    };

    const launchDataWithInvalidtDate = {
        target: "MSC 91f",
        rocket: "NSS 124",
        mission: "Spy Exploration A",
        launchDate: "hey there",
    };

    it("should respond with 201 success", async () => {
        const response = await request(app)
            .post("/launches")
            .send(completeLaunchData)
            .expect("Content-Type", /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(requestDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    it("should catch missing required properties", async () => {
        const response = await request(app)
            .post("/launches")
            .send(launchDataWithoutDate)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: "Missing one or more launch property",
        });
    });

    it("should catch invalid dates", async () => {
        const response = await request(app)
            .post("/launches")
            .send(launchDataWithInvalidtDate)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: "Invalid launch date",
        });
    });
});
