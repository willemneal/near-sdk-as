import { ExecutionResult, init_simulator, UserAccount } from "..";
import { join } from "path";
import { getGuestPanicMsg } from "./common";

let root: UserAccount;
let counter: UserAccount, alice: UserAccount;

function increment(value: number) {
  return root.call("counter", "incrementCounter", { value });
}

describe("counter", () => {
  beforeEach(() => {
    root = init_simulator();
    counter = root.deploy(
      join(__dirname, "..", "build", "debug", "counter.wasm"),
      "counter",
      "112897800000000000000000000000"
    );
  });

  it("should increment", () => {
    const first = counter.view_self("getCounter");
    const delta = 3;
    const res = increment(delta);
    res.assert_success();
    const second = counter.view_self("getCounter");
    expect(second).toBe(first + delta);
  });

  it("should increment with default of one", () => {
    const first = counter.view_self("getCounter");
    const incrementBy = 1;
    const res = root.call("counter", "incrementCounter");
    res.assert_success();
    const second = counter.view_self("getCounter");
    expect(second).toBe(first + incrementBy);
  });
});
