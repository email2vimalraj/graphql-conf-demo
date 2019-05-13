const axios = require('axios')

const PROMETHEUS_END_POINT = 'http://localhost:9090/api/v1/query'

async function fetchFromPrometheus(queryParams) {
  try {
    const response = await axios.request({
      url: PROMETHEUS_END_POINT,
      params: queryParams
    })
    const [timestamp, value] = response.data.data.result[0].value
    return {
      timestamp,
      value
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

const resolvers = {
  Query: {
    getCPUBusy: async (root, args, context) => {
      const queryParams = {
        query: `(((count(count(node_cpu_seconds_total{instance=~"node-exporter:9100",job=~"node-exporter"}) by (cpu))) - avg(sum by (mode)(irate(node_cpu_seconds_total{mode='idle',instance=~"node-exporter:9100",job=~"node-exporter"}[5m])))) * 100) / count(count(node_cpu_seconds_total{instance=~"node-exporter:9100",job=~"node-exporter"}) by (cpu))`,
        start: 'now-15m'
      }
      try {
        return await fetchFromPrometheus(queryParams)
      } catch (err) {
        throw new Error(err)
      }
    },

    getUsedRAMMemory: async (root, args, context) => {
      const queryParams = {
        query: `((node_memory_MemTotal_bytes{instance=~"node-exporter:9100",job=~"node-exporter"} - node_memory_MemFree_bytes{instance=~"node-exporter:9100",job=~"node-exporter"}) / (node_memory_MemTotal_bytes{instance=~"node-exporter:9100",job=~"node-exporter"} )) * 100`,
        start: 'now-15m'
      }
      try {
        return await fetchFromPrometheus(queryParams)
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}

module.exports = resolvers
