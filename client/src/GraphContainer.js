import React from 'react'
import { useQuery } from 'urql'

import ReactSpeedometer from './speedometer'

const RAM_QUERY = `
query getUsedRAMMemoryQuery {
  getUsedRAMMemory {
    value
  }

  getCPUBusy {
    value
  }
}
`

function GraphContainer() {
  const [result, executeQuery] = useQuery({
    query: RAM_QUERY
  })

  React.useEffect(() => {
    setInterval(() => executeQuery({ requestPolicy: 'network-only' }), 3000)
  }, [executeQuery])

  if (result.error) {
    return 'There was an error :('
  }

  if (result && result.data) {
    console.log(result.data.getUsedRAMMemory.value)
  }

  return (
    <>
      {result && result.data && (
        <>
          <ReactSpeedometer
            segmentColor={['#508104', '#ff9502', '#d43501']}
            minValue={0}
            maxValue={100}
            value={result.data.getUsedRAMMemory.value}
            textColor="white"
          />

          <ReactSpeedometer
            segmentColor={['#508104', '#ff9502', '#d43501']}
            minValue={0}
            maxValue={100}
            value={result.data.getCPUBusy.value}
            textColor="white"
          />
        </>
      )}
    </>
  )
}

export default GraphContainer
