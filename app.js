// Albion Gear Price Finder - Main Application Logic

// API Configuration
const API_BASE_URL = 'https://europe.albion-online-data.com/api/v2/stats/prices';
const FALLBACK_API_URL = 'https://europe.albion-online-data.com/api/v2/stats/prices';

// Local Storage Keys
const STORAGE_KEYS = {
    ITEM_CATEGORY: 'albion_gear_finder_item_category',
    ITEM_SELECT: 'albion_gear_finder_item_select',
    DESIRED_TIER: 'albion_gear_finder_desired_tier',
    LOCATION: 'albion_gear_finder_location',
    PRICE_THRESHOLD: 'albion_gear_finder_price_threshold'
};

// Item database organized by category
const ITEM_DATABASE = {
    // Helmets
    helmet: [
        // Plate
        { name: 'Soldier Helmet', id: 'HEAD_PLATE_SET1' },
        { name: 'Knight Helmet', id: 'HEAD_PLATE_SET2' },
        { name: 'Guardian Helmet', id: 'HEAD_PLATE_SET3' },
        { name: 'Graveguard Helmet', id: 'HEAD_PLATE_UNDEAD' },
        { name: 'Judicator Helmet', id: 'HEAD_PLATE_KEEPER' },
        { name: 'Demon Helmet', id: 'HEAD_PLATE_HELL' },
        { name: 'Duskweaver Helmet', id: 'HEAD_PLATE_FEY' },
        { name: 'Helmet of Valor', id: 'HEAD_PLATE_AVALON' },
        // Leather
        { name: 'Mercenary Hood', id: 'HEAD_LEATHER_SET1' },
        { name: 'Hunter Hood', id: 'HEAD_LEATHER_SET2' },
        { name: 'Assassin Hood', id: 'HEAD_LEATHER_SET3' },
        { name: 'Specter Hood', id: 'HEAD_LEATHER_UNDEAD' },
        { name: 'Stalker Hood', id: 'HEAD_LEATHER_MORGANA' },
        { name: 'Hellion Hood', id: 'HEAD_LEATHER_HELL' },
        { name: 'Mistwalker Hood', id: 'HEAD_LEATHER_FEY' },
        { name: 'Hood of Tenacity', id: 'HEAD_LEATHER_AVALON' },
        // Cloth
        { name: 'Scholar Cowl', id: 'HEAD_CLOTH_SET1' },
        { name: 'Cleric Cowl', id: 'HEAD_CLOTH_SET2' },
        { name: 'Mage Cowl', id: 'HEAD_CLOTH_SET3' },
        { name: 'Cultist Cowl', id: 'HEAD_CLOTH_MORGANA' },
        { name: 'Druid Cowl', id: 'HEAD_CLOTH_KEEPER' },
        { name: 'Fiend Cowl', id: 'HEAD_CLOTH_HELL' },
        { name: 'Feyscale Hat', id: 'HEAD_CLOTH_FEY' },
        { name: 'Cowl of Purity', id: 'HEAD_CLOTH_AVALON' }
    ],
    // Armor
    armor: [
        // Plate
        { name: 'Soldier Armor', id: 'ARMOR_PLATE_SET1' },
        { name: 'Knight Armor', id: 'ARMOR_PLATE_SET2' },
        { name: 'Guardian Armor', id: 'ARMOR_PLATE_SET3' },
        { name: 'Graveguard Armor', id: 'ARMOR_PLATE_UNDEAD' },
        { name: 'Judicator Armor', id: 'ARMOR_PLATE_KEEPER' },
        { name: 'Demon Armor', id: 'ARMOR_PLATE_HELL' },
        { name: 'Duskweaver Armor', id: 'ARMOR_PLATE_FEY' },
        { name: 'Armor of Valor', id: 'ARMOR_PLATE_AVALON' },
        // Leather
        { name: 'Mercenary Jacket', id: 'ARMOR_LEATHER_SET1' },
        { name: 'Hunter Jacket', id: 'ARMOR_LEATHER_SET2' },
        { name: 'Assassin Jacket', id: 'ARMOR_LEATHER_SET3' },
        { name: 'Specter Jacket', id: 'ARMOR_LEATHER_UNDEAD' },
        { name: 'Stalker Jacket', id: 'ARMOR_LEATHER_MORGANA' },
        { name: 'Hellion Jacket', id: 'ARMOR_LEATHER_HELL' },
        { name: 'Mistwalker Jacket', id: 'ARMOR_LEATHER_FEY' },
        { name: 'Jacket of Tenacity', id: 'ARMOR_LEATHER_AVALON' },
        // Cloth
        { name: 'Scholar Robe', id: 'ARMOR_CLOTH_SET1' },
        { name: 'Cleric Robe', id: 'ARMOR_CLOTH_SET2' },
        { name: 'Mage Robe', id: 'ARMOR_CLOTH_SET3' },
        { name: 'Cultist Robe', id: 'ARMOR_CLOTH_MORGANA' },
        { name: 'Druid Robe', id: 'ARMOR_CLOTH_KEEPER' },
        { name: 'Fiend Robe', id: 'ARMOR_CLOTH_HELL' },
        { name: 'Feyscale Robe', id: 'ARMOR_CLOTH_FEY' },
        { name: 'Robe of Purity', id: 'ARMOR_CLOTH_AVALON' }
    ],
    // Boots
    boots: [
        // Plate
        { name: 'Soldier Boots', id: 'SHOES_PLATE_SET1' },
        { name: 'Knight Boots', id: 'SHOES_PLATE_SET2' },
        { name: 'Guardian Boots', id: 'SHOES_PLATE_SET3' },
        { name: 'Graveguard Boots', id: 'SHOES_PLATE_UNDEAD' },
        { name: 'Judicator Boots', id: 'SHOES_PLATE_KEEPER' },
        { name: 'Demon Boots', id: 'SHOES_PLATE_HELL' },
        { name: 'Duskweaver Boots', id: 'SHOES_PLATE_FEY' },
        { name: 'Boots of Valor', id: 'SHOES_PLATE_AVALON' },
        // Leather
        { name: 'Mercenary Shoes', id: 'SHOES_LEATHER_SET1' },
        { name: 'Hunter Shoes', id: 'SHOES_LEATHER_SET2' },
        { name: 'Assassin Shoes', id: 'SHOES_LEATHER_SET3' },
        { name: 'Specter Shoes', id: 'SHOES_LEATHER_UNDEAD' },
        { name: 'Stalker Shoes', id: 'SHOES_LEATHER_MORGANA' },
        { name: 'Hellion Shoes', id: 'SHOES_LEATHER_HELL' },
        { name: 'Mistwalker Shoes', id: 'SHOES_LEATHER_FEY' },
        { name: 'Shoes of Tenacity', id: 'SHOES_LEATHER_AVALON' },
        // Cloth
        { name: 'Scholar Sandals', id: 'SHOES_CLOTH_SET1' },
        { name: 'Cleric Sandals', id: 'SHOES_CLOTH_SET2' },
        { name: 'Mage Sandals', id: 'SHOES_CLOTH_SET3' },
        { name: 'Cultist Sandals', id: 'SHOES_CLOTH_MORGANA' },
        { name: 'Druid Sandals', id: 'SHOES_CLOTH_KEEPER' },
        { name: 'Fiend Sandals', id: 'SHOES_CLOTH_HELL' },
        { name: 'Feyscale Sandals', id: 'SHOES_CLOTH_FEY' },
        { name: 'Sandals of Purity', id: 'SHOES_CLOTH_AVALON' }
    ],
    // Swords
    'weapon-sword': [
        { name: 'Broadsword', id: 'MAIN_SWORD' },
        { name: 'Claymore', id: '2H_CLAYMORE' },
        { name: 'Dual Swords', id: '2H_DUALSWORD' },
        { name: 'Clarent Blade', id: 'MAIN_SCIMITAR_MORGANA' },
        { name: 'Carving Sword', id: '2H_CLEAVER_HELL' },
        { name: 'Galatine Pair', id: '2H_DUALSCIMITAR_UNDEAD' },
        { name: 'Kingmaker', id: '2H_CLAYMORE_AVALON' }
    ],
    // Axes
    'weapon-axe': [
        { name: 'Battleaxe', id: 'MAIN_AXE' },
        { name: 'Greataxe', id: '2H_AXE' },
        { name: 'Halberd', id: '2H_HALBERD' },
        { name: 'Carrioncaller', id: '2H_HALBERD_MORGANA' },
        { name: 'Infernal Scythe', id: '2H_SCYTHE_HELL' },
        { name: 'Bear Paws', id: '2H_DUALAXE_KEEPER' },
        { name: 'Realmbreaker', id: '2H_AXE_AVALON' }
    ],
    // Maces
    'weapon-mace': [
        { name: 'Mace', id: 'MAIN_MACE' },
        { name: 'Heavy Mace', id: '2H_MACE' },
        { name: 'Morning Star', id: '2H_FLAIL' },
        { name: 'Bedrock Mace', id: 'MAIN_ROCKMACE_KEEPER' },
        { name: 'Incubus Mace', id: 'MAIN_MACE_HELL' },
        { name: 'Camlann Mace', id: '2H_MACE_MORGANA' },
        { name: 'Oathkeepers', id: '2H_DUALMACE_AVALON' }
    ],
    // Hammers
    'weapon-hammer': [
        { name: 'Hammer', id: 'MAIN_HAMMER' },
        { name: 'Polehammer', id: '2H_POLEHAMMER' },
        { name: 'Great Hammer', id: '2H_HAMMER' },
        { name: 'Tombhammer', id: '2H_HAMMER_UNDEAD' },
        { name: 'Forge Hammers', id: '2H_DUALHAMMER_HELL' },
        { name: 'Grovekeeper', id: '2H_RAM_KEEPER' },
        { name: 'Hand of Justice', id: '2H_HAMMER_AVALON' }
    ],
    // Crossbows
    'weapon-crossbow': [
        { name: 'Light Crossbow', id: 'MAIN_1HCROSSBOW' },
        { name: 'Crossbow', id: '2H_CROSSBOW' },
        { name: 'Heavy Crossbow', id: '2H_CROSSBOWLARGE' },
        { name: 'Weeping Repeater', id: '2H_REPEATINGCROSSBOW_UNDEAD' },
        { name: 'Siegebow', id: '2H_CROSSBOWLARGE_MORGANA' },
        { name: 'Boltcasters', id: '2H_DUALCROSSBOW_HELL' },
        { name: 'Energy Shaper', id: '2H_CROSSBOW_CANNON_AVALON' }
    ],
    // Bows
    'weapon-bow': [
        { name: 'Bow', id: '2H_BOW' },
        { name: 'Warbow', id: '2H_WARBOW' },
        { name: 'Longbow', id: '2H_LONGBOW' },
        { name: 'Whispering Bow', id: '2H_LONGBOW_UNDEAD' },
        { name: 'Wailing Bow', id: '2H_BOW_HELL' },
        { name: 'Bow of Badon', id: '2H_BOW_KEEPER' },
        { name: 'Mistpiercer', id: '2H_BOW_AVALON' }
    ],
    // Spears
    'weapon-spear': [
        { name: 'Spear', id: 'MAIN_SPEAR' },
        { name: 'Pike', id: '2H_SPEAR' },
        { name: 'Glaive', id: '2H_GLAIVE' },
        { name: 'Heron Spear', id: 'MAIN_SPEAR_KEEPER' },
        { name: 'Trinity Spear', id: '2H_TRIDENT_UNDEAD' },
        { name: 'Spirithunter', id: '2H_HARPOON_HELL' },
        { name: 'Daybreaker', id: 'MAIN_SPEAR_LANCE_AVALON' }
    ],
    // Quarterstaffs
    'weapon-quarterstaff': [
        { name: 'Quarterstaff', id: '2H_QUARTERSTAFF' },
        { name: 'Iron-clad Staff', id: '2H_IRONCLADEDSTAFF' },
        { name: 'Double Bladed Staff', id: '2H_DOUBLEBLADEDSTAFF' },
        { name: 'Black Monk Stave', id: '2H_COMBATSTAFF_MORGANA' },
        { name: 'Staff of Balance', id: '2H_ROCKSTAFF_KEEPER' },
        { name: 'Soulscythe', id: '2H_TWINSCYTHE_HELL' },
        { name: 'Grailseeker', id: '2H_QUARTERSTAFF_AVALON' }
    ],
    // Daggers
    'weapon-dagger': [
        { name: 'Dagger', id: 'MAIN_DAGGER' },
        { name: 'Dagger Pair', id: '2H_DAGGERPAIR' },
        { name: 'Claws', id: '2H_CLAWPAIR' },
        { name: 'Demonfang', id: 'MAIN_DAGGER_HELL' },
        { name: 'Bloodletter', id: 'MAIN_RAPIER_MORGANA' },
        { name: 'Deathgivers', id: '2H_DUALSICKLE_UNDEAD' },
        { name: 'Black Hands', id: '2H_IRONGAUNTLETS_HELL' },
        { name: 'Bridled Fury', id: '2H_DAGGER_KATAR_AVALON' }
    ],
    // Knuckles
    'weapon-knuckles': [
        { name: 'Brawler Gloves', id: '2H_KNUCKLES_SET1' },
        { name: 'Battle Bracers', id: '2H_KNUCKLES_SET2' },
        { name: 'Spiked Gauntlets', id: '2H_KNUCKLES_SET3' },
        { name: 'Ursine Maulers', id: '2H_KNUCKLES_KEEPER' },
        { name: 'Ravenstrike Cestus', id: '2H_KNUCKLES_MORGANA' },
        { name: 'Hellfire Hands', id: '2H_KNUCKLES_HELL' },
        { name: 'Fists of Avalon', id: '2H_KNUCKLES_AVALON' }
    ],
    // Fire Staffs
    'weapon-firestaff': [
        { name: 'Fire Staff', id: 'MAIN_FIRESTAFF' },
        { name: 'Great Fire Staff', id: '2H_FIRESTAFF' },
        { name: 'Infernal Staff', id: '2H_INFERNOSTAFF' },
        { name: 'Wildfire Staff', id: 'MAIN_FIRESTAFF_KEEPER' },
        { name: 'Blazing Staff', id: '2H_INFERNOSTAFF_MORGANA' },
        { name: 'Brimstone Staff', id: '2H_FIRESTAFF_HELL' },
        { name: 'Dawnsong', id: '2H_FIRE_RINGPAIR_AVALON' }
    ],
    // Frost Staffs
    'weapon-froststaff': [
        { name: 'Frost Staff', id: 'MAIN_FROSTSTAFF' },
        { name: 'Great Frost Staff', id: '2H_FROSTSTAFF' },
        { name: 'Glacial Staff', id: '2H_GLACIALSTAFF' },
        { name: 'Hoarfrost Staff', id: 'MAIN_FROSTSTAFF_KEEPER' },
        { name: 'Chillhowl', id: 'MAIN_FROSTSTAFF_AVALON' },
        { name: 'Icicle Staff', id: '2H_ICEGAUNTLETS_HELL' },
        { name: 'Permafrost Prism', id: '2H_ICECRYSTAL_UNDEAD' }
    ],
    // Arcane Staffs
    'weapon-arcanestaff': [
        { name: 'Arcane Staff', id: 'MAIN_ARCANESTAFF' },
        { name: 'Great Arcane Staff', id: '2H_ARCANESTAFF' },
        { name: 'Enigmatic Staff', id: '2H_ENIGMATICSTAFF' },
        { name: 'Witchwork Staff', id: 'MAIN_ARCANESTAFF_UNDEAD' },
        { name: 'Occult Staff', id: '2H_ARCANESTAFF_HELL' },
        { name: 'Malevolent Locus', id: '2H_ENIGMATICORB_MORGANA' },
        { name: 'Evensong', id: '2H_ARCANE_RINGPAIR_AVALON' }
    ],
    // Holy Staffs
    'weapon-holystaff': [
        { name: 'Holy Staff', id: 'MAIN_HOLYSTAFF' },
        { name: 'Great Holy Staff', id: '2H_HOLYSTAFF' },
        { name: 'Divine Staff', id: '2H_DIVINESTAFF' },
        { name: 'Lifetouch Staff', id: 'MAIN_HOLYSTAFF_MORGANA' },
        { name: 'Redemption Staff', id: '2H_HOLYSTAFF_UNDEAD' },
        { name: 'Fallen Staff', id: '2H_HOLYSTAFF_HELL' },
        { name: 'Hallowfall', id: 'MAIN_HOLYSTAFF_AVALON' }
    ],
    // Nature Staffs
    'weapon-naturestaff': [
        { name: 'Nature Staff', id: 'MAIN_NATURESTAFF' },
        { name: 'Great Nature Staff', id: '2H_NATURESTAFF' },
        { name: 'Wild Staff', id: '2H_WILDSTAFF' },
        { name: 'Druidic Staff', id: 'MAIN_NATURESTAFF_KEEPER' },
        { name: 'Ironroot Staff', id: 'MAIN_NATURESTAFF_AVALON' },
        { name: 'Blight Staff', id: '2H_NATURESTAFF_HELL' },
        { name: 'Rampant Staff', id: '2H_NATURESTAFF_KEEPER' }
    ],
    // Cursed Staffs
    'weapon-cursedstaff': [
        { name: 'Cursed Staff', id: 'MAIN_CURSEDSTAFF' },
        { name: 'Great Cursed Staff', id: '2H_CURSEDSTAFF' },
        { name: 'Demonic Staff', id: '2H_DEMONICSTAFF' },
        { name: 'Lifecurse Staff', id: 'MAIN_CURSEDSTAFF_UNDEAD' },
        { name: 'Cursed Skull', id: '2H_SKULLORB_HELL' },
        { name: 'Damnation Staff', id: '2H_CURSEDSTAFF_MORGANA' },
        { name: 'Shadowcaller', id: 'MAIN_CURSEDSTAFF_AVALON' }
    ],
    // Off-hand
    offhand: [
        // Shields
        { name: 'Shield', id: 'OFF_SHIELD' },
        { name: 'Sarcophagus', id: 'OFF_TOWERSHIELD_UNDEAD' },
        { name: 'Facebreaker', id: 'OFF_SPIKEDSHIELD_MORGANA' },
        { name: 'Caitiff Shield', id: 'OFF_SHIELD_HELL' },
        { name: 'Astral Aegis', id: 'OFF_SHIELD_AVALON' },
        // Books / Orbs
        { name: 'Tome of Spells', id: 'OFF_BOOK' },
        { name: 'Eye of Secrets', id: 'OFF_ORB_MORGANA' },
        { name: 'Muisak', id: 'OFF_DEMONSKULL_HELL' },
        // Totems / Horns
        { name: 'Taproot', id: 'OFF_TOTEM_KEEPER' },
        { name: 'Mistcaller', id: 'OFF_HORN_KEEPER' },
        // Torches / Scepters
        { name: 'Torch', id: 'OFF_TORCH' },
        { name: 'Sacred Scepter', id: 'OFF_TALISMAN_AVALON' },
        { name: 'Leering Cane', id: 'OFF_JESTERCANE_HELL' },
        { name: 'Cryptcandle', id: 'OFF_LAMP_UNDEAD' },
        { name: 'Celestial Censer', id: 'OFF_CENSER_AVALON' }
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

// Return an ordered list of effective tier keys that represent strictly higher power
// levels than the desired tier, with duplicates (same equivalents array) removed.
function getUniqueHigherTiers(desiredTier) {
    const desiredValue = parseFloat(desiredTier);
    const seen = new Set();
    // Exclude the power level of the desired tier itself
    seen.add(JSON.stringify(TIER_EQUIVALENTS[desiredTier]));

    const keys = Object.keys(TIER_EQUIVALENTS)
        .filter(k => parseFloat(k) > desiredValue)
        .sort((a, b) => parseFloat(a) - parseFloat(b));

    const uniqueHigherTiers = [];
    for (const key of keys) {
        const equivKey = JSON.stringify(TIER_EQUIVALENTS[key]);
        if (!seen.has(equivKey)) {
            seen.add(equivKey);
            uniqueHigherTiers.push(key);
        }
    }

    return uniqueHigherTiers;
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

// Escape HTML special characters to prevent XSS when inserting API values into innerHTML
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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
function displayResults(priceData, equivalents, baseItemId, desiredTier, higherTiers, threshold) {
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
                <div class="result-title">Tier ${escapeHtml(result.displayTier)}</div>
                <div class="result-price">${formatPrice(result.price)} 🪙</div>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <div class="detail-label">Item ID:</div>
                    <div class="detail-value">${escapeHtml(result.itemId)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location:</div>
                    <div class="detail-value">${escapeHtml(result.location)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Buy Price:</div>
                    <div class="detail-value">${result.buyPriceMax > 0 ? formatPrice(result.buyPriceMax) : 'N/A'} 🪙</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Last Updated:</div>
                    <div class="detail-value">${escapeHtml(formatDate(result.lastUpdate))}</div>
                </div>
            </div>
        `;
        
        resultsContent.appendChild(card);
    });
    
    // Show savings information
    if (itemResults.length > 1) {
        // Parse the desired tier to find which item matches the user's selection
        // desiredTier format is like "7.0", "6.2", etc.
        const [selectedBaseTier, selectedEnchantment] = desiredTier.split('.').map(Number);
        
        // Find the item that matches the user's selected tier
        const selectedItem = itemResults.find(item => 
            item.tier === selectedBaseTier && item.enchantment === selectedEnchantment
        );
        
        // If we found the selected item and it's not the cheapest, show savings
        if (selectedItem && selectedItem !== itemResults[0]) {
            const savings = selectedItem.price - itemResults[0].price;
            const savingsPercent = ((savings / selectedItem.price) * 100).toFixed(1);
            
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
                    By choosing the cheapest equivalent tier instead of the selected option.
                </p>
            `;
            
            resultsContent.appendChild(savingsInfo);
        }
    }

    // Higher-tier options section
    if (higherTiers && higherTiers.length > 0 && itemResults.length > 0 && threshold > 0) {
        const cheapestSameTier = itemResults[0].price;
        const maxPrice = cheapestSameTier * (1 + threshold / 100);
        const higherTierResults = [];

        for (const tierKey of higherTiers) {
            let lowestPrice = Infinity;
            let bestItem = null;

            for (const [tier, enchantment] of TIER_EQUIVALENTS[tierKey]) {
                const itemId = generateItemId(baseItemId, tier, enchantment);
                const itemPrices = priceData.filter(p => p.item_id === itemId);

                for (const priceInfo of itemPrices) {
                    if (priceInfo.sell_price_min > 0 && priceInfo.sell_price_min < lowestPrice) {
                        lowestPrice = priceInfo.sell_price_min;
                        bestItem = {
                            itemId,
                            tier,
                            enchantment,
                            displayTier: enchantment > 0 ? `${tier}.${enchantment}` : `${tier}.0`,
                            effectiveTier: tierKey,
                            price: lowestPrice,
                            location: priceInfo.city,
                            lastUpdate: priceInfo.sell_price_min_date
                        };
                    }
                }
            }

            if (bestItem && bestItem.price <= maxPrice) {
                higherTierResults.push(bestItem);
            }
        }

        if (higherTierResults.length > 0) {
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'higher-tier-section';
            sectionHeader.innerHTML = `
                <h3 class="higher-tier-header">⬆️ Higher Tier Options Within ${escapeHtml(String(threshold))}%</h3>
                <p class="higher-tier-subtext">These items are more powerful than your selected tier and are priced within ${escapeHtml(String(threshold))}% of the cheapest same-tier option (${formatPrice(cheapestSameTier)} 🪙).</p>
            `;
            resultsContent.appendChild(sectionHeader);

            for (const result of higherTierResults) {
                const premiumPercent = ((result.price - cheapestSameTier) / cheapestSameTier * 100).toFixed(1);
                const premiumLabel = result.price <= cheapestSameTier
                    ? `${Math.abs(premiumPercent)}% cheaper`
                    : `+${premiumPercent}% vs cheapest`;
                const card = document.createElement('div');
                card.className = 'result-card higher-tier';

                card.innerHTML = `
                    <div class="result-header">
                        <div class="result-title">Tier ${escapeHtml(result.effectiveTier)} <span class="tier-badge">${escapeHtml(premiumLabel)}</span></div>
                        <div class="result-price">${formatPrice(result.price)} 🪙</div>
                    </div>
                    <div class="result-details">
                        <div class="detail-item">
                            <div class="detail-label">Item ID:</div>
                            <div class="detail-value">${escapeHtml(result.itemId)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Location:</div>
                            <div class="detail-value">${escapeHtml(result.location)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Last Updated:</div>
                            <div class="detail-value">${escapeHtml(formatDate(result.lastUpdate))}</div>
                        </div>
                    </div>
                `;

                resultsContent.appendChild(card);
            }
        }
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

// Update URL with current selections
function updateURLWithSelections() {
    const itemCategory = document.getElementById('itemCategory').value;
    const itemSelect = document.getElementById('itemSelect').value;
    const desiredTier = document.getElementById('desiredTier').value;
    const location = document.getElementById('location').value;
    
    const params = new URLSearchParams();
    if (itemCategory) params.set('category', itemCategory);
    if (itemSelect) params.set('item', itemSelect);
    if (desiredTier) params.set('tier', desiredTier);
    if (location) params.set('location', location);
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newURL);
}

// Load selections from URL parameters
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category'),
        item: params.get('item'),
        tier: params.get('tier'),
        location: params.get('location')
    };
}

// Main function to find prices
async function findPrices() {
    const itemName = document.getElementById('itemSelect').value;
    const desiredTier = document.getElementById('desiredTier').value;
    const location = document.getElementById('location').value;
    const threshold = Math.min(Math.max(parseFloat(document.getElementById('priceThreshold').value) || 0, 0), 100);
    
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
    
    // Update URL with current selections for sharing
    updateURLWithSelections();
    
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
        
        // Generate all item IDs to check for the desired tier
        const itemIds = equivalents.map(([tier, enchantment]) => 
            generateItemId(itemName, tier, enchantment)
        );

        // Collect item IDs for higher tiers so they can be fetched in one request
        const higherTiers = getUniqueHigherTiers(desiredTier);
        const higherTierIdSet = new Set();
        for (const tierKey of higherTiers) {
            for (const [tier, enchantment] of TIER_EQUIVALENTS[tierKey]) {
                higherTierIdSet.add(generateItemId(itemName, tier, enchantment));
            }
        }
        const allItemIds = [...new Set([...itemIds, ...higherTierIdSet])];
        
        console.log('Checking items:', allItemIds);
        
        // Fetch price data for all items in a single request
        const priceData = await fetchPriceData(allItemIds, location);
        
        // Display results
        displayResults(priceData, equivalents, itemName, desiredTier, higherTiers, threshold);
        
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

// Restore saved selections from URL (priority) or local storage
function restoreSavedSelections() {
    // Set flag to prevent saving during restoration
    isRestoring = true;
    
    const itemCategory = document.getElementById('itemCategory');
    const itemSelect = document.getElementById('itemSelect');
    const desiredTier = document.getElementById('desiredTier');
    const location = document.getElementById('location');
    
    // Check URL parameters first (for sharing), fallback to localStorage
    const urlParams = loadFromURL();
    
    // Restore location (URL takes priority)
    const locationValue = urlParams.location || loadFromLocalStorage(STORAGE_KEYS.LOCATION);
    if (locationValue && location) {
        location.value = locationValue;
    }
    
    // Restore price threshold
    const thresholdValue = loadFromLocalStorage(STORAGE_KEYS.PRICE_THRESHOLD);
    const priceThreshold = document.getElementById('priceThreshold');
    if (thresholdValue !== null && priceThreshold) {
        priceThreshold.value = thresholdValue;
    }
    
    // Restore desired tier (URL takes priority)
    const tierValue = urlParams.tier || loadFromLocalStorage(STORAGE_KEYS.DESIRED_TIER);
    if (tierValue && desiredTier) {
        desiredTier.value = tierValue;
    }
    
    // Restore category first (URL takes priority, this will populate the item select)
    const categoryValue = urlParams.category || loadFromLocalStorage(STORAGE_KEYS.ITEM_CATEGORY);
    if (categoryValue && itemCategory) {
        itemCategory.value = categoryValue;
        populateItemSelect(categoryValue);
        
        // After populating items, restore the selected item (URL takes priority)
        const itemValue = urlParams.item || loadFromLocalStorage(STORAGE_KEYS.ITEM_SELECT);
        if (itemValue && itemSelect) {
            // Validate that the saved item exists in the options
            const optionExists = itemSelect.querySelector(`option[value='${itemValue}']`) !== null;
            if (optionExists) {
                itemSelect.value = itemValue;
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
    const priceThreshold = document.getElementById('priceThreshold');
    
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

    // Handle price threshold input
    priceThreshold.addEventListener('change', (e) => {
        saveToLocalStorage(STORAGE_KEYS.PRICE_THRESHOLD, e.target.value);
    });
    
    // Handle find prices button
    findButton.addEventListener('click', findPrices);
    
    // Restore saved selections after event listeners are set up
    restoreSavedSelections();
});
