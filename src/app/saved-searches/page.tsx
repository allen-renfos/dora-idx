import ProtectedRoute from "@/component/ui/ProtectedRoute";
import SavedSearchesPage from "@/main-pages/dashboard/SavedSearchesPage";

export default function SavedSearches() {
  return (
    <ProtectedRoute>
      <SavedSearchesPage />
    </ProtectedRoute>
  );
}
