// Inventory Manager - Handles all filament inventory operations
class InventoryManager {
    constructor() {
        this.STORAGE_KEY = 'pokeprint_inventory';
        this.LOW_STOCK_THRESHOLD = 200; // grams
        this.inventory = this.loadInventory();
    }

    // Load inventory from localStorage or return default
    loadInventory() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse inventory:', e);
                return this.getDefaultInventory();
            }
        }
        return this.getDefaultInventory();
    }

    // Get default inventory structure
    getDefaultInventory() {
        return {
            colors: [
                { id: "001", name: "Lemon Yellow", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "002", name: "Charcoal Black", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "003", name: "Dark Brown", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "004", name: "Ivory White", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "005", name: "Sakura Pink", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "006", name: "Grass Green", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "007", name: "Lilac Purple", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "008", name: "Scarlet Red", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "009", name: "Desert Tan", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "010", name: "Ash Gray", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "011", name: "Bone White", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "012", name: "Sky Blue", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "013", name: "Marine Blue", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "014", name: "Nardo Gray", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "015", name: "Ice Blue", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "016", name: "Mandarin Orange", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "017", name: "Dark Red", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "018", name: "Caramel", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "019", name: "Dark Green", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "020", name: "Dark Blue", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "021", name: "Apple Green", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "022", name: "Latte Brown", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "023", name: "Dark Chocolate", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "024", name: "Terracotta", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] },
                { id: "025", name: "Plum", startingAmount: 1000, currentAmount: 1000, unit: "grams", costPerGram: 0.012, lastUpdated: new Date().toISOString().split('T')[0], purchaseHistory: [] }
            ],
            metadata: {
                lastSync: new Date().toISOString(),
                totalInventoryValue: 300,
                lowStockThreshold: 200
            }
        };
    }

    // Save inventory to localStorage
    saveInventory() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.inventory));
    }

    // Deduct filament for a completed print
    deductFilament(designName, designColors) {
        const deductions = [];
        const errors = [];

        // Check if we have enough inventory first
        for (const color of designColors) {
            const inv = this.getColorByName(color.color);
            if (!inv) {
                errors.push(`Color not found: ${color.color}`);
                continue;
            }
            if (inv.currentAmount < color.grams) {
                errors.push(`Insufficient ${color.color}: need ${color.grams}g, have ${inv.currentAmount}g`);
            }
        }

        if (errors.length > 0) {
            return { success: false, errors, deductions: [] };
        }

        // Perform deductions
        for (const color of designColors) {
            const inv = this.getColorByName(color.color);
            inv.currentAmount -= color.grams;
            inv.lastUpdated = new Date().toISOString().split('T')[0];
            inv.purchaseHistory.push({
                date: new Date().toISOString(),
                type: 'deduction',
                amount: color.grams,
                reason: `Printed: ${designName}`,
                remainingAmount: inv.currentAmount
            });
            deductions.push({ color: color.color, deducted: color.grams, remaining: inv.currentAmount });
        }

        this.saveInventory();
        return { success: true, errors: [], deductions };
    }

    // Add filament (restock)
    addFilament(colorName, grams, costPerGram = null, notes = '') {
        const color = this.getColorByName(colorName);
        if (!color) {
            return { success: false, error: `Color not found: ${colorName}` };
        }

        color.currentAmount += grams;
        color.lastUpdated = new Date().toISOString().split('T')[0];
        if (costPerGram) color.costPerGram = costPerGram;

        color.purchaseHistory.push({
            date: new Date().toISOString(),
            type: 'restock',
            amount: grams,
            cost: grams * color.costPerGram,
            costPerGram: color.costPerGram,
            reason: notes || 'Restocked',
            remainingAmount: color.currentAmount
        });

        this.saveInventory();
        return { success: true, color: colorName, added: grams, total: color.currentAmount };
    }

    // Get color by name
    getColorByName(name) {
        return this.inventory.colors.find(c => c.name.toLowerCase() === name.toLowerCase());
    }

    // Get all colors
    getAllColors() {
        return this.inventory.colors;
    }

    // Get low stock colors
    getLowStockColors() {
        return this.inventory.colors.filter(c => c.currentAmount < this.LOW_STOCK_THRESHOLD);
    }

    // Get inventory status
    getInventoryStatus() {
        const colors = this.inventory.colors;
        const total = colors.reduce((sum, c) => sum + c.currentAmount, 0);
        const value = colors.reduce((sum, c) => sum + (c.currentAmount * c.costPerGram), 0);
        const lowStock = colors.filter(c => c.currentAmount < this.LOW_STOCK_THRESHOLD);

        return {
            totalGrams: total,
            totalValue: value.toFixed(2),
            colorCount: colors.length,
            lowStockCount: lowStock.length,
            lowStockColors: lowStock,
            lastUpdated: this.inventory.metadata.lastSync
        };
    }

    // Update cost per gram
    updateCostPerGram(colorName, costPerGram) {
        const color = this.getColorByName(colorName);
        if (!color) {
            return { success: false, error: `Color not found: ${colorName}` };
        }
        color.costPerGram = costPerGram;
        this.saveInventory();
        return { success: true, color: colorName, costPerGram };
    }

    // Export inventory as CSV
    exportAsCSV() {
        let csv = 'Color,Starting (g),Current (g),Used (g),Cost/g,Total Value,Status\n';
        for (const color of this.inventory.colors) {
            const used = color.startingAmount - color.currentAmount;
            const value = (color.currentAmount * color.costPerGram).toFixed(2);
            const status = color.currentAmount < this.LOW_STOCK_THRESHOLD ? 'LOW' : 'OK';
            csv += `"${color.name}",${color.startingAmount},${color.currentAmount},${used},${color.costPerGram},${value},${status}\n`;
        }
        return csv;
    }
}

// Initialize global inventory manager
const inventoryManager = new InventoryManager();
