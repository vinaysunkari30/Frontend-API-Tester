import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.jsx";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute/index.jsx";
import PublicRoute from "./components/PublicRoute/index.jsx";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        exact
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        exact
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        exact
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
    <ToastContainer
      position="top-center"
      toastClassName={() =>
        "w-75 bg-white text-cyan-700 flex p-4 text-md font-semibold rounded-md"
      }
    />
  </BrowserRouter>
);

export default App;
