// Utility function to calculate start and end dates based on date filter
export const getDateRange = (dateFilter) => {
  const now = new Date();
  
  // Helper to get start of day in UTC
  const getUTCStartOfDay = (date) => {
    const utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return utcDate.getTime();
  };
  
  // Helper to get end of day in UTC
  const getUTCEndOfDay = (date) => {
    const utcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    return utcDate.getTime();
  };
  
  let startDate, endDate;
  
  switch (dateFilter.value) {
    case "This week": {
      // Start of current week (Monday)
      const startOfWeek = new Date(now);
      const dayOfWeek = startOfWeek.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday (0), go back 6 days
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      
      startDate = getUTCStartOfDay(startOfWeek);
      endDate = getUTCEndOfDay(now);
      break;
    }
    
    case "Last week": {
      // Start of last week (Monday)
      const startOfLastWeek = new Date(now);
      const dayOfWeek = startOfLastWeek.getDay();
      const diffToLastMonday = dayOfWeek === 0 ? -13 : -6 - dayOfWeek;
      startOfLastWeek.setDate(startOfLastWeek.getDate() + diffToLastMonday);
      
      // End of last week (Sunday)
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
      
      startDate = getUTCStartOfDay(startOfLastWeek);
      endDate = getUTCEndOfDay(endOfLastWeek);
      break;
    }
    
    case "Previous week": {
      // Same as "Last week" for now
      const startOfLastWeek = new Date(now);
      const dayOfWeek = startOfLastWeek.getDay();
      const diffToLastMonday = dayOfWeek === 0 ? -13 : -6 - dayOfWeek;
      startOfLastWeek.setDate(startOfLastWeek.getDate() + diffToLastMonday);
      
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
      
      startDate = getUTCStartOfDay(startOfLastWeek);
      endDate = getUTCEndOfDay(endOfLastWeek);
      break;
    }
    
    case "This month": {
      // Start of current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      startDate = getUTCStartOfDay(startOfMonth);
      endDate = getUTCEndOfDay(now);
      break;
    }
    
    case "Last month": {
      // Start of last month
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      // End of last month
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      startDate = getUTCStartOfDay(startOfLastMonth);
      endDate = getUTCEndOfDay(endOfLastMonth);
      break;
    }
    
    case "Previous month": {
      // Same as "Last month" for now
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      startDate = getUTCStartOfDay(startOfLastMonth);
      endDate = getUTCEndOfDay(endOfLastMonth);
      break;
    }
    
    case "Year to date": {
      // Start of current year
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      startDate = getUTCStartOfDay(startOfYear);
      endDate = getUTCEndOfDay(now);
      break;
    }
    
    case "All time": {
      // Set a very early start date (e.g., January 1, 2020)
      const allTimeStart = new Date(2020, 0, 1);
      
      startDate = getUTCStartOfDay(allTimeStart);
      endDate = getUTCEndOfDay(now);
      break;
    }
    
    default: {
      // Default to "This week"
      const startOfWeek = new Date(now);
      const dayOfWeek = startOfWeek.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      
      startDate = getUTCStartOfDay(startOfWeek);
      endDate = getUTCEndOfDay(now);
      break;
    }
  }
  
  return { startDate, endDate };
};

// Helper function to get current date in the format used by the current implementation
export const getCurrentDayForGameDate = () => {
  const d = new Date();
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
  return Date.parse(completeDate);
};