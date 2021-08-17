import { Collections } from '../db'

export interface ResolverContext {
  collections: Collections
}

export type Resolver = (ctx: ResolverContext) => Promise<any>

export interface GroupField {
  field: string
  value: any
}

export const createGroupPipeline = (fields: GroupField[] = []) => {
  return Object.fromEntries([
    ['all', [{ $count: 'count' }]],
    ...fields.map((f) => [
      `${f.field}_${f.value ?? 'null'}`,
      [{ $match: { [f.field]: f.value } }, { $count: 'count' }]
    ])
  ])
}

export const extractCounts = (obj: any) =>
  Object.entries(obj)
    .map(([key, value]) => ({
      [key]: (value as any)[0]?.count ?? 0
    }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})
