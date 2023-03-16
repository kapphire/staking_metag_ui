import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Metamask from './pages/Metamask';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Route exact path="/" component= {Home} />
        <Route exact path="/install-metamask" component={Metamask} />
      </Layout>
    </Router>
  );
}

export default App;
