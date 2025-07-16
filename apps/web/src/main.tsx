import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
// import App from './app/app';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import AppRouter from './app/routes/AppRouter';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* <App /> */}
        <AppRouter/>
        </Provider>
    </BrowserRouter>
  </StrictMode>
);