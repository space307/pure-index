const F = () => false
const T = () => true

type Value = {
  a: boolean
}

type UnusedType = never

export { F, T }
export type { Value, UnusedType }
