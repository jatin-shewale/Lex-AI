import { useState, useCallback } from 'react'

// Simple module-level store (no Redux needed for this size)
let _state = {
  uploadedFile: null,
  analysisResult: null,
  contractId: null,
  filePath: null,
}
const _listeners = new Set()

function setState(patch) {
  _state = { ..._state, ...patch }
  _listeners.forEach((fn) => fn(_state))
}

export function useContractStore() {
  const [state, set] = useState(_state)

  // Subscribe on mount
  useState(() => {
    _listeners.add(set)
    return () => _listeners.delete(set)
  })

  const setUploadedFile = useCallback((file) => setState({ uploadedFile: file }), [])
  const setAnalysisResult = useCallback((r) => setState({ analysisResult: r }), [])
  const setContractId = useCallback((id) => setState({ contractId: id }), [])
  const setFilePath = useCallback((p) => setState({ filePath: p }), [])
  const reset = useCallback(() =>
    setState({ uploadedFile: null, analysisResult: null, contractId: null, filePath: null }), [])

  return { ...state, setUploadedFile, setAnalysisResult, setContractId, setFilePath, reset }
}
