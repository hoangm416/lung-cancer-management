import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
// import AuthCallbackPage from "./pages/AuthCallbackPage";
// import UserProfilePage from "./pages/UserProfilePage";
// import ProtectedRoute from "./auth/ProtectedRoute";
import Research from "./pages/ResearchPage";
import SearchResearchPage from "./pages/SearchResearchPage";
import ResearchDetail from "./pages/ResearchDetail";
import Analytics from "./pages/Analytics";
import HealthRecord from "./pages/HealthRecord";
import RecordDetail from "./pages/RecordDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout showHero={false}>
            <HomePage />
          </Layout>
        }
      />
      {/* <Route path="/auth-callback" element={<AuthCallbackPage />} /> */}
      <Route
        path="/signup"
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
      
      {/* <Route element={<ProtectedRoute />}>
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
      </Route> */}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
