import { T } from 'package-a'

import type { Value } from 'package-a'

const Component = (props: Value) => (props.a === T() ? '1' : 0)

export { Component }
