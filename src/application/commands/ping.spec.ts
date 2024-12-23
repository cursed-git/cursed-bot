import { PingCommand } from "./ping";

describe("PingCommand", () => {
  let sut: PingCommand;

  beforeEach(() => {
    sut = new PingCommand();
  });

  it("Should execute and return pong", async () => {
    await expect(sut.execute()).resolves.toEqual("Pong! 🏓");
  });
});
