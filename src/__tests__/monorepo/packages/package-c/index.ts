import { unusedFn } from 'package-d'

const identity = <T>(x: T) => {
  unusedFn()
  return x
}

export { identity }
