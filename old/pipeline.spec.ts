import * as pipeline from './pipeline'

it('createIntervals', () => {
  const expected = [
    { id: 'n0', min: 168, max: 191, dateField: 'createdAt' },
    { id: 'n1', min: 192, max: 215, dateField: 'createdAt' },
    { id: 'n2', min: 216, max: 239, dateField: 'createdAt' },
    { id: 'n3', min: 240, max: 263, dateField: 'createdAt' },
    { id: 'n4', min: 264, max: 287, dateField: 'createdAt' },
    { id: 'n5', min: 288, max: 311, dateField: 'createdAt' },
    { id: 'n6', min: 312, max: 335, dateField: 'createdAt' }
  ]

  expect(
    pipeline.createIntervals({
      n: 7,
      size: 24,
      begin: 168,
      dateField: 'createdAt'
    })
  ).toEqual(expected)
})

it('createFacetChunk', () => {
  const expected = {
    n1: [
      {
        $match: {
          createdAt: {
            $gte: new Date(24),
            $lte: new Date(47)
          }
        }
      },
      {
        $count: 'size'
      }
    ]
  }

  const result = pipeline.createFacetChunk({
    id: 'n1',
    min: 24,
    max: 47,
    dateField: 'createdAt'
  })

  expect(result).toEqual(expected)
})

it('createFacetQuery', () => {
  const query = pipeline.createFacetQuery({
    n: 30,
    size: 24,
    begin: 0,
    dateField: 'createdAt'
  })

  expect(query.$facet).toBeDefined()
  expect(query.$facet.n0).toBeDefined()
  expect(query.$facet.n29).toBeDefined()
})

describe('parseQueryResults', () => {
  const example = [
    {
      n0: [
        {
          size: 1
        }
      ],
      n1: [
        {
          size: 777
        }
      ],
      n2: [
        {
          size: 13
        }
      ]
    }
  ]

  const expected = [1, 777, 13]

  expect(pipeline.parseQueryResults(example)).toEqual(expected)
  expect(pipeline.parseQueryResults([{ a: [] }])).toEqual([0])
})
