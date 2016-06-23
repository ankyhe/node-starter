import sinon from 'sinon';
import {default as chai, assert} from 'chai';
import sinonChai from 'sinon-chai';

import helloController from 'src/controllers/helloController';

chai.should();
chai.use(sinonChai);

describe('test helloController', function testHelloController() {
  it('testGetHello', function testGetHello() {
    const request = {
      params: {
        name: 'world'
      }
    };

    const reply = sinon.spy();
    helloController.getHello(request, reply);
    reply.should.have.been.calledWith({data: 'hello for world!'});
    assert(reply.should.have.been.calledOnce);
  });
});
