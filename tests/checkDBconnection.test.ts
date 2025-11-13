import { connectDB, closeDB } from "../src/config/db";
import dotenv from "dotenv";
dotenv.config();
describe("connectDB", () => {
    afterAll(async () => {
        await closeDB();
      });
  it("returns a non-null mongoose connection when env vars are set", async () => {
    const connection = await connectDB();
    expect(connection).not.toBeNull();
  });
});