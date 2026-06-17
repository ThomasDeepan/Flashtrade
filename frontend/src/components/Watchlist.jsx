import { useEffect } from "react";
import socket from "../socket";
import useTickStore from "../store/useTickStore";

const SYMBOLS = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL"];

function TickRow({ symbol }) {
  const tick = useTickStore((state) => state.ticks[symbol]);

  const color =
    tick?.dir === "up"
      ? "#00c853"
      : tick?.dir === "down"
        ? "#ff1744"
        : "#ffffff";

  return (
    <tr style={{ borderBottom: "1px solid #222" }}>
      <td style={{ padding: "12px 16px", fontWeight: "bold" }}>{symbol}</td>
      <td
        style={{
          padding: "12px 16px",
          fontFamily: "monospace",
          fontSize: "1.1rem",
          color: color,
          transition: "color 0.3s",
        }}
      >
        ${tick?.price?.toFixed(2) ?? "---"}
      </td>
      <td style={{ padding: "12px 16px" }}>
        {tick?.dir === "up" ? "▲" : tick?.dir === "down" ? "▼" : "—"}
      </td>
    </tr>
  );
}

export default function Watchlist() {
  const updateTick = useTickStore((state) => state.updateTick);

  useEffect(() => {
    socket.emit("subscribe", SYMBOLS);

    socket.on("tick", ({ symbol, price }) => {
      updateTick(symbol, price);
    });

    return () => {
      socket.off("tick");
      socket.emit("unsubscribe", SYMBOLS);
    };
  }, [updateTick]);

  return (
    <div
      style={{
        background: "#111",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #333",
      }}
    >
      <h2
        style={{
          padding: "16px",
          margin: 0,
          background: "#1a1a1a",
          color: "#fff",
          borderBottom: "1px solid #333",
        }}
      >
        📈 Live Market
      </h2>
      <table
        style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
      >
        <thead>
          <tr style={{ background: "#1a1a1a", color: "#888" }}>
            <th style={{ padding: "8px 16px", textAlign: "left" }}>Symbol</th>
            <th style={{ padding: "8px 16px", textAlign: "left" }}>Price</th>
            <th style={{ padding: "8px 16px", textAlign: "left" }}>Change</th>
          </tr>
        </thead>
        <tbody>
          {SYMBOLS.map((symbol) => (
            <TickRow key={symbol} symbol={symbol} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
