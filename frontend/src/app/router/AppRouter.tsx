import { Route, Routes } from "react-router-dom";

import { HomePage } from "../../pages/HomePage";
import { AnimalsPage } from "../../pages/AnimalsPage";
import { GamesPage } from "../../pages/GamesPage";
import { ProgressPage } from "../../pages/ProgressPage";
import { MainLayout } from "../layouts/MainLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
       <Route index element={<HomePage />} />
        <Route path="animals" element={<AnimalsPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  );
}