class Result {
  constructor(isSuccess, value, error) {
    this.isSuccess = isSuccess
    this.value = value
    this.error = error
  }

  static Ok(value) {
    return new Result(true, value, null)
  }

  static Err(error) {
    return new Result(false, null, error)
  }
}

export { Result }
