import Vue from "vue"

const defaultCode = 'en-us'

Vue.prototype.$i18nCode = ''
Vue.prototype.$strings = {}

var translations = {}

function loadTranslationStrings(code) {
  return new Promise((resolve) => {
    import(`../strings/${code}`).then((fileContents) => {
      resolve(fileContents.default)
    }).catch((error) => {
      console.error('Failed to load i18n strings', code, error)
      resolve({})
    })
  })
}

async function loadi18n(code) {
  if (Vue.prototype.$i18nCode == code) {
    // already set
    return
  }

  const currentCode = Vue.prototype.$i18nCode
  const strings = translations[code] || await loadTranslationStrings(code)

  translations[code] = strings
  Vue.prototype.$i18nCode = code

  if (!currentCode) {
    // first load
    Vue.prototype.$strings = strings
    return
  }

  for (const key in Vue.prototype.$strings) {
    Vue.prototype.$strings[key] = strings[key] || translations[defaultCode][key]
  }
  console.log('i18n strings=', Vue.prototype.$strings)
}

Vue.prototype.$i18nUpdate = loadi18n

loadi18n(defaultCode)