export interface IntervalsConfig {
  n: number
  size: number
  begin: number
  dateField: string
}

export interface FacetChunkInput {
  id: string
  dateField: string
  min: number
  max: number
}

export type QueryResults = {
  [key: string]: {
    size: number
  }[]
}[]

export const createIntervals = (c: IntervalsConfig): FacetChunkInput[] =>
  Array(c.n)
    .fill(null)
    .map((_, k) => ({
      id: `n${k}`,
      min: c.begin + c.size * k,
      max: c.begin + (c.size * (k + 1) - 1),
      dateField: c.dateField
    }))

export const createFacetQuery = (config: IntervalsConfig) =>
  createIntervals(config)
    .map(createFacetChunk)
    .reduce(
      (prev, curr) => ({ ...prev, $facet: { ...prev.$facet, ...curr } }),
      { $facet: {} as any }
    )

export const createFacetChunk = (input: FacetChunkInput) => ({
  [input.id]: [
    {
      $match: {
        [input.dateField]: {
          $gte: new Date(input.min),
          $lte: new Date(input.max)
        }
      }
    },
    { $count: 'size' }
  ]
})

export const parseQueryResults = (results: QueryResults) => {
  return Object.values(results[0]).map((chunk) => chunk?.[0]?.size ?? 0)
}
