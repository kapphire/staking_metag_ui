import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Metamask from './pages/Metamask';
import Layout from './components/Layout/Layout';
import { useState } from 'react';
import { AccountContext } from "./Contexts/AccountContext";

function App() {
  const [account, setAccount] = useState();

  return (
    <AccountContext.Provider value={{account, setAccount}}>
      <Router>
        <Layout>
          <Route exact path="/" component= {Home} />
          <Route exact path="/install-metamask" component={Metamask} />
        </Layout>
      </Router>
    </AccountContext.Provider>
  );
}

export default App;
