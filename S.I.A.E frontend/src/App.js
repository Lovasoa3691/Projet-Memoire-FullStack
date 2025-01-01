// import logo from './logo.svg';
// import './App.css';
import './assets/css/bootstrap.min.css';
// import './assets/css/plugins.min.css';
import './assets/css/kaiadmin.min.css';
// import './assets/css/all.min.css';
import './assets/css/uf-style.css';
// // Style CSS
// import './assets/js/plugin/webfont/webfont.min';
import './assets/css/fonts.min.css';
import 'nprogress/nprogress.css'
import './assets/css/nprogress-custom.css';
// import $ from 'jquery';
import axios from 'axios';

import Login from './components/auth/login';
import Register from './components/auth/register';
import HomeAdmin from './components/admin/home';
import HomeEtudiant from './components/etudiant/homeEtu';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import React, { createContext, useContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

// import { LoadingProvider } from './components/spinner/loadingSpinner';

export const UserContext = createContext();

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });

  useEffect(() => {
    const scripts = [
      { src: process.env.PUBLIC_URL + "/js/core/jquery-3.7.1.min.js" },
      { src: process.env.PUBLIC_URL + "/js/core/popper.min.js" },
      { src: process.env.PUBLIC_URL + "/js/core/bootstrap.min.js" },
      { src: process.env.PUBLIC_URL + "/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js" },
      { src: process.env.PUBLIC_URL + "/js/kaiadmin.min.js" },
    ];

    const scriptElements = scripts.map(({ src }) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return script;
    });

    return () => {
      scriptElements.forEach(script => document.body.removeChild(script));
    };
  }, []);

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const userFromStorage = localStorage.getItem('user');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });

  const [isConnecte, setIsConnecte] = useState(false);
  const [UType, setUType] = useState(null);

  useEffect(() => {
    const usersdata = localStorage.getItem('user');
    if (usersdata) {
      const parsedUser = JSON.parse(usersdata);
      setIsConnecte(true);
      setUType(parsedUser.role);
    } else {
      setIsConnecte(false);
    }
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {

      axios.get('http://localhost:5000/api/utilisateur', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((rep) => {
          // console.log(rep.data.utilisateur);
          const utilisateur = {
            idUt: rep.data.utilisateur['id_ut'],
            nomUt: rep.data.utilisateur['nom_ut'],
            mail: rep.data.utilisateur['email'],
            role: rep.data.utilisateur['role'],
          };

          setUser(utilisateur);
          localStorage.setItem('user', JSON.stringify(utilisateur));

        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
    }
  }, []);

  const RouteProteger = ({ children, role }) => {
    const { user } = useContext(UserContext);

    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (user.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App">

        <Router>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/app/*' element={
              <RouteProteger role="Admin">
                <HomeAdmin />
              </RouteProteger>
            } />
            <Route path='/etudiant/*' element={
              <RouteProteger role="Etudiant">
                <HomeEtudiant />
              </RouteProteger>
            } />
          </Routes>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
