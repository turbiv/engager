const zeroPad = (input, length) =>
  (Array(length + 1).join("0") + input).slice(-length);

const overflowCents = price => {
  let dollars = price.dollars;
  let cents = price.cents;

  if (cents >= 100) {
    dollars += Math.floor(cents / 100);
    cents %= 100;
  }

  return { dollars, cents };
};

const Price = {
  create: (dollars, cents) => ({ dollars, cents }),

  isNull: price => {
    return price.dollars === 0 && price.cents === 0;
  },

  multiply: (price, x) => {
    const dollars = price.dollars * x;
    const cents = price.cents * x;
    return overflowCents({ dollars, cents });
  },

  add: (p1, p2) => {
    const dollars = p1.dollars + p2.dollars;
    const cents = p1.cents + p2.cents;
    return overflowCents({ dollars, cents });
  },

  minus: (p1, p2) => {
    const res = Price.add(p1, { dollars: -p2.dollars, cents: -p2.cents });

    if (res.cents < 0) {
      return { dollars: res.dollars - 1, cents: 100 + res.cents };
    }
    return res;
  },

  makePercent: (percent, price) => {
    const cents = price.dollars * 100 + price.cents;
    const centsProcented = Math.floor((cents * percent) / 100);
    return overflowCents({ dollars: 0, cents: centsProcented });
  },

  toDiplayCents: price => zeroPad(price.cents, 2),

  toDiplay: price => `${price.dollars},${Price.toDiplayCents(price)}`
};

export { Price };
