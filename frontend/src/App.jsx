import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SmoothScroll from "./components/SmoothScroll";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SmoothScroll>
        <AppRoutes />
      </SmoothScroll>
      </AuthProvider>
      
    </BrowserRouter>
  );
}

export default App;