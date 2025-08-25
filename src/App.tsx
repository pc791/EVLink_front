import { NavLink, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import EVhome from "./components/home/EVhome";
import Layout from "./layout/Layout";
import { AuthProvider } from "./auth/AuthProvider"; 
import AppRouter from "./router/AppRoutes";


function App() {
  return (

    <div className="App">
      <AuthProvider>
        <Router>
          <Layout>
            <AppRouter />
          </Layout>
        </Router>
      </AuthProvider>
    </div>
  );
}
  
export default App;
