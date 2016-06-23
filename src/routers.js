import Joi from 'joi';

import helloController from './controllers/helloController';
import HTTP_VERB_CONSTANTS from './utils/httpVerbConstants';

const routers = [
  {
    method: HTTP_VERB_CONSTANTS.GET,
    path: '/api/hello/{name}',
    config: {
      handler: helloController.getHello,
      description: 'hello for name',
      tags: ['api'],
      notes: ['Give a name and reply the hello for the name'],
      validate: {
        params: {
          name: Joi.string().required().description('The name for hello'),
        }
      }
    }
  },
];

export {routers as default} ;

