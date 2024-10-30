import React from 'react';
import './App.css';
import MainPage from "./components/MainPage";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from "./pages/Login";
import PaymentCard from "./pages/PaymentCard";
import {AuthProvider} from "./components/auth/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (

      <AuthProvider>
        <React.Fragment>

          {/* ToastContainer for global toast notifications */}
          <ToastContainer />

          <BrowserRouter>
            <Routes>
              <Route path="/paul" element={<PaymentCard />} />
              <Route path="/" element={<Login />} />
              <Route path="*" element={
                <RequireAuth>
                  <MainPage />
                </RequireAuth>
              } />
            </Routes>
          </BrowserRouter>
        </React.Fragment>
      </AuthProvider>
  );
}

export default App;
