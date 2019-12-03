import { expect } from 'chai';
import * as code from '../../src/helpers/http-code';

describe('Http code - Helper', () => {
  it('via named export', () => {
    expect(code.Ok).to.equal(200);
    expect(code.Created).to.equal(201);
    expect(code.Accepted).to.equal(202);
    expect(code.NoAuthoritativeInformation).to.equal(203);
    expect(code.NoContent).to.equal(204);
  });
});
