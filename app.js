// Albion Gear Price Finder - Main Application Logic

// API Configuration
const API_BASE_URL = 'https://west.albion-online-data.com/api/v2/stats/prices';
const FALLBACK_API_URL = 'https://east.albion-online-data.com/api/v2/stats/prices';

// Tier equivalency mapping
// Each effective tier maps to an array of [baseTier, enchantment] pairs
const TIER_EQUIVALENTS = {
    '4.0': [[4, 0]],
    '4.1': [[4, 1]],
    '4.2': [[4, 2], [5, 1], [6, 0]],
    '4.3': [[4, 3], [5, 2], [6, 1], [7, 0]],
    '5.0': [[5, 0]],
    '5.1': [[4, 2], [5, 1], [6, 0]],
    '5.2': [[4, 3], [5, 2], [6, 1], [7, 0]],
    '5.3': [[5, 3], [6, 2], [7, 1], [8, 0]],
    '6.0': [[4, 2], [5, 1], [6, 0]],
    '6.1': [[4, 3], [5, 2], [6, 1], [7, 0]],
    '6.2': [[5, 3], [6, 2], [7, 1], [8, 0]],
    '6.3': [[6, 3], [7, 2], [8, 1]],
    '7.0': [[4, 3], [5, 2], [6, 1], [7, 0]],
    '7.1': [[5, 3], [6, 2], [7, 1], [8, 0]],
    '7.2': [[6, 3], [7, 2], [8, 1]],
    '7.3': [[7, 3], [8, 2]],
    '8.0': [[5, 3], [6, 2], [7, 1], [8, 0]],
    '8.1': [[6, 3], [7, 2], [8, 1]],
    '8.2': [[7, 3], [8, 2]],
    '8.3': [[8, 3]]
};

// Generate item ID with tier and enchantment
function generateItemId(baseItemId, tier, enchantment) {
    // Remove any existing tier prefix
    const itemIdWithoutTier = baseItemId.replace(/^T\d+_/, '');
    
    // Add new tier prefix
    let itemId = `T${tier}_${itemIdWithoutTier}`;
    
    // Add enchantment suffix if > 0
    if (enchantment > 0) {
        itemId += `@${enchantment}`;
    }
    
    return itemId;
}

