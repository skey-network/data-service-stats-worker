export interface SubDocument<T = any> {
  timestamp: number
  data: T
}

export interface MainDocument<T = any> {
  type: string
  id: string
  current: SubDocument<T>
  historical: SubDocument<T>[]
}
