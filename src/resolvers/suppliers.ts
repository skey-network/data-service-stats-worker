import {
  createGroupPipeline,
  extractCounts,
  Resolver,
  ResolverContext
} from './common'

export const resolveSuppliers: Resolver = async (ctx) => {
  const suppliers = await ctx.collections.suppliers.find().toArray()

  return await Promise.all(
    suppliers.map(async (supplier) => {
      const timestamp = Date.now()

      const [devices, keys, events, organisations] = await Promise.all([
        countDevices(ctx, supplier.address),
        countKeys(ctx, supplier.address),
        countEvents(ctx, supplier.address),
        countOrganisations(ctx, supplier.address)
      ])

      return {
        type: 'supplier',
        id: supplier.address,
        timestamp,
        devices,
        keys,
        events,
        organisations
      }
    })
  )
}

export const countDevices = async (ctx: ResolverContext, address: string) => {
  const pipeline = [
    { $match: { supplier: address } },
    {
      $facet: createGroupPipeline([
        { field: 'active', value: true },
        { field: 'active', value: false },
        { field: 'connected', value: true },
        { field: 'connected', value: false },
        { field: 'visible', value: true },
        { field: 'visible', value: false }
      ])
    }
  ]

  const [obj] = await ctx.collections.devices.aggregate(pipeline).toArray()
  return extractCounts(obj)
}

export const countKeys = async (ctx: ResolverContext, address: string) => {
  const pipeline = [
    { $match: { issuer: address } },
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
  const pipeline = [
    {
      $lookup: {
        from: 'keys',
        localField: 'assetId',
        foreignField: 'assetId',
        as: 'key'
      }
    },
    { $match: { 'key.issuer': address } },
    {
      $facet: createGroupPipeline()
    }
  ]

  const [obj] = await ctx.collections.events.aggregate(pipeline).toArray()
  return extractCounts(obj)
}

export const countOrganisations = async (
  ctx: ResolverContext,
  address: string
) => {
  const pipeline = [
    { $match: { address } },
    {
      $project: {
        count: {
          $cond: {
            if: { $isArray: '$organisations' },
            then: { $size: '$organisations' },
            else: 0
          }
        }
      }
    }
  ]

  const [obj] = await ctx.collections.suppliers.aggregate(pipeline).toArray()
  return { whitelisted: obj?.count ?? 0 }
}
