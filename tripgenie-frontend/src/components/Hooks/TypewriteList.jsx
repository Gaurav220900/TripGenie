import { useState, useEffect } from "react";

export default function useTypewriterList(items = [], delay = 400) {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    if (!items.length) {
      setVisibleItems([]);
      return;
    }

    setVisibleItems([]); // Reset
    let i = 0;

    const interval = setInterval(() => {
      setVisibleItems((prev) => [...prev, items[i]]);
      i++;
      if (i >= items.length) clearInterval(interval);
    }, delay);

    return () => clearInterval(interval);
  }, [items, delay]);

  return visibleItems;
}
