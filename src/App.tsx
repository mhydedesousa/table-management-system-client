import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import { useContext, useEffect } from "react";
import { AuthContext, AuthContextProvider } from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Logout from "./Logout";
import AppHeader from "./AppHeader";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <AppHeader />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
