import React from "react";
import AuthContextProvider from "./contexts/AuthContext";
import RootContainer from "./containers/RootContainer";

// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthContextProvider>
      <RootContainer />
      {/* <ToastContainer /> */}
    </AuthContextProvider>
  );
}

export default App;
