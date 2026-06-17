import Watchlist from "./components/Watchlist";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        padding: "32px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ color: "#fff", marginBottom: "24px" }}>⚡ FlashTrade</h1>
      <div style={{ maxWidth: "500px" }}>
        <Watchlist />
      </div>
    </div>
  );
}
