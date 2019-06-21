import React from 'react'
import { useSubscription } from 'urql'
import { Row, Col, Card } from 'antd'

import ReactSpeedometer from './speedometer'

const COUNTER_SUBSCRIPTION_QUERY = `
subscription counter {
  counter {
    value
  }
}
`

const USED_RAM_MEMORY_SUBSCRIPTION_QUERY = `
subscription usedRAMMemory {
  usedRAMMemory {
    value
  }
}
`

const CPU_BUSY_SUBSCRIPTION_QUERY = `
subscription cpuBusy {
  cpuBusy {
    value
  }
}
`

function GraphContainer() {
  const [counterResult] = useSubscription({
    query: COUNTER_SUBSCRIPTION_QUERY
  })

  const [usedRAMMemoryResult] = useSubscription({
    query: USED_RAM_MEMORY_SUBSCRIPTION_QUERY
  })

  const [cpuBusyResult] = useSubscription({
    query: CPU_BUSY_SUBSCRIPTION_QUERY
  })

  // if (counterResult.error) {
  //   return 'There was an error :('
  // }

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card
          bodyStyle={{ backgroundColor: 'rgb(34, 34, 34)' }}
          title="Counter"
          loading={!counterResult || !counterResult.data}
        >
          {counterResult && counterResult.data && (
            <div style={{ textAlign: 'center' }}>
              <ReactSpeedometer
                segmentColor={['#508104', '#ff9502', '#d43501']}
                minValue={0}
                maxValue={1000}
                value={counterResult.data.counter.value}
                textColor="white"
                height={180}
              />
            </div>
          )}
        </Card>
      </Col>

      <Col span={8}>
        <Card
          bodyStyle={{ backgroundColor: 'rgb(34, 34, 34)' }}
          title="Used RAM Memory"
          loading={!usedRAMMemoryResult || !usedRAMMemoryResult.data}
        >
          {usedRAMMemoryResult && usedRAMMemoryResult.data && (
            <div style={{ textAlign: 'center' }}>
              <ReactSpeedometer
                segmentColor={['#508104', '#ff9502', '#d43501']}
                minValue={0}
                maxValue={100}
                value={usedRAMMemoryResult.data.usedRAMMemory.value}
                textColor="white"
                height={180}
              />
            </div>
          )}
        </Card>
      </Col>

      <Col span={8}>
        <Card
          bodyStyle={{ backgroundColor: 'rgb(34, 34, 34)' }}
          title="CPU Busy"
          loading={!cpuBusyResult || !cpuBusyResult.data}
        >
          {cpuBusyResult && cpuBusyResult.data && (
            <div style={{ textAlign: 'center' }}>
              <ReactSpeedometer
                segmentColor={['#508104', '#ff9502', '#d43501']}
                minValue={0}
                maxValue={100}
                value={cpuBusyResult.data.cpuBusy.value}
                textColor="white"
                height={180}
              />
            </div>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default GraphContainer