// Fetch price data from Albion Online Data Project API
async function fetchPriceData(itemIds, location) {
    const itemsParam = itemIds.join(',');
    const locationsParam = location === 'all' ? '' : `&locations=${location}`;
    
    try {
        const url = `${API_BASE_URL}/${itemsParam}?qualities=1${locationsParam}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching price data:', error);
        // Try fallback API
        try {
            const url = `${FALLBACK_API_URL}/${itemsParam}?qualities=1${locationsParam}`;
            console.log('Trying fallback API:', url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (fallbackError) {
            console.error('Fallback API also failed:', fallbackError);
            throw fallbackError;
        }
    }
}

// Format price with commas
function formatPrice(price) {
    return price.toLocaleString('en-US');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Display results
function displayResults(priceData, equivalents, baseItemId) {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '';
    
    if (!priceData || priceData.length === 0) {
        resultsContent.innerHTML = `
            <div class="no-results">
                <p>No price data found for this item.</p>
                <p>Make sure you're using the correct item ID format (e.g., T4_HEAD_LEATHER_SET1)</p>
            </div>
        `;
        return;
    }
    
    // Group results by item and calculate lowest sell price
    const itemResults = [];
    
    for (const [tier, enchantment] of equivalents) {
        const itemId = generateItemId(baseItemId, tier, enchantment);
        const itemPrices = priceData.filter(p => p.item_id === itemId);
        
        if (itemPrices.length === 0) continue;
        
        // Find lowest sell price across all locations for this item
        let lowestPrice = Infinity;
        let bestLocation = null;
        let bestData = null;
        
        for (const priceInfo of itemPrices) {
            if (priceInfo.sell_price_min > 0 && priceInfo.sell_price_min < lowestPrice) {
                lowestPrice = priceInfo.sell_price_min;
                bestLocation = priceInfo.city;
                bestData = priceInfo;
            }
        }
        
        if (bestData) {
            itemResults.push({
                itemId,
                tier,
                enchantment,
                displayTier: enchantment > 0 ? `${tier}.${enchantment}` : `${tier}.0`,
                price: lowestPrice,
                location: bestLocation,
                sellPriceMax: bestData.sell_price_max,
                buyPriceMin: bestData.buy_price_min,
                buyPriceMax: bestData.buy_price_max,
                lastUpdate: bestData.sell_price_min_date
            });
        }
    }
    
    // Sort by price
    itemResults.sort((a, b) => a.price - b.price);
    
    if (itemResults.length === 0) {
        resultsContent.innerHTML = `
            <div class="no-results">
                <p>No active market listings found for these items.</p>
            </div>
        `;
        return;
    }
    
    // Display results
    itemResults.forEach((result, index) => {
        const isCheapest = index === 0;
        const card = document.createElement('div');
        card.className = `result-card ${isCheapest ? 'cheapest' : ''}`;
        
        card.innerHTML = `
            <div class="result-header">
                <div class="result-title">Tier ${result.displayTier}</div>
                <div class="result-price">${formatPrice(result.price)} 🪙</div>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <div class="detail-label">Item ID:</div>
                    <div class="detail-value">${result.itemId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location:</div>
                    <div class="detail-value">${result.location}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Buy Price:</div>
                    <div class="detail-value">${result.buyPriceMax > 0 ? formatPrice(result.buyPriceMax) : 'N/A'} 🪙</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Last Updated:</div>
                    <div class="detail-value">${formatDate(result.lastUpdate)}</div>
                </div>
            </div>
        `;
        
        resultsContent.appendChild(card);
    });
    
    // Show savings information
    if (itemResults.length > 1) {
        const savings = itemResults[itemResults.length - 1].price - itemResults[0].price;
        const savingsPercent = ((savings / itemResults[itemResults.length - 1].price) * 100).toFixed(1);
        
        const savingsInfo = document.createElement('div');
        savingsInfo.className = 'result-card';
        savingsInfo.style.background = '#e8f5e9';
        savingsInfo.style.borderColor = '#4caf50';
        savingsInfo.innerHTML = `
            <div class="result-header">
                <div class="result-title">💰 Potential Savings</div>
                <div class="result-price">${formatPrice(savings)} 🪙 (${savingsPercent}%)</div>
            </div>
            <p style="margin-top: 10px; color: #555;">
                By choosing the cheapest equivalent tier instead of the most expensive option.
            </p>
        `;
        
        resultsContent.appendChild(savingsInfo);
    }
}

// Main function to find prices
async function findPrices() {
    const itemName = document.getElementById('itemName').value.trim();
    const desiredTier = document.getElementById('desiredTier').value;
    const location = document.getElementById('location').value;
    
    if (!itemName) {
        // Show error message in results section instead of alert
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        resultsSection.style.display = 'block';
        resultsContent.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> Please enter an item name
            </div>
        `;
        return;
    }
    
    // Show loading state
    const resultsSection = document.getElementById('resultsSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContent = document.getElementById('resultsContent');
    const findButton = document.getElementById('findPrices');
    
    resultsSection.style.display = 'block';
    loadingIndicator.style.display = 'block';
    resultsContent.innerHTML = '';
    findButton.disabled = true;
    
    try {
        // Get equivalent tiers
        const equivalents = TIER_EQUIVALENTS[desiredTier];
        
        if (!equivalents) {
            throw new Error('Invalid tier selection');
        }
        
        // Generate all item IDs to check
        const itemIds = equivalents.map(([tier, enchantment]) => 
            generateItemId(itemName, tier, enchantment)
        );
        
        console.log('Checking items:', itemIds);
        
        // Fetch price data
        const priceData = await fetchPriceData(itemIds, location);
        
        // Display results
        displayResults(priceData, equivalents, itemName);
        
    } catch (error) {
        console.error('Error:', error);
        resultsContent.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${error.message || 'Failed to fetch price data. Please try again.'}
            </div>
        `;
    } finally {
        loadingIndicator.style.display = 'none';
        findButton.disabled = false;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const findButton = document.getElementById('findPrices');
    findButton.addEventListener('click', findPrices);
    
    // Allow Enter key to trigger search
    document.getElementById('itemName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            findPrices();
        }
    });
});
