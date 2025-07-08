import {
  IncompleteKesselConfigurationError,
  defaultKeepAlive,
  defaultCredentials,
} from "../index";

describe("IncompleteKesselConfigurationError", () => {
  it("Creates error with single missing field", () => {
    const error = new IncompleteKesselConfigurationError(["target"]);
    expect(error.message).toEqual(
      "IncompleteKesselConfigurationError: Missing the following fields to build: target",
    );
  });

  it("Creates error with multiple missing fields", () => {
    const error = new IncompleteKesselConfigurationError([
      "target",
      "credentials",
      "keepAlive",
    ]);
    expect(error.message).toEqual(
      "IncompleteKesselConfigurationError: Missing the following fields to build: target,credentials,keepAlive",
    );
  });

  it("Creates error with empty fields array", () => {
    const error = new IncompleteKesselConfigurationError([]);
    expect(error.message).toEqual(
      "IncompleteKesselConfigurationError: Missing the following fields to build: ",
    );
  });
});

describe("Default functions", () => {
  it("defaultKeepAlive returns expected values", () => {
    const keepAlive = defaultKeepAlive();
    expect(keepAlive.timeMs).toEqual(10000);
    expect(keepAlive.timeoutMs).toEqual(5000);
    expect(keepAlive.permitWithoutCalls).toEqual(true);
  });

  it("defaultCredentials returns secure credentials config", () => {
    const credentials = defaultCredentials();
    expect(credentials).toEqual({
      type: "secure",
    });
  });
}); 