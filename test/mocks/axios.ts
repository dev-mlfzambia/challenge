/**
 * E2E mock for axios so Jest does not need to transform ESM in node_modules.
 */
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => mockAxios),
  defaults: { headers: { common: {} } },
};
export default mockAxios;
