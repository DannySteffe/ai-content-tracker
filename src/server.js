const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const X402Orchestrator = require('./orchestrator/X402Orchestrator');
const GMPayer = require('./payment/GMPayer');
const ERC8004Tracker = require('./ownership/ERC8004Tracker');
const MockAIGenerator = require('./ai/MockAIGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize components
const orchestrator = new X402Orchestrator();
const gmPayer = new GMPayer();
const ownershipTracker = new ERC8004Tracker();
const aiGenerator = new MockAIGenerator();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize demo users
gmPayer.initializeUserBalance('user1', 25.00);
gmPayer.initializeUserBalance('user2', 15.00);

// Define AI Content Generation Workflow
orchestrator.registerWorkflow('ai-content-generation', [
    {
        name: 'validate-request',
        execute: async (payload) => {
            console.log('Validating request...');
            if (!payload.prompt || !payload.contentType || !payload.userId) {
                throw new Error('Missing required fields: prompt, contentType, userId');
            }
            return { valid: true };
        }
    },
    {
        name: 'process-payment',
        execute: async (payload) => {
            console.log('Processing payment...');
            const transaction = await gmPayer.processPayment(
                payload.userId,
                payload.contentType,
                { prompt: payload.prompt, model: payload.model }
            );
            return { transaction };
        }
    },
    {
        name: 'generate-content',
        execute: async (payload, previousResults) => {
            console.log('Generating AI content...');
            const content = await aiGenerator.generateContent(
                payload.contentType,
                payload.prompt,
                payload.model
            );
            return { content };
        }
    },
    {
        name: 'register-ownership',
        execute: async (payload, previousResults) => {
            console.log('Registering content ownership...');
            const contentRecord = ownershipTracker.registerContent(
                previousResults['generate-content'].content.contentId,
                payload.userId,
                payload.contentType,
                previousResults['generate-content'].content.model,
                payload.prompt,
                previousResults['process-payment'].transaction.id
            );
            return { contentRecord };
        }
    }
]);

// API Routes

// Generate AI content
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, contentType, userId, model } = req.body;
        
        const job = await orchestrator.executeWorkflow('ai-content-generation', {
            prompt,
            contentType,
            userId,
            model
        });

        res.json({
            success: true,
            jobId: job.id,
            results: job.results,
            content: job.results['generate-content'].content,
            ownership: job.results['register-ownership'].contentRecord,
            payment: job.results['process-payment'].transaction
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get user dashboard
app.get('/api/dashboard/:userId', (req, res) => {
    const userId = req.params.userId;
    
    try {
        const balance = gmPayer.getBalance(userId);
        const ownedContent = ownershipTracker.getOwnedContent(userId);
        const transactionHistory = gmPayer.getTransactionHistory(userId);
        
        res.json({
            userId,
            balance,
            ownedContent,
            transactionHistory,
            stats: {
                totalContent: ownedContent.length,
                totalSpent: transactionHistory.reduce((sum, tx) => sum + tx.amount, 0)
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get content details
app.get('/api/content/:contentId', (req, res) => {
    try {
        const contentDetails = ownershipTracker.getContentDetails(req.params.contentId);
        res.json(contentDetails);
    } catch (error) {
        res.status(404).json({
            success: false,
            error: 'Content not found'
        });
    }
});

// Get ownership proof
app.get('/api/proof/:contentId/:owner', (req, res) => {
    try {
        const proof = ownershipTracker.generateOwnershipProof(
            req.params.contentId,
            req.params.owner
        );
        
        if (!proof) {
            return res.status(404).json({
                success: false,
                error: 'Ownership proof not available'
            });
        }
        
        res.json({
            success: true,
            proof
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Add funds (for demo)
app.post('/api/add-funds', (req, res) => {
    try {
        const { userId, amount } = req.body;
        gmPayer.addFunds(userId, amount);
        
        res.json({
            success: true,
            newBalance: gmPayer.getBalance(userId)
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get service rates
app.get('/api/rates', (req, res) => {
    res.json({
        rates: gmPayer.getServiceRates(),
        models: aiGenerator.getAvailableModels()
    });
});

// Get platform stats
app.get('/api/stats', (req, res) => {
    res.json({
        platform: ownershipTracker.getStats(),
        workflows: orchestrator.listWorkflows()
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Content Payment & Ownership Tracker running on http://localhost:${PORT}`);
    console.log('📊 Components initialized:');
    console.log('   - X402 Orchestrator: ✓');
    console.log('   - GMPayer: ✓');
    console.log('   - ERC-8004 Tracker: ✓');
    console.log('   - Mock AI Generator: ✓');
    console.log('\n💡 Demo users initialized:');
    console.log('   - user1: $25.00');
    console.log('   - user2: $15.00');
});

module.exports = app;
