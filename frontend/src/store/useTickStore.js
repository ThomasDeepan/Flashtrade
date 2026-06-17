import { create } from "zustand";

const useTickStore = create((set) => ({
  // stores latest price
  ticks: {},

  updateTick: (symbol, price) =>
    set((state) => {
      const prev = state.ticks[symbol]?.price;

      // up or down?
      const dir =
        prev == null
          ? "flat"
          : price > prev
            ? "up"
            : price < prev
              ? "down"
              : "flat";

      return {
        ticks: {
          ...state.ticks,
          [symbol]: { price, dir },
        },
      };
    }),
}));

export default useTickStore;
