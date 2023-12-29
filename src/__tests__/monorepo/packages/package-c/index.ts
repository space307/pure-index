import { ususedFn } from 'package-d'

const identity = <T>(x: T) => {
  ususedFn()
  return x
}

export { identity }
