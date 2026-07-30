import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;