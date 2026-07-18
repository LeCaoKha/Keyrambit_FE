import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
