
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { persistor, store } from './app/store';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <HashRouter>
          <App />
        </HashRouter>
      </PersistGate>
    </Provider>
  
);
