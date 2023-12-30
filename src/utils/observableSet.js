class ObservableSet extends Set {
  constructor(iterable) {
    super(iterable)
    this.emptyCallback = null
  }

  add(value) {
    super.add(value)
  }

  delete(value) {
    const result = super.delete(value)
    this.checkSize()
    return result
  }

  clear() {
    super.clear()
    this.checkSize()
  }

  onEmpty(callback) {
    this.emptyCallback = callback
  }

  checkSize() {
    if (this.size === 0 && this.emptyCallback) {
      this.emptyCallback()
    }
  }
}

export { ObservableSet }
