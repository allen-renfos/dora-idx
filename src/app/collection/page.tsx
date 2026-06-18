import ProtectedRoute from "@/component/ui/ProtectedRoute";
import FavouritesPage from "@/main-pages/dashboard/FavouritesPage";

export default function Collection() {
  return (
    <ProtectedRoute>
      <FavouritesPage />
    </ProtectedRoute>
  );
}
