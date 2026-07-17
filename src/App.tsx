import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased text-foreground">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
