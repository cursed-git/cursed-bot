// jest.config.ts
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t)s$": "ts-jest",
  },
  clearMocks: true,
  coveragePathIgnorePatterns: [
    "test",
    "node_modules",
    "dist",
    "jest.config.ts",
    "/functions/.+?/index\\.ts$",
    "/src/index.ts",
    "infrastructure/config",
  ],
  collectCoverageFrom: ["**/*.(t)s", "!dist/*"],
  coverageReporters: ["json", "text", "lcov", "cobertura", "html"],
  reporters: ["default"],
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^@functions/(.*)$": "<rootDir>/src/functions/$1",
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^@providers/(.*)$": "<rootDir>/src/providers/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
    "^@errors/(.*)$": "<rootDir>/src/errors/$1",

    "^@application/(.*)$": "<rootDir>/src/application/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
  },
};
export default config;
