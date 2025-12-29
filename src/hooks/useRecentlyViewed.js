export const useRecentlyViewed = () => {
  const addToRecentlyViewed = (terreno) => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove the terreno if it already exists
    const filtered = recentlyViewed.filter(item => item._id !== terreno._id);
    
    // Add the new terreno to the beginning of the array
    const updated = [terreno, ...filtered].slice(0, 8); // Keep only the last 8 items
    
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  return { addToRecentlyViewed };
};