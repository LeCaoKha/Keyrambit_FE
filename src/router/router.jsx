import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Quiz from "../pages/Quiz/Quiz";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Wrapper cho Admin
    children: [
      //   { path: "", element: <Question /> },
      //   { path: "home", element: <Home /> },
      //   { path: "our-story", element: <OurStory /> },
      //   { path: "memories", element: <Memories /> },
      //   { path: "reminders", element: <Remind /> },
      { path: "", element: <Quiz /> },
      //   { path: "message", element: <Message /> },
    ],
  },
]);

export default router;
