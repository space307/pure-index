class ObservableSet extends Set<string> {
  private emptyCallback: (() => void) | null;

  constructor(iterable?: Iterable<string>) {
    super(iterable);
    this.emptyCallback = null;
  }

  add(value: string) {
    super.add(value);
    return this;
  }

  delete(value: string) {
    const result = super.delete(value);
    this.checkSize();
    return result;
  }

  clear() {
    super.clear();
    this.checkSize();
  }

  onEmpty(callback: () => void) {
    this.emptyCallback = callback;
  }

  private checkSize() {
    if (this.size === 0 && this.emptyCallback) {
      this.emptyCallback();
    }
  }
}

export { ObservableSet };
