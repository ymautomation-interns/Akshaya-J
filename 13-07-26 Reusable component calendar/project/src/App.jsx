// src/App.jsx
import React from "react";
import Picker from "./components/Picker/Picker";
import "./App.css";
/**
 * Demo App — ONE <Picker /> instance.
 *
 * <Picker /> is the single reusable component the library exposes.
 * You decide which picker renders by passing props directly — set
 * exactly ONE of the four booleans below to true, the rest to false,
 * then save. Only the prop that is true is rendered.
 *
 *   <Picker singleDate={true}  dateRange={false} time={false} dateTime={false} />
 *   <Picker singleDate={false} dateRange={true}  time={false} dateTime={false} />
 *   <Picker singleDate={false} dateRange={false} time={true}  dateTime={false} />
 *   <Picker singleDate={false} dateRange={false} time={false} dateTime={true}  />
 */
function App() {
  return (
    <div className="app">
      <div className="app__frame">
        <span className="app__corner app__corner--tl" aria-hidden="true" />
        <span className="app__corner app__corner--tr" aria-hidden="true" />
        <span className="app__corner app__corner--bl" aria-hidden="true" />
        <span className="app__corner app__corner--br" aria-hidden="true" />
        <p className="app__eyebrow">Reusable component</p>
        <h1 className="app__title">
          Reusable React Picker Component
        </h1>
        <p className="app__subtitle">
          Render Single Date, Date Range, Time, or Date & Time by enabling exactly one mode prop.
        </p>
        <div className="app__stage">
          <Picker
            singleDate={false}
            dateRange={true}
            time={false}
            dateTime={false}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
