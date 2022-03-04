/*

This code is generated using https://www.graphql-code-generator.com/ and schema from https://arweave.dev/graphql

*/
type Maybe<T> = T | null
// type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
// type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
// type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }

/** All built-in and custom scalars, mapped to their actual values */

export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: unknown
  Upload: unknown
}

export type Query = {
  __typename?: 'Query'
  transaction?: Maybe<Transaction>
  transactions: TransactionConnection
  block?: Maybe<Block>
  blocks: BlockConnection
}

export type QueryTransactionArgs = {
  id: Scalars['ID']
}

export type QueryTransactionsArgs = {
  ids?: Maybe<Array<Scalars['ID']>>
  owners?: Maybe<Array<Scalars['String']>>
  recipients?: Maybe<Array<Scalars['String']>>
  tags?: Maybe<Array<TagFilter>>
  bundledIn?: Maybe<Array<Scalars['ID']>>
  block?: Maybe<BlockFilter>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  sort?: Maybe<SortOrder>
}

export type QueryBlockArgs = {
  id?: Maybe<Scalars['String']>
}

export type QueryBlocksArgs = {
  ids?: Maybe<Array<Scalars['ID']>>
  height?: Maybe<BlockFilter>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  sort?: Maybe<SortOrder>
}

export enum SortOrder {
  HeightAsc = 'HEIGHT_ASC',
  HeightDesc = 'HEIGHT_DESC',
}

export type TagFilter = {
  name: Scalars['String']
  values: Array<Scalars['String']>
  op?: Maybe<TagOperator>
}

export type BlockFilter = {
  min?: Maybe<Scalars['Int']>
  max?: Maybe<Scalars['Int']>
}

export type BlockConnection = {
  __typename?: 'BlockConnection'
  pageInfo: PageInfo
  edges: Array<BlockEdge>
}

export type BlockEdge = {
  __typename?: 'BlockEdge'
  cursor: Scalars['String']
  node: Block
}

export type TransactionConnection = {
  __typename?: 'TransactionConnection'
  pageInfo: PageInfo
  edges: Array<TransactionEdge>
}

export type TransactionEdge = {
  __typename?: 'TransactionEdge'
  cursor: Scalars['String']
  node: Transaction
}

export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
}

export type Transaction = {
  __typename?: 'Transaction'
  id: Scalars['ID']
  anchor: Scalars['String']
  signature: Scalars['String']
  recipient: Scalars['String']
  owner: Owner
  fee: Amount
  quantity: Amount
  data: MetaData
  tags: Array<Tag>
  block?: Maybe<Block>
  /** @deprecated Use `bundledIn` */
  parent?: Maybe<Parent>
  bundledIn?: Maybe<Bundle>
}

export type Parent = {
  __typename?: 'Parent'
  id: Scalars['ID']
}

export type Bundle = {
  __typename?: 'Bundle'
  id: Scalars['ID']
}

export type Block = {
  __typename?: 'Block'
  id: Scalars['ID']
  timestamp: Scalars['Int']
  height: Scalars['Int']
  previous: Scalars['ID']
}

export type MetaData = {
  __typename?: 'MetaData'
  size: Scalars['String']
  type: Maybe<Scalars['String']>
}

export type Amount = {
  __typename?: 'Amount'
  winston: Scalars['String']
  ar: Scalars['String']
}

export type Owner = {
  __typename?: 'Owner'
  address: Scalars['String']
  key: Scalars['String']
}

export type Tag = {
  __typename?: 'Tag'
  name: Scalars['String']
  value: Scalars['String']
}

export enum TagOperator {
  Eq = 'EQ',
  Neq = 'NEQ',
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type TransactionsEdgeResponse = {
  __typename?: 'TransactionEdge'
  cursor: string
  node: {
    __typename?: 'Transaction'
    id: string
    owner: { __typename?: 'Owner'; address: string }
    fee: { __typename?: 'Amount'; ar: string }
    data: { __typename?: 'MetaData'; size: string; type?: string | null | undefined }
    tags: Array<{ __typename?: 'Tag'; name: string; value: string }>
  }
}

export type TransactionsQuery = {
  __typename?: 'Query'
  transactions: {
    __typename?: 'TransactionConnection'
    edges: TransactionsEdgeResponse[]
  }
}

export * as ArweaveGQLTypes from 'utils/gql-schema'
