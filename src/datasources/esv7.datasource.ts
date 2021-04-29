import {inject, lifeCycleObserver, LifeCycleObserver, ValueOrPromise} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'esv7',
  connector: 'esv7',
  index: 'catalog',
  version: '7.0',
  debug: process.env.APP_ENV === 'dev',
  hosts: [
    {
      protocol: process.env.ELASTIC_SEARCH_PROTOCOL,
      host: process.env.ELASTIC_SEARCH_HOST,
      port: process.env.ELASTIC_SEARCH_PORT,
      auth: 'username:password'
    }
  ],
  configuration: { 
    node: `${process.env.ELASTIC_SEARCH_PROTOCOL}://${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}`,
    //node: process.env.ELASTIC_SEARCH_HOST,
    requestTimeout: process.env.ELASTIC_SEARCH_REQUEST_TIMEOUT,
    pingTimeout: process.env.ELASTIC_SEARCH_PING_TIMEOUT,
  },
  // mappingProperties: {
  //   docType: {
  //     type: 'keyword'
  //   },
  //   id: {
  //     type: 'keyword'
  //   },
  //   name: {
  //     type: 'text',
  //     fields: {
  //       keyword: {
  //         type: 'text',
  //         ignore_above: 256
  //       }
  //     }
  //   },
  //   is_active: {
  //     type: 'boolean'
  //   },
  //   created_at: {
  //     type: 'date'
  //   },
  //   updated_at: {
  //     type: 'date'
  //   }
  // }
  //defaultSize: ''
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class Esv7DataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'esv7';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.esv7', {optional: true})
    dsConfig: object = config
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
   start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
