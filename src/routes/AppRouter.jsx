import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<></>}
        />
        <Route
          path={"/register"}
          exact
          element={<></>}
        />
        <Route
          path={"/enroll"}
          exact
          element={<></>}
        />
        <Route
          path={"/switch_device"}
          exact
          element={<></>}
        />
        <Route
          path={"/driverlicense"}
          exact
          element={<></>}
        />
        <Route
          path={"/dashboard"}
          exact
          element={<></>}
        />
        <Route path={"/error"} exact element={<p>Something went wrong</p>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
