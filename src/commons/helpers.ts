export const numericFormat = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  }).format(value);
};

export const rupiahFormat = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  }).format(value);
};

export const spellRupiahCurrency = (value: number): string => {
  const spellNumbers = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  let spell = "";

  if (value < 12) {
    spell = " " + spellNumbers[value];
  } else if (value < 20) {
    spell = spellRupiahCurrency(value - 10) + " Belas";
  } else if (value < 100) {
    spell = spellRupiahCurrency(Math.floor(value / 10)) + " Puluh" + spellRupiahCurrency(value % 10);
  } else if (value < 200) {
    spell = " Seratus" + spellRupiahCurrency(value - 100);
  } else if (value < 1000) {
    spell = spellRupiahCurrency(Math.floor(value / 100)) + " Ratus" + spellRupiahCurrency(value % 100);
  } else if (value < 2000) {
    spell = " Seribu" + spellRupiahCurrency(value - 1000);
  } else if (value < 1000000) {
    spell = spellRupiahCurrency(Math.floor(value / 1000)) + " Ribu" + spellRupiahCurrency(value % 1000);
  } else if (value < 1000000000) {
    spell = spellRupiahCurrency(Math.floor(value / 1000000)) + " Juta" + spellRupiahCurrency(value % 1000000);
  } else if (value < 1000000000000) {
    spell = spellRupiahCurrency(Math.floor(value / 1000000000)) + " Milyar" + spellRupiahCurrency(value % 1000000000);
  } else if (value < 1000000000000000) {
    spell = spellRupiahCurrency(Math.floor(value / 1000000000000)) + " Trilyun" + spellRupiahCurrency(value % 1000000000000);
  }

  return spell;
};

export const chunkArray = (array: any[], size: number): any[][] => {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }

  return result;
};
