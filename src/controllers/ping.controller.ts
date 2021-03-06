import {Request, RestBindings, get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import { CategoryRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { debug } from 'console';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(CategoryRepository) private categoryRepo: CategoryRepository
  ) {}

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack11111',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/categories')
  async index() {
    // debug(this.categoryRepo);
    await this.categoryRepo.create({
      id: '1',
      name: 'Product 1',
      // eslint-disable-next-line @typescript-eslint/camelcase
      created_at: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/camelcase
      updated_at: new Date().toISOString()
    });
    return this.categoryRepo.find();
  }
}
