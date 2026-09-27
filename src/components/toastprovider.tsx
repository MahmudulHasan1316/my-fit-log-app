"use client";

import { ToastContainer } from "react-toastify";

const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      theme="dark"
      newestOnTop
      closeOnClick
      pauseOnHover
    />
  );
};

export default ToastProvider;