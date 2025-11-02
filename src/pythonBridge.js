import { useState, useEffect } from 'react'

export function usePythonState(propName) {
  const [propValue, setPropValue] = useState()

  useEffect(() => {
    window.addEventListener('pywebviewready', function() {
      if (!window.pywebview.state) {
        window.pywebview.state = {}
      }
      window.pywebview.state[`set_${propName}`] = setPropValue
    })
  }, [propName])

  return propValue
}

export function callPython(apiName, apiContent) {
  window.pywebview.api = window.pywebview.api || {}
  return window.pywebview.api[apiName](apiContent)
}
