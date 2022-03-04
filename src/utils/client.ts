import { useAuth } from 'context/auth-context'
import { GraphQLClient, gql } from 'graphql-request'
import { useInfiniteQuery } from 'react-query'
import { useArweave } from '../context/arweave'
import { ArweaveGQLTypes } from './gql-schema'
import { fileDecrypt } from 'ardrive-core-js/lib/crypto'
import { deriveFileKey } from 'utils/crypto'
import jwkToPem, { JWK } from 'jwk-to-pem'
import { useDriveKey } from 'hooks/useDriveKey'

const gqlEndpoint = process.env.GRAPHQL_ENDPOINT

if (!gqlEndpoint) {
  throw new Error('Missing GQL endpoint')
}

const GQLclient = new GraphQLClient(gqlEndpoint)

type Tag = { name: string; values: string[] }

type TransactionsByOwner = {
  transactions: ArweaveGQLTypes.TransactionsEdgeResponse
  transactionData: unknown
}[]

function useTransactionsByOwner(tags: Tag[]) {
  const [arweave] = useArweave()
  const { state } = useAuth()
  const deriveDriveKey = useDriveKey()
  const owner = state.address
  return useInfiniteQuery({
    queryKey: ['transactions', { owner, tags: tags, after: '' }],
    getNextPageParam: (lastPage: TransactionsByOwner) => {
      const lastTransaction = lastPage[lastPage.length - 1]
      return lastTransaction?.transactions?.cursor ?? undefined
    },
    queryFn: async ({ pageParam = '' }) => {
      const { transactions } = await GQLclient.request<ArweaveGQLTypes.TransactionsQuery>(
        gql`
          query transactions($owner: String!, $tags: [TagFilter!], $after: String) {
            transactions(owners: [$owner], tags: $tags, first: 16, after: $after) {
              edges {
                cursor
                node {
                  id
                  owner {
                    address
                  }
                  fee {
                    ar
                  }
                  data {
                    size
                    type
                  }
                  tags {
                    name
                    value
                  }
                }
              }
            }
          }
        `,
        { owner, tags, after: pageParam },
      )
      const transactionsPromises = await Promise.all(
        transactions?.edges.map(async transaction => {
          return {
            transactionData: await arweave?.transactions.getData(transaction.node.id, {
              decode: true,
            }),
            ...transaction,
          }
        }),
      )

      const transactionsWithData = await Promise.all(
        transactionsPromises?.map(async transaction => {
          const cipherIV = transaction.node.tags.find(tag => tag.name === 'cipherIV')?.value as string
          const driveId = transaction.node.tags.find(tag => tag.name === 'Archive-Id')?.value as string
          const fileId = transaction.node.tags.find(tag => tag.name === 'File-Id')?.value as string
          const password = jwkToPem(state.privateKey as JWK, { private: true })
          const driveKey = await deriveDriveKey(password, driveId)
          const fileKey = await deriveFileKey(fileId, driveKey)
          const decryptedData = await fileDecrypt(cipherIV, fileKey, Buffer.from(transaction.transactionData))
          return {
            transactions: transaction,
            transactionData: JSON.parse(decryptedData.toString()),
          }
        }),
      )

      return await transactionsWithData
    },
  })
}

export { GQLclient, useTransactionsByOwner }
