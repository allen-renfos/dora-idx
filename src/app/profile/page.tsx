import ProtectedRoute from "@/component/ui/ProtectedRoute";
import ProfilePage from "@/main-pages/dashboard/Profile";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
