import {
  createGroupPipeline,
  extractCounts,
  Resolver,
  ResolverContext
} from './common'

export const resolveKeys: Resolver = async (ctx) => {
  const keys = await ctx.collections.keys.find().toArray()

  return await Promise.all(
    keys.map(async (key) => {
      const events = await countEvents(ctx, key.assetId)

      return {
        id: key.assetId,
        timestamp: Date.now(),
        data: { events }
      }
    })
  )
}

export const countEvents = async (ctx: ResolverContext, assetId: string) => {
  const pipeline = [{ $match: { assetId } }, { $facet: createGroupPipeline() }]

  const [doc] = await ctx.collections.events.aggregate(pipeline).toArray()
  return extractCounts(doc)
}
