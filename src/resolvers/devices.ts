import {
  createGroupPipeline,
  extractCounts,
  Resolver,
  ResolverContext
} from './common'

export const resolveDevices: Resolver = async (ctx) => {
  const devices = await ctx.collections.devices.find().toArray()

  return await Promise.all(
    devices.map(async (device) => {
      const [keys, events] = await Promise.all([
        countKeys(ctx, device.address),
        countEvents(ctx, device.address)
      ])

      return {
        id: device.address,
        timestamp: Date.now(),
        data: { keys, events }
      }
    })
  )
}

export const countKeys = async (ctx: ResolverContext, address: string) => {
  const pipeline = [
    { $match: { device: address } },
    {
      $facet: createGroupPipeline([
        { field: 'burned', value: true },
        { field: 'burned', value: false }
      ])
    }
  ]

  const [doc] = await ctx.collections.keys.aggregate(pipeline).toArray()
  return extractCounts(doc)
}

export const countEvents = async (ctx: ResolverContext, address: string) => {
  const pipeline = [
    { $match: { device: address } },
    { $facet: createGroupPipeline() }
  ]

  const [doc] = await ctx.collections.keys.aggregate(pipeline).toArray()
  return extractCounts(doc)
}
