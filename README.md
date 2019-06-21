# Demo for the Graphql Conf

## /server

Run the following:

```bash
npm i -g prisma
docker-compose up -d
npm install
prisma generate
node index.js
```

## /node-prom-server

```bash
node cluster.js
```

Collects some metrics about node and other gauges

## /prometheus-docker

```bash
docker-compose up -d
```

Creates prometheus, node-exporter and grafana instances

Check the local ip of the `node-prom-server` and update the `prometheus.yml` file with the recent ip. The `localhost` or `127.0.0.1` doesn't work.
