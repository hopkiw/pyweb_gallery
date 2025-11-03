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
  if (!('pywebview' in window)) {
    console.log('pywebview not ready');
    return;
  }
  if (!('api' in window.pywebview)) {
    console.log('api not ready');
    return;
  }
  return window.pywebview.api[apiName](apiContent)
}
