import { T } from 'package-a'

const Component = props => (props.a === T() ? '1' : 0)

export { Component }
