import React from 'react'

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './store'
import './index.css'
import './styles/global.css'
import { validateEnv } from './utils/env'

// Validate environment variables
validateEnv()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
) 