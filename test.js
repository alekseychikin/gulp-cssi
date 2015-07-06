var assert = require('assert');
var fs = require('fs');
describe('Match main.css', function ()
{
  it('Have to be equal', function ()
  {
    assert.equal(fs.readFileSync('example/main.css', 'utf8'), fs.readFileSync('test/main.css', 'utf8'));
  });
});
