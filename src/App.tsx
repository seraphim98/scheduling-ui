import { BrowserRouter } from "react-router-dom";
import Scheduler from "./components/Scheduler";
import "./styling/top-nav.css";

export default function () {
  return (
      <BrowserRouter>
          <Scheduler/>
      </BrowserRouter>
  );
}

