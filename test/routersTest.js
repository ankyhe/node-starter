import {assert} from 'chai';

import routers from 'src/routers';
import HTTP_VERB_CONSTANTS from 'src/utils/httpVerbConstants';

describe('test routers', function testRouters() {
  it('test routers key value types', function testRoutersKeyValueType() {
    routers.forEach(({method, path, config: {handler}}) => {
      assert.isTrue(method in HTTP_VERB_CONSTANTS);
      assert.isString(path);
      assert.isTrue(path.startsWith('/'));
      assert.isFunction(handler);
    });
  });
});
