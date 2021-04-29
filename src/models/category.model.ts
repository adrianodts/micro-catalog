import {Entity, model, property} from '@loopback/repository';

@model({
  //name: "categories",
  // settings: {
  //   strict: false
  // }
})
export class Category extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'boolean',
    required: false,
    default: true
  })
  is_active: boolean;

  @property({
    //name: 'createdAt', //Para modificar o nome do campo no metadado
    type: 'date',
    required: true,
    default: 'now'
  })
  created_at: string;

  @property({
    type: 'date',
    required: false
  })
  updated_at: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
