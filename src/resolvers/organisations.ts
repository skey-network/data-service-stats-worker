import {
  createGroupPipeline,
  extractCounts,
  Resolver,
  ResolverContext
} from './common'

export const resolveOrganisations: Resolver = async (ctx) => {
  const organisations = await ctx.collections.organisations.find().toArray()

  return await Promise.all(
    organisations.map(async (org) => {
      const [devices, keys, users] = await Promise.all([
        countDevices(ctx, org.address),
        countKeys(ctx, org.address),
        countUsers(ctx, org.address)
        // countEvents(ctx, org.address)
      ])

      return {
        id: org.address,
        timestamp: Date.now(),
        data: {
          devices,
          keys,
          users
        }
      }
    })
  )
}

export const countDevices = async (ctx: ResolverContext, address: string) => {
  const pipeline = [
    { $match: { owner: address } },
    { $group: { _id: '$device' } },
    { $count: 'count' }
  ]

  const [doc] = await ctx.collections.keys.aggregate(pipeline).toArray()
  return { all: doc?.count ?? 0 }
}

export const countKeys = async (ctx: ResolverContext, address: string) => {
  const pipeline = [
    { $match: { owner: address } },
    {
      $facet: createGroupPipeline([
        { field: 'burned', value: true },
        { field: 'burned', value: false }
      ])
    }
  ]

  const [obj] = await ctx.collections.keys.aggregate(pipeline).toArray()
  return extractCounts(obj)
}

export const countEvents = async (ctx: ResolverContext, address: string) => {
  // TODO use deviceActionAs organisation parameter

  const pipeline = [
    {
      $lookup: {
        from: 'keys',
        localField: 'assetId',
        foreignField: 'assetId',
        as: 'key'
      }
    },
    { $match: { 'key.owner': address } },
    {
      $facet: createGroupPipeline()
    }
  ]

  const [obj] = await ctx.collections.events.aggregate(pipeline).toArray()
  return extractCounts(obj)
}

export const countUsers = async (ctx: ResolverContext, address: string) => {
  const pipeline = [
    { $match: { address } },
    {
      $project: {
        count: {
          $cond: {
            if: { $isArray: '$users' },
            then: { $size: '$users' },
            else: 0
          }
        }
      }
    }
  ]

  const [obj] = await ctx.collections.organisations
    .aggregate(pipeline)
    .toArray()

  return { whitelisted: obj?.count ?? 0 }
}
