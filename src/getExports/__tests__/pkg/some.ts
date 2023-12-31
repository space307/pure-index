const F = () => false

type Falsy = false
type Truthly = true
type Nil = undefined | null

// @ts-expect-error because of my tsconfig settings
export { F, Truthly }
export type { Falsy, Nil }
export const identity = <T>(x: T): T => x
