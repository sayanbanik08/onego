"use client";

import Card from "./Card";

function App() {
  return (
    <div
      className="fixed bottom-2 left-1/2 z-[10000] hidden w-[calc(100%-2rem)] max-w-[403px] -translate-x-1/2 min-[250px]:block lg:hidden"
    >
      <Card />
    </div>
  );
}

export default App;