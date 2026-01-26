import { UserButton } from "@clerk/clerk-react";
import React from "react";
import "./home.css";

function Home() {
  return (
    <div>
      <h1>Welcome to InterviewCraft</h1>

      <UserButton mode="model" />
    </div>
  );
}

export default Home;
