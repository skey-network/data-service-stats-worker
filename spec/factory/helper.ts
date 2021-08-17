import { sha256, base58Encode } from '@waves/ts-lib-crypto'

export type RNG = () => number

export const randInt = (rng: RNG, min: number, max: number) =>
  Math.floor(rng() * (max - min) + min)

export const randDate = (rng: () => number) => {
  const min = 1546300800000 // Jan 01 2019
  const max = 1640995200000 // Jan 01 2022

  return new Date(randInt(rng, min, max))
}

export const randBool = (rng: RNG) => rng() < 0.5

export const randString = (rng: RNG, n: number) => {
  const hash = sha256(Buffer.from(rng().toString()))
  return base58Encode(hash).substring(0, n)
}

export const randElement = <T>(rng: RNG, arr: T[]) =>
  arr[randInt(rng, 0, arr.length)]

export const randSubArray = <T>(rng: RNG, arr: T[]) => {
  const length = randInt(rng, 0, arr.length)
  const indices = randIntSequence(rng, length, 0, arr.length)

  return indices.map((index) => arr[index])
}

export const randIntSequence = (
  rng: RNG,
  n: number,
  min: number,
  max: number
) => {
  const set = new Set<number>()

  while (set.size !== n) {
    set.add(randInt(rng, min, max))
  }

  return [...set]
}

export const randAddress = (rng: RNG) => randString(rng, 35)

export const randTxHash = (rng: RNG) => randString(rng, 42)

export const randWord = (rng: RNG) => randString(rng, 10)

export const createNItems = <T>(rng: RNG, n: number, func: (rng: RNG) => T) =>
  Array(n)
    .fill(null)
    .map(() => func(rng))

export const randomItemsWithTimestamps = (rng: RNG, n: number) =>
  Array(n)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      createdAt: randDate(rng)
    }))
