import ProtectedRoute from "@/component/ui/ProtectedRoute";
import MarketReportPage from "@/main-pages/dashboard/MarketReportPage";

export default function MarketReport() {
  return (
    <ProtectedRoute>
      <MarketReportPage />
    </ProtectedRoute>
  );
}
