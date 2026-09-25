import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    // Transform ESM-only oauth4webapi so boundary tests can use the
    // real library.  The default ts-jest preset only covers .ts files.
    "node_modules/oauth4webapi/.+\\.js$": [
      "ts-jest",
      { useESM: false, tsconfig: { allowJs: true, esModuleInterop: true } },
    ],
  },
  transformIgnorePatterns: ["/node_modules/(?!oauth4webapi/)"],
};
