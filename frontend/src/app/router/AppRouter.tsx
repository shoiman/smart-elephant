import { Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "../../pages/HomePage";
import { AnimalsPage } from "../../pages/AnimalsPage";
import { GamesPage } from "../../pages/GamesPage";
import { ProgressPage } from "../../pages/ProgressPage";
import { StarsPage } from "../../pages/StarsPage";
import { MainLayout } from "../layouts/MainLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="animals" element={<AnimalsPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="stars" element={<StarsPage />} />
        {/* The old progress page, for parents; the parent gate and the new page come next */}
        <Route path="parent/progress" element={<ProgressPage />} />
        <Route path="progress" element={<Navigate replace to="/stars" />} />
      </Route>
    </Routes>
  );
}
