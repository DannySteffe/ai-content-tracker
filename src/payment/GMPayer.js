// GMPayer Integration - Simple Payment Processing
// Handles payment logic for AI content generation

class GMPayer {
    constructor() {
        this.transactions = new Map();
        this.balances = new Map();
        this.rates = {
            'text-generation': 0.05,    // $0.05 per request
            'image-generation': 0.25,   // $0.25 per image
            'audio-generation': 0.15,   // $0.15 per audio clip
            'video-generation': 1.00    // $1.00 per video
        };
    }

    // Initialize user balance (for demo purposes)
    initializeUserBalance(userId, amount = 10.00) {
        this.balances.set(userId, amount);
        console.log(`User ${userId} initialized with balance: $${amount}`);
    }

    // Process payment for AI content generation
    async processPayment(userId, serviceType, metadata = {}) {
        const transactionId = this.generateTransactionId();
        const rate = this.rates[serviceType];
        
        if (!rate) {
            throw new Error(`Unknown service type: ${serviceType}`);
        }

        const userBalance = this.balances.get(userId) || 0;
        
        if (userBalance < rate) {
            throw new Error(`Insufficient balance. Required: $${rate}, Available: $${userBalance}`);
        }

        // Deduct payment
        this.balances.set(userId, userBalance - rate);

        const transaction = {
            id: transactionId,
            userId: userId,
            serviceType: serviceType,
            amount: rate,
            status: 'completed',
            timestamp: new Date(),
            metadata: metadata
        };

        this.transactions.set(transactionId, transaction);
        
        console.log(`Payment processed: $${rate} for ${serviceType}`);
        console.log(`User ${userId} remaining balance: $${this.balances.get(userId)}`);
        
        return transaction;
    }

    // Get user balance
    getBalance(userId) {
        return this.balances.get(userId) || 0;
    }

    // Get transaction history
    getTransactionHistory(userId) {
        return Array.from(this.transactions.values())
            .filter(tx => tx.userId === userId)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    // Add funds to user account (for demo)
    addFunds(userId, amount) {
        const currentBalance = this.balances.get(userId) || 0;
        this.balances.set(userId, currentBalance + amount);
        console.log(`Added $${amount} to user ${userId}. New balance: $${this.balances.get(userId)}`);
    }

    // Generate transaction ID
    generateTransactionId() {
        return `gmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get service rates
    getServiceRates() {
        return { ...this.rates };
    }
}

module.exports = GMPayer;
