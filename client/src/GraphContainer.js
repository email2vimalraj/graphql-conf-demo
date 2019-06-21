import React from 'react'
import { useQuery, useSubscription } from 'urql'

import ReactSpeedometer from './speedometer'

const RAM_QUERY = `
subscription query {
  counter {
    value
  }
}
`

function GraphContainer() {
  // const [result, executeQuery] = useQuery({
  //   query: RAM_QUERY
  // })

  const [result] = useSubscription({
    query: RAM_QUERY
  })

  // React.useEffect(() => {
  //   setInterval(() => executeQuery({ requestPolicy: 'network-only' }), 3000)
  // }, [executeQuery])

  if (result.error) {
    return 'There was an error :('
  }

  return (
    <>
      {result && result.data && (
        <>
          {/* <ReactSpeedometer
            segmentColor={['#508104', '#ff9502', '#d43501']}
            minValue={0}
            maxValue={100}
            value={result.data.getCPUBusy.value}
            textColor="black"
          /> */}
          <ReactSpeedometer
            segmentColor={['#508104', '#ff9502', '#d43501']}
            minValue={0}
            maxValue={1000}
            value={result.data.counter.value}
            textColor="black"
          />
        </>
      )}
    </>
  )
}

export default GraphContainer
