import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: '<rootDir>/tests/config/CustomNodeEnvironment.ts',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
};

export default config;
