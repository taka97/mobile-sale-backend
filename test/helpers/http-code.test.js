import { expect } from 'chai';
import httpCode from '../../src/helpers/http-code';
import * as code from '../../src/helpers/http-code';

describe('#Http code', () => {
  it('via default', () => {
    expect(httpCode.Ok).to.equal(200);
    expect(httpCode.Created).to.equal(201);
    expect(httpCode.Accepted).to.equal(202);
    expect(httpCode.NoAuthoritativeInformation).to.equal(203);
    expect(httpCode.NoContent).to.equal(204);
  });

  it('via named export', () => {
    expect(code.Ok).to.equal(200);
    expect(code.Created).to.equal(201);
    expect(code.Accepted).to.equal(202);
    expect(code.NoAuthoritativeInformation).to.equal(203);
    expect(code.NoContent).to.equal(204);
  });
});
