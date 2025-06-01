export const formatNepaliPrice = (price) => {
  if (!price) return 'NPR 0';
  
  const crore = 10000000; // 1 crore = 10 million
  const lakh = 100000;    // 1 lakh = 100 thousand
  
  if (price >= crore) {
    const crores = Math.floor(price / crore);
    const remaining = price % crore;
    const lakhs = Math.floor(remaining / lakh);
    
    if (lakhs > 0) {
      return `NPR ${crores} crore${crores > 1 ? 's' : ''} ${lakhs} lakh${lakhs > 1 ? 's' : ''}`;
    }
    return `NPR ${crores} crore${crores > 1 ? 's' : ''}`;
  }
  
  if (price >= lakh) {
    const lakhs = Math.floor(price / lakh);
    const remaining = price % lakh;
    
    if (remaining > 0) {
      return `NPR ${lakhs} lakh${lakhs > 1 ? 's' : ''} ${remaining.toLocaleString('en-IN')}`;
    }
    return `NPR ${lakhs} lakh${lakhs > 1 ? 's' : ''}`;
  }
  
  return `NPR ${price.toLocaleString('en-IN')}`;
}; 