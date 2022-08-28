/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup-tests.ts'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '~/(.*)': '<rootDir>/tests/$1',
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/src/@types',
    '<rootDir>/src/app.ts',
    '<rootDir>/src/DB/connection.ts',
    '<rootDir>/src/Server',
    '<rootDir>/src/api-docs',
  ],
};
