// Utility function to calculate start and end dates based on date filter
export const getDateRange = (dateFilter) => {
  const now = new Date();
  
  // Helper to get start of day in UTC
  const getUTCStartOfDay = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    return utcDate.getTime();
  };
  
  // Helper to get end of day in UTC
  const getUTCEndOfDay = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
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
      
      // End of current week (Sunday) but not beyond today
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      startDate = getUTCStartOfDay(startOfWeek);
      endDate = getUTCEndOfDay(endOfWeek < now ? endOfWeek : now);
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
      
      // End of current month but not beyond today
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      startDate = getUTCStartOfDay(startOfMonth);
      endDate = getUTCEndOfDay(endOfMonth < now ? endOfMonth : now);
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
      
      // End of current week (Sunday) but not beyond today
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      startDate = getUTCStartOfDay(startOfWeek);
      endDate = getUTCEndOfDay(endOfWeek < now ? endOfWeek : now);
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

// Generate all dates in the range for filling missing dates, excluding future dates
export const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  // Cap the end date to today to exclude future dates
  const actualEnd = end < today ? end : today;
  
  while (current <= actualEnd) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

// Fill missing dates in diary data with zero values
export const fillMissingDates = (diaryData, dateFilter) => {
  if (!diaryData || !dateFilter) return diaryData;
  
  const { startDate, endDate } = getDateRange(dateFilter);
  const allDates = generateDateRange(startDate, endDate);
  
  // Create a map of existing dates from diary data
  const existingDataMap = new Map();
  diaryData.forEach(entry => {
    if (entry.date) {
      existingDataMap.set(entry.date, entry);
    }
  });
  
  // Generate complete diary data with missing dates filled in
  const completeDiaryData = allDates.map(date => {
    const dateKey = date.toISOString().split('T')[0] + 'T00:00:00.000Z';
    const dateString = date.toISOString().split('T')[0];
    
    // Try multiple potential date formats from API
    const potentialKeys = [
      dateKey,
      date.toISOString(),
      dateString,
      dateString + 'T00:00:00.000Z'
    ];
    
    let existingEntry = null;
    for (const key of potentialKeys) {
      if (existingDataMap.has(key)) {
        existingEntry = existingDataMap.get(key);
        break;
      }
    }
    
    // Calculate day label (today, yesterday, tomorrow, or date string) FIRST
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let dayLabel = dateString;
    
    // Compare dates by converting to date strings to avoid time zone issues
    const targetDateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    console.log(`[FILL MISSING DATES DEBUG] targetDateStr: ${targetDateStr}, todayStr: ${todayStr}, yesterdayStr: ${yesterdayStr}`);
    
    if (targetDateStr === todayStr) {
      console.log(`[FILL MISSING DATES DEBUG] Setting dayLabel to 'today' for ${targetDateStr}`);
      dayLabel = 'today';
    } else if (targetDateStr === yesterdayStr) {
      console.log(`[FILL MISSING DATES DEBUG] Setting dayLabel to 'yesterday' for ${targetDateStr}`);
      dayLabel = 'yesterday';
    } else if (targetDateStr === tomorrowStr) {
      console.log(`[FILL MISSING DATES DEBUG] Setting dayLabel to 'tomorrow' for ${targetDateStr}`);
      dayLabel = 'tomorrow';
    }
    
    console.log(`[FILL MISSING DATES DEBUG] Final dayLabel for ${targetDateStr}: "${dayLabel}"`);

    if (existingEntry) {
      // Return existing entry but with corrected day label
      return {
        ...existingEntry,
        day: dayLabel
      };
    }

    // Create entry with zero values for missing dates
    return {
      day: dayLabel,
      date: dateKey,
      played: 0,
      won: 0,
      points: 0
    };
  });
  
  // Sort chronologically (newest first, excluding special days)
  return completeDiaryData.sort((a, b) => {
    // Handle special day keys
    if (a.day === 'tomorrow') return -1;
    if (b.day === 'tomorrow') return 1;
    if (a.day === 'today') return -1;
    if (b.day === 'today') return 1;
    if (a.day === 'yesterday') return -1;
    if (b.day === 'yesterday') return 1;
    
    // For regular dates, sort newest first
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    } catch (error) {
      console.error('Date sorting error:', error);
      return 0;
    }
  });
};