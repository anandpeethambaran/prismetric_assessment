const app = require('../../src/app');

describe('\'employee\' service', () => {
  it('registered the service', () => {
    const service = app.service('employee');
    expect(service).toBeTruthy();
  });
});
