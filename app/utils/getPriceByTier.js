export const getPriceByTier = (tier) => {
    switch (tier) {
      case 1:
        return 5;
      case 2:
        return 10;
      case 3:
        return 25;
      case 4:
        return 50;
      case 5:
        return 100;
      default:
        return "Invalid tier"; // Handle invalid tiers
    }
  };
  