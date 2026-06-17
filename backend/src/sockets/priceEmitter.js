// These are the 5 stocks our fake market will have
const SYMBOLS = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL"];

// Starting prices for each stock
// We keep these OUTSIDE the function so prices don't reset on each tick
const prices = {
  AAPL: 175.0,
  TSLA: 245.0,
  NVDA: 820.0,
  MSFT: 415.0,
  GOOGL: 175.0,
};

export function startPriceEmitter(io) {
  console.log("📈 Price emitter started");

  setInterval(() => {
    SYMBOLS.forEach((symbol) => {
      // Random walk — price goes up or down by max 0.5% each tick
      // Math.random() gives 0 to 1
      // subtracting 0.5 makes it -0.5 to +0.5
      // multiplying by 0.01 makes it -0.005 to +0.005 (half a percent)
      const changePercent = (Math.random() - 0.5) * 0.01;
      prices[symbol] = +(prices[symbol] * (1 + changePercent)).toFixed(2);

      // Emit only to clients who subscribed to this symbol
      // Think of it like a WhatsApp group — only group members get the message
      io.to(`tick:${symbol}`).emit("tick", {
        symbol,
        price: prices[symbol],
        ts: Date.now(),
      });
    });
  }, 500); // runs every 500 milliseconds
}
