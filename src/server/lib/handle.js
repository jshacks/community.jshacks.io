import * as Kefir from 'kefir'

const fn = (obj, name, opts) => Kefir.fromNodeCallback(cb => {
  if (opts) {
    obj[name](opts, cb)
  } else {
    obj[name](cb)
  }
})

export default fn
