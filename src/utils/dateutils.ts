export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatDateRange = (checkIn, checkOut) => {
  if (!checkIn) return "Dates not available";

  try {
    const startDate = new Date(checkIn);
    const endDate = checkOut ? new Date(checkOut) : null;

    const startFormatted = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (endDate) {
      const endFormatted = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${startFormatted} - ${endFormatted}`;
    }

    return startFormatted;
  } catch (error) {
    return "Invalid date";
  }
};

export const formatPrice = (amount, currency = "INR") => {
  if (!amount) return "Price not available";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    return `${amount}`;
  }
};

export const formatLocation = (location) => {
  if (!location) return null;

  // If location is a string, return it as is
  if (typeof location === "string") {
    return location;
  }

  // If location is an object, format it properly
  if (typeof location === "object") {
    const parts = [];

    if (location.address) parts.push(location.address);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);

    return parts.length > 0 ? parts.join(", ") : "Location not available";
  }

  return "Location not available";
};
