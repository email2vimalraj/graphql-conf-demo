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

async function publishToChannel(pubsub, channel, resource, queryParams) {
  try {
    const result = {}
    result[resource] = await fetchFromPrometheus(queryParams)
    pubsub.publish(channel, result)
  } catch (err) {
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
    },

    getTestCounter: async (root, args, context) => {
      const queryParams = {
        query: `(test_counter{code="200"})`,
        start: 'now-15m'
      }
      try {
        return await fetchFromPrometheus(queryParams)
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Subscription: {
    cpuBusy: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15)
        const queryParams = {
          query: `(((count(count(node_cpu_seconds_total{instance=~"node-exporter:9100",job=~"node-exporter"}) by (cpu))) - avg(sum by (mode)(irate(node_cpu_seconds_total{mode='idle',instance=~"node-exporter:9100",job=~"node-exporter"}[5m])))) * 100) / count(count(node_cpu_seconds_total{instance=~"node-exporter:9100",job=~"node-exporter"}) by (cpu))`,
          start: 'now-5m'
        }
        try {
          setInterval(() => {
            publishToChannel(pubsub, channel, 'cpuBusy', queryParams)
          }, 3000)
          return pubsub.asyncIterator(channel)
        } catch (err) {
          throw new Error(err)
        }
      }
    },
    usedRAMMemory: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15)
        const queryParams = {
          query: `((node_memory_MemTotal_bytes{instance=~"node-exporter:9100",job=~"node-exporter"} - node_memory_MemFree_bytes{instance=~"node-exporter:9100",job=~"node-exporter"}) / (node_memory_MemTotal_bytes{instance=~"node-exporter:9100",job=~"node-exporter"} )) * 100`,
          start: 'now-5m'
        }
        try {
          setInterval(() => {
            publishToChannel(pubsub, channel, 'usedRAMMemory', queryParams)
          }, 3000)
          return pubsub.asyncIterator(channel)
        } catch (err) {
          throw new Error(err)
        }
      }
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15)
        const queryParams = {
          query: `(test_counter{code="200"})`,
          start: 'now-15m'
        }
        try {
          setInterval(() => {
            publishToChannel(pubsub, channel, 'counter', queryParams)
          }, 3000)
          return pubsub.asyncIterator(channel)
        } catch (err) {
          throw new Error(err)
        }
      }
    }
  }
}

module.exports = resolvers
