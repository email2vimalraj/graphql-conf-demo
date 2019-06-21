import React from 'react'
import ReactDOM from 'react-dom'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import {
  Provider,
  createClient,
  defaultExchanges,
  subscriptionExchange
} from 'urql'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const subscriptionClient = new SubscriptionClient('ws://localhost:4000', {})

const client = createClient({
  url: 'http://localhost:4000',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
})

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
