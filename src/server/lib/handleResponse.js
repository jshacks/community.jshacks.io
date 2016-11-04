
const fn = (errFn, successFn) =>
  (err, data) => {
    if (err) {
      errFn(err)
    } else {
      successFn(data)
    }
  }

export default fn
