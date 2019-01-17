declare module 'vogels-promisified' {
  import { JoiObject } from 'joi'
  const AWS: any
  const types: any
  const models: {
    [modelName: string]: compiledTable
  }

  function define(modelName: string, config: object): compiledTable

  type KeyType = string | number
  type HashKey = KeyType
  type RangeKey = KeyType | null
  type Key = { [hashOrRange: string]: HashKey | RangeKey } | KeyType | any
  type Keys = Key[]
  type Callback<Type> = (err: Error, data: Models<Type>) => void 

  interface BaseOptions {
    ReturnValues?: true | 'NONE' | 'ALL_OLD' | 'UPDATED_OLD' | 'ALL_NEW' | 'UPDATED_NEW'
    ReturnConsumedCapacity?: 'INDEXES' | 'TOTAL' | 'NONE'
    ConditionExpression?: string
    ExpressionAttributeNames?: object
    ExpressionAttributeValues?: object
    Expected?: object
    expected?: object
  }

  interface CreateOptions extends BaseOptions {
    overwrite?: boolean
  }

  interface UpdateOptions extends BaseOptions {
    UpdateExpression?: string
  }

  interface DestroyOptions extends BaseOptions {}

  interface compiledTable {
    [x: string]: any
    get<Type>(key: Key, options?: any, callback?: Callback<Type>): any
    get<Type>(hashKey: HashKey, rangeKey?: RangeKey, options?: any, callback?: Callback<Type>): any
    getItems<Type>(batch: Keys, options?: any, callback?: Callback<Type>): any
    create<Type>(item: Type | Type[], options?: CreateOptions, callback?: Callback<Type>): any
    update<Type>(item: Type, options?: UpdateOptions, callback?: Callback<Type>): any
    destroy<Type>(key: Key, options?: DestroyOptions, callback?: Callback<Type>): any
    destroy<Type>(hashKey: HashKey, rangeKey?: RangeKey, options?: DestroyOptions, callback?: Callback<Type>): any
    query(hashKey: HashKey): QueryBuilder
    scan(): ScanBuilder
    parallelScan(totalSegments: any): BaseBuilder

    // table ddl methods
    // createTable(): any
    // updateTable(): any
    // describeTable(): any
    // deleteTable(): any
    // tableName(): any

    getAsync<Type>(key: Key, options?: any): Promise<Model<Type> | null>
    getAsync<Type>(hashKey: HashKey, rangeKey?: RangeKey, options?: any): Promise<Model<Type> | null>
    getItemsAsync<Type>(batch: Keys, options?: any): Promise<Model<Type>[] | null>

    createAsync<Type>(itme: Type | Type[], options?: CreateOptions): Promise<Model<Type> | null>
    updateAsync<Type>(itme: Type, options?: UpdateOptions): Promise<Model<Type> | null>
    destroyAsync(key: Key, options?: DestroyOptions): Promise<any>
    destroyAsync(hashKey: HashKey, rangeKey?: RangeKey, options?: DestroyOptions): Promise<any>
  }

  interface BaseBuilder {
    where(field: string): BaseBuilderFilter<QueryBuilder> | ExtendedBuilderFilter<ScanBuilder>
    loadAll(): BaseBuilder
    usingIndex(indexName: string): BaseBuilder
    startKey(key: Key): BaseBuilder
    startKey(hashKey: HashKey, rangeKey?: RangeKey): BaseBuilder
    limit(limit: number): BaseBuilder
    select(COUNT: 'COUNT'): BaseBuilder
    attributes(fields: string[]): BaseBuilder
    execAsync<Type>(): Promise<Models<Type>>
    exec<Type>(callback?: Callback<Type>): void
    
    returnConsumedCapacity(): BaseBuilder
    filterExpression(expression: string): BaseBuilder
    expressionAttributeValues(attributeValues: object): BaseBuilder
    expressionAttributeNames(attributeNames: object): BaseBuilder
    projectionExpression(expression: string): BaseBuilder
  }
  
  interface QueryBuilder extends BaseBuilder {
    where(field: string): BaseBuilderFilter<QueryBuilder>
    filter(field: string): ExtendedBuilderFilter<QueryBuilder>
    ascending(): BaseBuilder
    descending(): BaseBuilder
  }

  interface ScanBuilder extends BaseBuilder {
    where(field: string): ExtendedBuilderFilter<ScanBuilder>
  }

  interface BaseBuilderFilter<Builder> {
    equals(value: any): Builder
    lte(value: any): Builder
    lt(value: any): Builder
    gt(value: any): Builder
    gte(value: any): Builder
    beginsWith(value: any): Builder
    between(value1: any, value2: any): Builder
  }

  interface ExtendedBuilderFilter<Builder> extends BaseBuilderFilter<Builder> {
    null(): Builder
    notNull(): Builder
    contains(value: string): Builder
    notContains(value: string): Builder
    in(values: string[]): Builder
  }

  class Table {
    [x: string]: any
    config: {
      name: string,
      [x: string]: any
    }
    schema: {
      secondaryIndexes: {},
      globalIndexes: object,
      hashKey: string,
      rangeKey?: string,
      tableName: string,
      timestamps: boolean,
      createdAt?: any,
      updatedAt?: any,
      _modelSchema: any,
      _modelDataTypes: any
    }
    serializer: any
    docClient: AWS.DynamoDB.DocumentClient
    log: any
  }

  class Models<Type> {
    Items: Model<Type>[] | null
    Count: number
    ScannedCount: number
    ConsumedCapacity?: {
      CapacityUnits: number,
      TableName: string
    }
    LastEvaluatedKey: any
  }

  class Model<Type> {
    table: Table
    attrs: Type
    get(attrName?: string): any
    getAsync(attrName?: string): any
    set(attrs: object): any
    update(options?: any, callback?: Callback<Type>): void
    updateAsync(options?: any, callback?: Callback<Type>): void
    update(callback?: Callback<Type>): void
    updateAsync(callback?: Callback<Type>): void
    destroy(options?: any, callback?: Callback<Type>): void
    destroyAsync(options?: any, callback?: Callback<Type>): void
    destroy(callback?: Callback<Type>): void
    destroyAsync(callback?: Callback<Type>): void
    toJSON(): Type
  }
}
