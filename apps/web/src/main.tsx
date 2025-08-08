import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { persister, store } from './app/store/store';
import AppRouter from './app/routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
        <ToastContainer  position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
          draggable
        />
          <AppRouter />
          </PersistGate>
        </Provider>
    </BrowserRouter>
  </StrictMode>
);