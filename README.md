# Albion Gear Price Finder

A web-based tool that helps you find the cheapest way to achieve a certain tier of gear in Albion Online.

## Overview

In Albion Online, gear has an effective tier based on both its base tier (4-8) and enchantment level (0-4). Different combinations can result in the same effective power level. For example:
- Tier 4.2 (Tier 4 with enchantment 2) = Tier 5.1 = Tier 6.0

This tool uses market data from the [Albion Online Data Project](https://www.albion-online-data.com/) to help you find which equivalent option is cheapest.

## Features

- **Human-Readable Item Selector**: Browse items by category with friendly names instead of complex item IDs
- **Comprehensive Item Database**: Includes helmets, armor, boots, weapons (melee/ranged/magic), and off-hand items
- **Tier Equivalency Calculator**: Automatically finds all equivalent gear tiers
- **Real-time Market Data**: Fetches current prices from Albion Online Data Project API
- **Multi-Location Support**: Compare prices across different cities
- **Price Comparison**: See which equivalent tier offers the best value
- **Savings Calculator**: Shows how much you can save by choosing the cheapest option

## How to Use

### Option 1: Open Directly in Browser

Simply open `index.html` in your web browser. The tool works entirely client-side with no build step required.

### Option 2: Using a Local Server

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The application will open automatically in your browser at `http://localhost:8080`.

## Usage Instructions

1. **Select Item Category**: Choose from organized weapon trees and armor categories:
   - Armor: Helmets, Armor, Boots
   - Melee Weapons: Swords, Axes, Maces, Hammers, Spears, Quarterstaffs, Daggers
   - Ranged Weapons: Bows, Crossbows
   - Magic Weapons: Fire Staffs, Frost Staffs, Arcane Staffs, Holy Staffs, Nature Staffs, Cursed Staffs
   - Off-hand Items

2. **Select Item**: Pick the specific item you want to find prices for, including artifact weapons (e.g., Leather Hood, Broadsword, Clarent Blade, Fire Staff, Blazing Staff)

3. **Select Desired Tier**: Choose the effective tier you want to achieve (e.g., 4.2, 5.1, 6.0)

4. **Choose Location**: Select a specific city or "All Locations" to compare across all markets

5. **Find Prices**: Click the button to fetch current market data and see results

## Understanding Tier Equivalency

The effective tier formula is: `Base Tier + (Enchantment × 0.1)`

Examples:
- 4.2 = 5.1 = 6.0 (all have the same power level)
- 4.3 = 5.2 = 6.1 = 7.0
- 5.3 = 6.2 = 7.1 = 8.0

## API Reference

This tool uses the [Albion Online Data Project API](https://www.albion-online-data.com/):
- Base URL: `https://west.albion-online-data.com/api/v2/stats/prices`
- Fallback: `https://east.albion-online-data.com/api/v2/stats/prices`

## Technology Stack

- **Frontend**: Pure HTML, CSS, and JavaScript (no framework required)
- **API**: Albion Online Data Project REST API
- **Styling**: Modern CSS with gradient backgrounds and responsive design

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License
