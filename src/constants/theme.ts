export const calendarTheme = {
  selectedDayBackgroundColor: "#000",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#007AFF",
  dayTextColor: "#1E3A8A",
  textDisabledColor: "#94A3B8",
  textDayFontWeight: "500",
  textDayFontSize: 16,
  dotColor: "#007AFF",
  selectedDotColor: "#ffffff",
  arrowColor: "#007AFF",
  disabledArrowColor: "#CBD5E1",
  monthTextColor: "#1E3A8A",
  textMonthFontWeight: "600",
  textMonthFontSize: 18,
  textDayHeaderFontWeight: "600",
  textDayHeaderFontSize: 14,
  textDayHeaderColor: "#2563EB",
  indicatorColor: "#007AFF",
};
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
    case "finished":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
