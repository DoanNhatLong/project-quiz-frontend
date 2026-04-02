
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'nes.css/css/nes.min.css'
import 'rpg-awesome/css/rpg-awesome.min.css'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store.js";
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Provider store={store}>
          <App />
      </Provider>
  </BrowserRouter>,
)
