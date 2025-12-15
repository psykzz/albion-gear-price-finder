// Albion Gear Price Finder - Main Application Logic

// API Configuration
const API_BASE_URL = 'https://europe.albion-online-data.com/api/v2/stats/prices';
const FALLBACK_API_URL = 'https://europe.albion-online-data.com/api/v2/stats/prices';

// Local Storage Keys
const STORAGE_KEYS = {
    ITEM_CATEGORY: 'albion_gear_finder_item_category',
    ITEM_SELECT: 'albion_gear_finder_item_select',
    DESIRED_TIER: 'albion_gear_finder_desired_tier',
    LOCATION: 'albion_gear_finder_location'
};

// Item database organized by category
const ITEM_DATABASE = {
    helmet: [
        { name: 'Leather Hood', id: 'HEAD_LEATHER_SET1' },
        { name: 'Mercenary Hood', id: 'HEAD_LEATHER_SET2' },
        { name: 'Hunter Hood', id: 'HEAD_LEATHER_SET3' },
        { name: 'Soldier Helmet', id: 'HEAD_PLATE_SET1' },
        { name: 'Knight Helmet', id: 'HEAD_PLATE_SET2' },
        { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
        { name: 'Cloth Cowl', id: 'HEAD_CLOTH_SET1' },
        { name: 'Cleric Cowl', id: 'HEAD_CLOTH_SET2' },
        { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' }
    ],
    armor: [
        { name: 'Leather Jacket', id: 'ARMOR_LEATHER_SET1' },
        { name: 'Mercenary Jacket', id: 'ARMOR_LEATHER_SET2' },
        { name: 'Hunter Jacket', id: 'ARMOR_LEATHER_SET3' },
        { name: 'Soldier Armor', id: 'ARMOR_PLATE_SET1' },
        { name: 'Knight Armor', id: 'ARMOR_PLATE_SET2' },
        { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
        { name: 'Cloth Robe', id: 'ARMOR_CLOTH_SET1' },
        { name: 'Cleric Robe', id: 'ARMOR_CLOTH_SET2' },
        { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' }
    ],
    boots: [
        { name: 'Leather Shoes', id: 'SHOES_LEATHER_SET1' },
        { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET2' },
        { name: 'Hunter Shoes', id: 'SHOES_LEATHER_SET3' },
        { name: 'Soldier Boots', id: 'SHOES_PLATE_SET1' },
        { name: 'Knight Boots', id: 'SHOES_PLATE_SET2' },
        { name: 'Guardian Boots', id: 'SHOES_PLATE_SET3' },
        { name: 'Cloth Sandals', id: 'SHOES_CLOTH_SET1' },
        { name: 'Cleric Sandals', id: 'SHOES_CLOTH_SET2' },
        { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' }
    ],
    // Swords
    'weapon-sword': [
        { name: 'Broadsword', id: 'MAIN_SWORD' },
        { name: 'Claymore', id: 'MAIN_CLAYMORE' },
        { name: 'Dual Swords', id: 'MAIN_DUALSWORD' },
        { name: 'Carving Sword', id: 'MAIN_SCIMITAR_MORGANA' },
        { name: 'Galatine Pair', id: 'MAIN_DUALSWORD_UNDEAD' },
        { name: 'Clarent Blade', id: 'MAIN_CLAYMORE_AVALON' }
    ],
    // Axes
    'weapon-axe': [
        { name: 'Battleaxe', id: 'MAIN_AXE' },
        { name: 'Greataxe', id: 'MAIN_GREATAXE' },
        { name: 'Halberd', id: 'MAIN_HALBERD' },
        { name: 'Carrioncaller', id: 'MAIN_HALBERD_MORGANA' },
        { name: 'Infernal Scythe', id: 'MAIN_SCYTHE_HELL' },
        { name: 'Bear Paws', id: 'MAIN_AXE_KEEPER' }
    ],
    // Maces
    'weapon-mace': [
        { name: 'Mace', id: 'MAIN_MACE' },
        { name: 'Heavy Mace', id: 'MAIN_HEAVYMACE' },
        { name: 'Morning Star', id: 'MAIN_MORNINGSTAR' },
        { name: 'Bedrock Mace', id: 'MAIN_MACE_KEEPER' },
        { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
        { name: 'Camlann Mace', id: 'MAIN_MACE_AVALON' }
    ],
    // Hammers
    'weapon-hammer': [
        { name: 'Hammer', id: 'MAIN_HAMMER' },
        { name: 'Polehammer', id: 'MAIN_POLEHAMMER' },
        { name: 'Great Hammer', id: 'MAIN_GREATHAMMER' },
        { name: 'Forge Hammers', id: 'MAIN_HAMMER_UNDEAD' },
        { name: 'Grovekeeper', id: 'MAIN_HAMMER_KEEPER' },
        { name: 'Hand of Justice', id: 'MAIN_HAMMER_AVALON' }
    ],
    // Crossbows
    'weapon-crossbow': [
        { name: 'Crossbow', id: 'MAIN_CROSSBOW' },
        { name: 'Heavy Crossbow', id: 'MAIN_CROSSBOWLARGE' },
        { name: 'Light Crossbow', id: 'MAIN_CROSSBOW_CANNON' },
        { name: 'Weeping Repeater', id: 'MAIN_CROSSBOW_UNDEAD' },
        { name: 'Siegebow', id: 'MAIN_CROSSBOWLARGE_MORGANA' },
        { name: 'Boltcasters', id: 'MAIN_CROSSBOW_AVALON' }
    ],
    // Bows
    'weapon-bow': [
        { name: 'Bow', id: 'MAIN_BOW' },
        { name: 'Warbow', id: 'MAIN_WARBOW' },
        { name: 'Longbow', id: 'MAIN_LONGBOW' },
        { name: 'Whispering Bow', id: 'MAIN_BOW_KEEPER' },
        { name: 'Wailing Bow', id: 'MAIN_WARBOW_UNDEAD' },
        { name: 'Bow of Badon', id: 'MAIN_LONGBOW_UNDEAD' }
    ],
    // Spears
    'weapon-spear': [
        { name: 'Spear', id: 'MAIN_SPEAR' },
        { name: 'Pike', id: 'MAIN_PIKE' },
        { name: 'Glaive', id: 'MAIN_GLAIVE' },
        { name: 'Trinity Spear', id: 'MAIN_SPEAR_KEEPER' },
        { name: 'Spirithunter', id: 'MAIN_GLAIVE_HELL' },
        { name: 'Daybreaker', id: 'MAIN_SPEAR_AVALON' }
    ],
    // Quarterstaffs
    'weapon-quarterstaff': [
        { name: 'Quarterstaff', id: 'MAIN_QUARTERSTAFF' },
        { name: 'Iron-clad Staff', id: 'MAIN_IRONCLADEDSTAFF' },
        { name: 'Double Bladed Staff', id: 'MAIN_DOUBLEBLADEDSTAFF' },
        { name: 'Black Monk Stave', id: 'MAIN_QUARTERSTAFF_AVALON' },
        { name: 'Soulscythe', id: 'MAIN_DOUBLEBLADEDSTAFF_HELL' },
        { name: 'Staff of Balance', id: 'MAIN_IRONCLADEDSTAFF_HELL' }
    ],
    // Daggers
    'weapon-dagger': [
        { name: 'Dagger', id: 'MAIN_DAGGER' },
        { name: 'Dagger Pair', id: 'MAIN_DAGGERPAIR' },
        { name: 'Claws', id: 'MAIN_CLAWPAIR' },
        { name: 'Bloodletter', id: 'MAIN_DAGGER_HELL' },
        { name: 'Deathgivers', id: 'MAIN_DAGGERPAIR_UNDEAD' },
        { name: 'Black Hands', id: 'MAIN_CLAWPAIR_MORGANA' }
    ],
    // Fire Staffs
    'weapon-firestaff': [
        { name: 'Fire Staff', id: 'MAIN_FIRESTAFF' },
        { name: 'Great Fire Staff', id: 'MAIN_FIRESTAFF_CRYSTAL' },
        { name: 'Infernal Staff', id: 'MAIN_INFERNOSTAFF' },
        { name: 'Wildfire Staff', id: 'MAIN_FIRESTAFF_KEEPER' },
        { name: 'Brimstone Staff', id: 'MAIN_INFERNOSTAFF_MORGANA' },
        { name: 'Blazing Staff', id: 'MAIN_FIRESTAFF_HELL' }
    ],
    // Frost Staffs
    'weapon-froststaff': [
        { name: 'Frost Staff', id: 'MAIN_FROSTSTAFF' },
        { name: 'Glacial Staff', id: 'MAIN_ICEGAUNTLETS' },
        { name: 'Hoarfrost Staff', id: 'MAIN_ICECRYSTAL' },
        { name: 'Chillhowl', id: 'MAIN_FROSTSTAFF_KEEPER' },
        { name: 'Icicle Staff', id: 'MAIN_ICECRYSTAL_UNDEAD' },
        { name: 'Permafrost Prism', id: 'MAIN_ICEGAUNTLETS_HELL' }
    ],
    // Arcane Staffs
    'weapon-arcanestaff': [
        { name: 'Arcane Staff', id: 'MAIN_ARCANESTAFF' },
        { name: 'Great Arcane Staff', id: 'MAIN_ARCANE_RINGPAIR' },
        { name: 'Enigmatic Staff', id: 'MAIN_ENIGMATICSTAFF' },
        { name: 'Witchwork Staff', id: 'MAIN_ARCANESTAFF_HELL' },
        { name: 'Occult Staff', id: 'MAIN_ENIGMATICSTAFF_MORGANA' },
        { name: 'Evensong', id: 'MAIN_ENIGMATICORB_MORGANA' }
    ],
    // Holy Staffs
    'weapon-holystaff': [
        { name: 'Holy Staff', id: 'MAIN_HOLYSTAFF' },
        { name: 'Great Holy Staff', id: 'MAIN_HOLYSTAFF_CRYSTAL' },
        { name: 'Divine Staff', id: 'MAIN_DIVINESTAFF' },
        { name: 'Redemption Staff', id: 'MAIN_HOLYSTAFF_MORGANA' },
        { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_HELL' },
        { name: 'Lifetouch Staff', id: 'MAIN_HOLYSTAFF_UNDEAD' }
    ],
    // Nature Staffs
    'weapon-naturestaff': [
        { name: 'Nature Staff', id: 'MAIN_NATURESTAFF' },
        { name: 'Great Nature Staff', id: 'MAIN_NATURESTAFF_KEEPER' },
        { name: 'Wild Staff', id: 'MAIN_WILDSTAFF' },
        { name: 'Druidic Staff', id: 'MAIN_NATURESTAFF_AVALON' },
        { name: 'Blight Staff', id: 'MAIN_WILDSTAFF_HELL' },
        { name: 'Rampant Staff', id: 'MAIN_NATURESTAFF_HELL' }
    ],
    // Cursed Staffs
    'weapon-cursedstaff': [
        { name: 'Cursed Staff', id: 'MAIN_CURSEDSTAFF' },
        { name: 'Demonic Staff', id: 'MAIN_DEMONICSTAFF' },
        { name: 'Great Cursed Staff', id: 'MAIN_CURSEDSTAFF_MORGANA' },
        { name: 'Cursed Skull', id: 'MAIN_CURSEDSTAFF_UNDEAD' },
        { name: 'Damnation Staff', id: 'MAIN_DEMONICSTAFF_HELL' },
        { name: 'Shadowcaller', id: 'MAIN_CURSEDSTAFF_AVALON' }
    ],
    offhand: [
        { name: 'Shield', id: 'OFF_SHIELD' },
        { name: 'Sarcophagus', id: 'OFF_SARCOPHAGUS' },
        { name: 'Tome of Insight', id: 'OFF_TOWERSHIELD_UNDEAD' },
        { name: 'Book', id: 'OFF_BOOK' },
        { name: 'Tome of Spells', id: 'OFF_ORB' },
        { name: 'Eye of Secrets', id: 'OFF_DEMONSKULL' },
        { name: 'Taproot', id: 'OFF_TOTEM' },
        { name: 'Mistcaller', id: 'OFF_HORN' },
        { name: 'Facebreaker', id: 'OFF_TALISMAN' },
        { name: 'Torch', id: 'OFF_TORCH' }
    ]
};

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

// Flag to prevent saving during restoration
let isRestoring = false;

// Save selections to local storage
function saveToLocalStorage(key, value) {
    // Skip saving during restoration to avoid unnecessary writes
    if (isRestoring) return;
    
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Load selection from local storage
function loadFromLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
}

// Populate item select dropdown based on category
function populateItemSelect(category) {
    const itemSelect = document.getElementById('itemSelect');
    const itemSelectGroup = document.getElementById('itemSelectGroup');
    
    if (!category) {
        itemSelectGroup.style.display = 'none';
        itemSelect.innerHTML = '<option value="">-- Select an Item --</option>';
        return;
    }
    
    const items = ITEM_DATABASE[category] || [];
    itemSelect.innerHTML = '<option value="">-- Select an Item --</option>';
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        itemSelect.appendChild(option);
    });
    
    itemSelectGroup.style.display = 'block';
}

// Main function to find prices
async function findPrices() {
    const itemName = document.getElementById('itemSelect').value;
    const desiredTier = document.getElementById('desiredTier').value;
    const location = document.getElementById('location').value;
    
    if (!itemName) {
        // Show error message in results section instead of alert
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        resultsSection.style.display = 'block';
        resultsContent.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> Please select a category and an item
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

// Restore saved selections from local storage
function restoreSavedSelections() {
    // Set flag to prevent saving during restoration
    isRestoring = true;
    
    const itemCategory = document.getElementById('itemCategory');
    const itemSelect = document.getElementById('itemSelect');
    const desiredTier = document.getElementById('desiredTier');
    const location = document.getElementById('location');
    
    // Restore location
    const savedLocation = loadFromLocalStorage(STORAGE_KEYS.LOCATION);
    if (savedLocation && location) {
        location.value = savedLocation;
    }
    
    // Restore desired tier
    const savedTier = loadFromLocalStorage(STORAGE_KEYS.DESIRED_TIER);
    if (savedTier && desiredTier) {
        desiredTier.value = savedTier;
    }
    
    // Restore category first (this will populate the item select)
    const savedCategory = loadFromLocalStorage(STORAGE_KEYS.ITEM_CATEGORY);
    if (savedCategory && itemCategory) {
        itemCategory.value = savedCategory;
        populateItemSelect(savedCategory);
        
        // After populating items, restore the selected item
        const savedItem = loadFromLocalStorage(STORAGE_KEYS.ITEM_SELECT);
        if (savedItem && itemSelect) {
            // Validate that the saved item exists in the options
            const optionExists = itemSelect.querySelector(`option[value='${savedItem}']`) !== null;
            if (optionExists) {
                itemSelect.value = savedItem;
            }
            // Note: invalid items will be cleared on next manual category change
        }
    }
    
    // Clear flag after restoration is complete
    isRestoring = false;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const findButton = document.getElementById('findPrices');
    const itemCategory = document.getElementById('itemCategory');
    const itemSelect = document.getElementById('itemSelect');
    const desiredTier = document.getElementById('desiredTier');
    const location = document.getElementById('location');
    
    // Handle category selection
    itemCategory.addEventListener('change', (e) => {
        const categoryValue = e.target.value;
        populateItemSelect(categoryValue);
        saveToLocalStorage(STORAGE_KEYS.ITEM_CATEGORY, categoryValue);
        // Clear item selection when category changes (skip during restoration)
        if (!isRestoring) {
            itemSelect.value = '';
            saveToLocalStorage(STORAGE_KEYS.ITEM_SELECT, '');
        }
    });
    
    // Handle item selection
    itemSelect.addEventListener('change', (e) => {
        saveToLocalStorage(STORAGE_KEYS.ITEM_SELECT, e.target.value);
    });
    
    // Handle desired tier selection
    desiredTier.addEventListener('change', (e) => {
        saveToLocalStorage(STORAGE_KEYS.DESIRED_TIER, e.target.value);
    });
    
    // Handle location selection
    location.addEventListener('change', (e) => {
        saveToLocalStorage(STORAGE_KEYS.LOCATION, e.target.value);
    });
    
    // Handle find prices button
    findButton.addEventListener('click', findPrices);
    
    // Restore saved selections after event listeners are set up
    restoreSavedSelections();
});
