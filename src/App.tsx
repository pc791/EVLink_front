import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './comp/Layout';
import AppRoutes from './router/AppRoutes';
import { AuthProvider } from './comp/AuthProvider';


function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <Layout> */}
          <AppRoutes />
        {/* </Layout> */}
      </Router>
    </AuthProvider>
  );
}

export default App;
