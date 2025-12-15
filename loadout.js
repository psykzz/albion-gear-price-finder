// Albion Gear Price Finder - Loadout View Logic

// API Configuration
const API_BASE_URL = 'https://europe.albion-online-data.com/api/v2/stats/prices';
const FALLBACK_API_URL = 'https://europe.albion-online-data.com/api/v2/stats/prices';

// Item database organized by category (same as app.js)
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
    'weapon-sword': [
        { name: 'Broadsword', id: 'MAIN_SWORD' },
        { name: 'Claymore', id: 'MAIN_CLAYMORE' },
        { name: 'Dual Swords', id: 'MAIN_DUALSWORD' },
        { name: 'Carving Sword', id: 'MAIN_SCIMITAR_MORGANA' },
        { name: 'Galatine Pair', id: 'MAIN_DUALSWORD_UNDEAD' },
        { name: 'Clarent Blade', id: 'MAIN_CLAYMORE_AVALON' }
    ],
    'weapon-axe': [
        { name: 'Battleaxe', id: 'MAIN_AXE' },
        { name: 'Greataxe', id: 'MAIN_GREATAXE' },
        { name: 'Halberd', id: 'MAIN_HALBERD' },
        { name: 'Carrioncaller', id: 'MAIN_HALBERD_MORGANA' },
        { name: 'Infernal Scythe', id: 'MAIN_SCYTHE_HELL' },
        { name: 'Bear Paws', id: 'MAIN_AXE_KEEPER' }
    ],
    'weapon-mace': [
        { name: 'Mace', id: 'MAIN_MACE' },
        { name: 'Heavy Mace', id: 'MAIN_HEAVYMACE' },
        { name: 'Morning Star', id: 'MAIN_MORNINGSTAR' },
        { name: 'Bedrock Mace', id: 'MAIN_MACE_KEEPER' },
        { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
        { name: 'Camlann Mace', id: 'MAIN_MACE_AVALON' }
    ],
    'weapon-hammer': [
        { name: 'Hammer', id: 'MAIN_HAMMER' },
        { name: 'Polehammer', id: 'MAIN_POLEHAMMER' },
        { name: 'Great Hammer', id: 'MAIN_GREATHAMMER' },
        { name: 'Forge Hammers', id: 'MAIN_HAMMER_UNDEAD' },
        { name: 'Grovekeeper', id: 'MAIN_HAMMER_KEEPER' },
        { name: 'Hand of Justice', id: 'MAIN_HAMMER_AVALON' }
    ],
    'weapon-crossbow': [
        { name: 'Crossbow', id: 'MAIN_CROSSBOW' },
        { name: 'Heavy Crossbow', id: 'MAIN_CROSSBOWLARGE' },
        { name: 'Light Crossbow', id: 'MAIN_CROSSBOW_CANNON' },
        { name: 'Weeping Repeater', id: 'MAIN_CROSSBOW_UNDEAD' },
        { name: 'Siegebow', id: 'MAIN_CROSSBOWLARGE_MORGANA' },
        { name: 'Boltcasters', id: 'MAIN_CROSSBOW_AVALON' }
    ],
    'weapon-bow': [
        { name: 'Bow', id: 'MAIN_BOW' },
        { name: 'Warbow', id: 'MAIN_WARBOW' },
        { name: 'Longbow', id: 'MAIN_LONGBOW' },
        { name: 'Whispering Bow', id: 'MAIN_BOW_KEEPER' },
        { name: 'Wailing Bow', id: 'MAIN_WARBOW_UNDEAD' },
        { name: 'Bow of Badon', id: 'MAIN_LONGBOW_UNDEAD' }
    ],
    'weapon-spear': [
        { name: 'Spear', id: 'MAIN_SPEAR' },
        { name: 'Pike', id: 'MAIN_PIKE' },
        { name: 'Glaive', id: 'MAIN_GLAIVE' },
        { name: 'Trinity Spear', id: 'MAIN_SPEAR_KEEPER' },
        { name: 'Spirithunter', id: 'MAIN_GLAIVE_HELL' },
        { name: 'Daybreaker', id: 'MAIN_SPEAR_AVALON' }
    ],
    'weapon-quarterstaff': [
        { name: 'Quarterstaff', id: 'MAIN_QUARTERSTAFF' },
        { name: 'Iron-clad Staff', id: 'MAIN_IRONCLADEDSTAFF' },
        { name: 'Double Bladed Staff', id: 'MAIN_DOUBLEBLADEDSTAFF' },
        { name: 'Black Monk Stave', id: 'MAIN_QUARTERSTAFF_AVALON' },
        { name: 'Soulscythe', id: 'MAIN_DOUBLEBLADEDSTAFF_HELL' },
        { name: 'Staff of Balance', id: 'MAIN_IRONCLADEDSTAFF_HELL' }
    ],
    'weapon-dagger': [
        { name: 'Dagger', id: 'MAIN_DAGGER' },
        { name: 'Dagger Pair', id: 'MAIN_DAGGERPAIR' },
        { name: 'Claws', id: 'MAIN_CLAWPAIR' },
        { name: 'Bloodletter', id: 'MAIN_DAGGER_HELL' },
        { name: 'Deathgivers', id: 'MAIN_DAGGERPAIR_UNDEAD' },
        { name: 'Black Hands', id: 'MAIN_CLAWPAIR_MORGANA' }
    ],
    'weapon-firestaff': [
        { name: 'Fire Staff', id: 'MAIN_FIRESTAFF' },
        { name: 'Great Fire Staff', id: 'MAIN_FIRESTAFF_CRYSTAL' },
        { name: 'Infernal Staff', id: 'MAIN_INFERNOSTAFF' },
        { name: 'Wildfire Staff', id: 'MAIN_FIRESTAFF_KEEPER' },
        { name: 'Brimstone Staff', id: 'MAIN_INFERNOSTAFF_MORGANA' },
        { name: 'Blazing Staff', id: 'MAIN_FIRESTAFF_HELL' }
    ],
    'weapon-froststaff': [
        { name: 'Frost Staff', id: 'MAIN_FROSTSTAFF' },
        { name: 'Glacial Staff', id: 'MAIN_ICEGAUNTLETS' },
        { name: 'Hoarfrost Staff', id: 'MAIN_ICECRYSTAL' },
        { name: 'Chillhowl', id: 'MAIN_FROSTSTAFF_KEEPER' },
        { name: 'Icicle Staff', id: 'MAIN_ICECRYSTAL_UNDEAD' },
        { name: 'Permafrost Prism', id: 'MAIN_ICEGAUNTLETS_HELL' }
    ],
    'weapon-arcanestaff': [
        { name: 'Arcane Staff', id: 'MAIN_ARCANESTAFF' },
        { name: 'Great Arcane Staff', id: 'MAIN_ARCANE_RINGPAIR' },
        { name: 'Enigmatic Staff', id: 'MAIN_ENIGMATICSTAFF' },
        { name: 'Witchwork Staff', id: 'MAIN_ARCANESTAFF_HELL' },
        { name: 'Occult Staff', id: 'MAIN_ENIGMATICSTAFF_MORGANA' },
        { name: 'Evensong', id: 'MAIN_ENIGMATICORB_MORGANA' }
    ],
    'weapon-holystaff': [
        { name: 'Holy Staff', id: 'MAIN_HOLYSTAFF' },
        { name: 'Great Holy Staff', id: 'MAIN_HOLYSTAFF_CRYSTAL' },
        { name: 'Divine Staff', id: 'MAIN_DIVINESTAFF' },
        { name: 'Redemption Staff', id: 'MAIN_HOLYSTAFF_MORGANA' },
        { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_HELL' },
        { name: 'Lifetouch Staff', id: 'MAIN_HOLYSTAFF_UNDEAD' }
    ],
    'weapon-naturestaff': [
        { name: 'Nature Staff', id: 'MAIN_NATURESTAFF' },
        { name: 'Great Nature Staff', id: 'MAIN_NATURESTAFF_KEEPER' },
        { name: 'Wild Staff', id: 'MAIN_WILDSTAFF' },
        { name: 'Druidic Staff', id: 'MAIN_NATURESTAFF_AVALON' },
        { name: 'Blight Staff', id: 'MAIN_WILDSTAFF_HELL' },
        { name: 'Rampant Staff', id: 'MAIN_NATURESTAFF_HELL' }
    ],
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

// Loadout state
const loadout = {
    head: null,
    chest: null,
    feet: null,
    weapon: null,
    offhand: null
};

// Generate item ID with tier and enchantment
function generateItemId(baseItemId, tier, enchantment) {
    const itemIdWithoutTier = baseItemId.replace(/^T\d+_/, '');
    let itemId = `T${tier}_${itemIdWithoutTier}`;
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

// Populate item select dropdown based on category
function populateItemSelect(slot, category) {
    const itemSelect = document.getElementById(`${slot}Item`);
    const itemSelectGroup = document.querySelector(`[data-slot-group="${slot}"]`);
    
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

// Add item to loadout
function addToLoadout(slot) {
    const categorySelect = document.getElementById(`${slot}Category`);
    const itemSelect = document.getElementById(`${slot}Item`);
    const tierSelect = document.getElementById(`${slot}Tier`);
    
    const category = categorySelect.value;
    const itemId = itemSelect.value;
    const tier = tierSelect.value;
    
    if (!category || !itemId || !tier) {
        return;
    }
    
    // Get item name
    const items = ITEM_DATABASE[category];
    const item = items.find(i => i.id === itemId);
    
    if (!item) {
        return;
    }
    
    // Store in loadout
    loadout[slot] = {
        name: item.name,
        id: itemId,
        tier: tier,
        category: category
    };
    
    // Update UI
    const selectedDiv = document.getElementById(`${slot}Selected`);
    selectedDiv.style.display = 'block';
    selectedDiv.innerHTML = `
        <div style="background: #e8f5e9; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${item.name}</strong> - Tier ${tier}
            </div>
            <button class="btn-remove" onclick="removeFromLoadout('${slot}')" style="background: #c62828; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>
        </div>
    `;
}

// Remove item from loadout
function removeFromLoadout(slot) {
    loadout[slot] = null;
    const selectedDiv = document.getElementById(`${slot}Selected`);
    selectedDiv.style.display = 'none';
    selectedDiv.innerHTML = '';
}

// Find cheapest option for an item
function findCheapestOption(priceData, equivalents, baseItemId) {
    let cheapest = null;
    
    for (const [tier, enchantment] of equivalents) {
        const itemId = generateItemId(baseItemId, tier, enchantment);
        const itemPrices = priceData.filter(p => p.item_id === itemId);
        
        if (itemPrices.length === 0) continue;
        
        for (const priceInfo of itemPrices) {
            if (priceInfo.sell_price_min > 0) {
                if (!cheapest || priceInfo.sell_price_min < cheapest.price) {
                    cheapest = {
                        itemId,
                        tier,
                        enchantment,
                        displayTier: enchantment > 0 ? `${tier}.${enchantment}` : `${tier}.0`,
                        price: priceInfo.sell_price_min,
                        location: priceInfo.city,
                        lastUpdate: priceInfo.sell_price_min_date
                    };
                }
            }
        }
    }
    
    return cheapest;
}

// Main function to find loadout prices
async function findLoadoutPrices() {
    const location = document.getElementById('location').value;
    
    // Check if at least one item is in the loadout
    const hasItems = Object.values(loadout).some(item => item !== null);
    
    if (!hasItems) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        resultsSection.style.display = 'block';
        resultsContent.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> Please add at least one item to your loadout
            </div>
        `;
        return;
    }
    
    // Show loading state
    const resultsSection = document.getElementById('resultsSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContent = document.getElementById('resultsContent');
    const findButton = document.getElementById('findLoadoutPrices');
    
    resultsSection.style.display = 'block';
    loadingIndicator.style.display = 'block';
    resultsContent.innerHTML = '';
    findButton.disabled = true;
    
    try {
        const slotResults = [];
        let totalPrice = 0;
        
        // Process each slot
        for (const [slot, item] of Object.entries(loadout)) {
            if (!item) continue;
            
            const equivalents = TIER_EQUIVALENTS[item.tier];
            
            if (!equivalents) {
                throw new Error(`Invalid tier selection for ${slot}`);
            }
            
            // Generate all item IDs to check
            const itemIds = equivalents.map(([tier, enchantment]) => 
                generateItemId(item.id, tier, enchantment)
            );
            
            console.log(`Checking ${slot}:`, itemIds);
            
            // Fetch price data
            const priceData = await fetchPriceData(itemIds, location);
            
            // Find cheapest option
            const cheapest = findCheapestOption(priceData, equivalents, item.id);
            
            if (cheapest) {
                slotResults.push({
                    slot: slot.charAt(0).toUpperCase() + slot.slice(1),
                    name: item.name,
                    ...cheapest
                });
                totalPrice += cheapest.price;
            } else {
                slotResults.push({
                    slot: slot.charAt(0).toUpperCase() + slot.slice(1),
                    name: item.name,
                    error: 'No price data available'
                });
            }
        }
        
        // Display results
        displayLoadoutResults(slotResults, totalPrice);
        
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

// Display loadout results
function displayLoadoutResults(slotResults, totalPrice) {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '';
    
    // Total price card
    const totalCard = document.createElement('div');
    totalCard.className = 'result-card cheapest';
    totalCard.innerHTML = `
        <div class="result-header">
            <div class="result-title">Total Loadout Cost</div>
            <div class="result-price">${formatPrice(totalPrice)} 🪙</div>
        </div>
        <p style="margin-top: 10px; color: #555;">
            Cheapest options found for each slot
        </p>
    `;
    resultsContent.appendChild(totalCard);
    
    // Individual item cards
    slotResults.forEach(result => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        if (result.error) {
            card.innerHTML = `
                <div class="result-header">
                    <div class="result-title">${result.slot}: ${result.name}</div>
                </div>
                <div class="error-message" style="margin-top: 10px;">
                    ${result.error}
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="result-header">
                    <div class="result-title">${result.slot}: ${result.name}</div>
                    <div class="result-price">${formatPrice(result.price)} 🪙</div>
                </div>
                <div class="result-details">
                    <div class="detail-item">
                        <div class="detail-label">Best Tier:</div>
                        <div class="detail-value">${result.displayTier}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Item ID:</div>
                        <div class="detail-value">${result.itemId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Location:</div>
                        <div class="detail-value">${result.location}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Last Updated:</div>
                        <div class="detail-value">${formatDate(result.lastUpdate)}</div>
                    </div>
                </div>
            `;
        }
        
        resultsContent.appendChild(card);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const slots = ['head', 'chest', 'feet', 'weapon', 'offhand'];
    
    // Setup category change listeners
    slots.forEach(slot => {
        const categorySelect = document.getElementById(`${slot}Category`);
        categorySelect.addEventListener('change', (e) => {
            populateItemSelect(slot, e.target.value);
        });
    });
    
    // Setup add to loadout button listeners
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', () => {
            const slot = button.getAttribute('data-slot');
            addToLoadout(slot);
        });
    });
    
    // Find loadout prices button
    const findButton = document.getElementById('findLoadoutPrices');
    findButton.addEventListener('click', findLoadoutPrices);
});
