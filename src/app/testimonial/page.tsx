import ProtectedRoute from "@/component/ui/ProtectedRoute";
import TestimonialPage from "@/main-pages/dashboard/TestimonialPage";

export default function Testimonial() {
  return (
    <ProtectedRoute>
      <TestimonialPage />
    </ProtectedRoute>
  );
}
