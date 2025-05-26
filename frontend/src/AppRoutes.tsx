import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
// import AuthCallbackPage from "./pages/AuthCallbackPage";
// import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import Research from "./pages/ResearchPage";
import SearchResearchPage from "./pages/SearchResearchPage";
import ResearchDetail from "./pages/ResearchDetail";
import Analytics from "./pages/Analytics";
import HealthRecord from "./pages/HealthRecord";
import RecordDetail from "./pages/RecordDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/research"
          element={
            <Layout>
              <Research />
            </Layout>
          }
        />
        <Route
          path="/research/search"
          element={
            <Layout>
              <SearchResearchPage />
            </Layout>
          }
        />
        <Route
          path="/research/:type"
          element={
            <Layout>
              <Research />
            </Layout>
          }
        />
        <Route
          path="/research/:type/:slug"
          element={
            <Layout>
              <ResearchDetail />
            </Layout>
          }
        />

        <Route
          path="/record"
          element={
            <Layout>
              <HealthRecord />
            </Layout>
          }
        />
        <Route
          path="/record/:sample_id"
          element={
            <Layout>
              <RecordDetail />
            </Layout>
          }
        />

        <Route
          path="/analytics"
          element={
            <Layout>
              <Analytics />
            </Layout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
