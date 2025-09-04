import { getDateRange } from './dateRange';

/**
 * Calculate cutoff timestamp for filtering lastPlayedGames
 * Returns a timestamp that's 30 days before the first date in the selected date filter
 * @param {Object} dateFilter - The selected date filter object
 * @returns {number} Cutoff timestamp in milliseconds
 */
export const calculateCutoffTimestamp = (dateFilter) => {
  if (!dateFilter) return 0;
  
  // For "All time", use a very old date (Jan 1, 2022)
  if (dateFilter.value === "All time") {
    return new Date('2022-01-01T00:00:00.000Z').getTime();
  }
  
  try {
    const { startDate } = getDateRange(dateFilter);
    const cutoffDate = new Date(startDate);
    
    // Use appropriate buffer based on the time period
    let bufferDays;
    if (dateFilter.value.toLowerCase().includes('week')) {
      bufferDays = 7; // For weekly views, go back 1 additional week
    } else if (dateFilter.value.toLowerCase().includes('month')) {
      bufferDays = 30; // For monthly views, go back 1 additional month
    } else if (dateFilter.value.toLowerCase().includes('year')) {
      bufferDays = 90; // For yearly views, go back 3 additional months
    } else {
      bufferDays = 14; // Default fallback
    }
    
    cutoffDate.setDate(cutoffDate.getDate() - bufferDays);
    
    console.log(`[CUTOFF DEBUG] Filter: ${dateFilter.value}, Buffer: ${bufferDays} days, Cutoff: ${cutoffDate.toISOString()}`);
    
    return cutoffDate.getTime();
  } catch (error) {
    console.warn('Error calculating cutoff timestamp:', error);
    return 0;
  }
};

/**
 * Filter lastPlayedGames from profile data based on cutoff timestamp
 * @param {Array} lastPlayedGames - Array of game objects with game name and timestamp
 * @param {number} cutoffTimestamp - Cutoff timestamp in milliseconds
 * @returns {Array} Filtered array of game names that were played after cutoff
 */
export const filterRecentlyPlayedGames = (lastPlayedGames, cutoffTimestamp) => {
  if (!Array.isArray(lastPlayedGames) || !cutoffTimestamp) {
    return [];
  }
  
  return lastPlayedGames
    .filter(gameEntry => gameEntry.timestamp >= cutoffTimestamp)
    .map(gameEntry => gameEntry.game)
    .filter(Boolean); // Remove any falsy values
};

/**
 * Create enhanced recent games data using profile's lastPlayedGames
 * @param {Array} lastPlayedGames - Array from profile data
 * @param {Object} dateFilter - Selected date filter
 * @param {Array} allGames - All available games list
 * @returns {Object} Enhanced recent games data with gamesToday and gamesInPeriod
 */
export const createEnhancedRecentGamesData = (lastPlayedGames, dateFilter, allGames) => {
  if (!Array.isArray(lastPlayedGames) || !dateFilter || !Array.isArray(allGames)) {
    return { gamesToday: [], gamesInPeriod: [] };
  }
  
  
  const cutoffTimestamp = calculateCutoffTimestamp(dateFilter);
  const recentGameNames = filterRecentlyPlayedGames(lastPlayedGames, cutoffTimestamp);
  
  // Convert game names to the expected format with game details
  // User's lastPlayedGames contains game values with spaces removed
  const enhancedGames = recentGameNames
    .map(gameName => {
      // Try exact match first
      let gameDetail = allGames.find(g => 
        g.value?.toLowerCase() === gameName?.toLowerCase() || 
        g.name?.toLowerCase() === gameName?.toLowerCase()
      );
      
      // If no exact match, try matching by removing spaces from game values
      if (!gameDetail) {
        gameDetail = allGames.find(g => 
          g.value?.replace(/\s/g, '').toLowerCase() === gameName?.toLowerCase()
        );
        if (gameDetail) {
          console.log(`[GAME MATCHING DEBUG] Space-removed match: "${gameName}" → "${gameDetail.value}"`);
        }
      } else {
        console.log(`[GAME MATCHING DEBUG] Direct match: "${gameName}" → "${gameDetail.value}"`);
      }
      
      if (gameDetail) {
        const gameEntry = lastPlayedGames.find(g => g.game === gameName);
        return {
          gameName: gameDetail.value,
          name: gameDetail.name,
          url: gameDetail.url,
          lastPlayed: gameEntry?.timestamp,
          // Determine if played today
          playedToday: isPlayedToday(gameEntry?.timestamp)
        };
      } else {
        console.log(`[GAME MATCHING DEBUG] Could not find game "${gameName}" in allGames list`);
      }
      return null;
    })
    .filter(Boolean);

  console.log(`[FILTERING DEBUG] Input: ${recentGameNames.length} games, After matching: ${enhancedGames.length} games`);
  console.log(`[FILTERING DEBUG] Games that didn't match:`, recentGameNames.filter(gameName => {
    const exactMatch = allGames.find(g => g.value?.toLowerCase() === gameName?.toLowerCase() || g.name?.toLowerCase() === gameName?.toLowerCase());
    const spaceRemovedMatch = allGames.find(g => g.value?.replace(/\s/g, '').toLowerCase() === gameName?.toLowerCase());
    return !exactMatch && !spaceRemovedMatch;
  }));
  
  // Split into today vs in period
  const gamesToday = enhancedGames.filter(game => game.playedToday);
  const gamesInPeriod = enhancedGames.filter(game => !game.playedToday);
  
  console.log(`[ENHANCED GAMES] Cutoff: ${new Date(cutoffTimestamp).toISOString()}`);
  console.log(`[ENHANCED GAMES] Recent games: ${recentGameNames.length}, Today: ${gamesToday.length}, In period: ${gamesInPeriod.length}`);
  
  
  return { gamesToday, gamesInPeriod };
};

/**
 * Check if a timestamp represents today
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {boolean} True if timestamp is from today
 */
const isPlayedToday = (timestamp) => {
  if (!timestamp) return false;
  
  const today = new Date();
  const gameDate = new Date(timestamp);
  
  return today.toDateString() === gameDate.toDateString();
};