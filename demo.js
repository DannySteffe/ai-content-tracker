// Demo Script - Test the AI Content Payment & Ownership System
// This script demonstrates the integration of X402, GMPayer, and ERC-8004

const X402Orchestrator = require('./src/orchestrator/X402Orchestrator');
const GMPayer = require('./src/payment/GMPayer');
const ERC8004Tracker = require('./src/ownership/ERC8004Tracker');
const MockAIGenerator = require('./src/ai/MockAIGenerator');

async function runDemo() {
    console.log('🚀 Starting AI Content Payment & Ownership Demo');
    console.log('=' .repeat(50));

    // Initialize components
    const orchestrator = new X402Orchestrator();
    const gmPayer = new GMPayer();
    const ownershipTracker = new ERC8004Tracker();
    const aiGenerator = new MockAIGenerator();

    // Setup demo user
    const userId = 'demo-user';
    gmPayer.initializeUserBalance(userId, 50.00);

    // Register the AI content generation workflow
    orchestrator.registerWorkflow('ai-content-generation', [
        {
            name: 'validate-request',
            execute: async (payload) => {
                console.log('✓ Validating request...');
                if (!payload.prompt || !payload.contentType || !payload.userId) {
                    throw new Error('Missing required fields');
                }
                return { valid: true };
            }
        },
        {
            name: 'process-payment',
            execute: async (payload) => {
                console.log('💳 Processing payment...');
                const transaction = await gmPayer.processPayment(
                    payload.userId,
                    payload.contentType,
                    { prompt: payload.prompt }
                );
                return { transaction };
            }
        },
        {
            name: 'generate-content',
            execute: async (payload) => {
                console.log('🤖 Generating AI content...');
                const content = await aiGenerator.generateContent(
                    payload.contentType,
                    payload.prompt
                );
                return { content };
            }
        },
        {
            name: 'register-ownership',
            execute: async (payload, previousResults) => {
                console.log('📋 Registering content ownership...');
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

    console.log('\n📊 Initial State:');
    console.log(`User Balance: $${gmPayer.getBalance(userId)}`);
    console.log(`Owned Content: ${ownershipTracker.getOwnedContent(userId).length}`);

    // Demo scenarios
    const scenarios = [
        {
            name: 'Text Generation',
            request: {
                userId: userId,
                contentType: 'text-generation',
                prompt: 'Write a short story about a robot learning to paint'
            }
        },
        {
            name: 'Image Generation',
            request: {
                userId: userId,
                contentType: 'image-generation',
                prompt: 'A futuristic cityscape with flying cars at sunset'
            }
        },
        {
            name: 'Audio Generation',
            request: {
                userId: userId,
                contentType: 'audio-generation',
                prompt: 'Ambient music for a space exploration documentary'
            }
        }
    ];

    // Execute scenarios
    for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        console.log(`\n🎯 Scenario ${i + 1}: ${scenario.name}`);
        console.log('-'.repeat(30));

        try {
            const job = await orchestrator.executeWorkflow('ai-content-generation', scenario.request);
            
            console.log(`✅ Job completed: ${job.id}`);
            console.log(`💰 Cost: $${job.results['process-payment'].transaction.amount}`);
            console.log(`🆔 Content ID: ${job.results['generate-content'].content.contentId}`);
            console.log(`🤖 AI Model: ${job.results['generate-content'].content.model}`);
            
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
        }
    }

    // Show final state
    console.log('\n📊 Final State:');
    console.log(`User Balance: $${gmPayer.getBalance(userId)}`);
    
    const ownedContent = ownershipTracker.getOwnedContent(userId);
    console.log(`Owned Content: ${ownedContent.length}`);
    
    ownedContent.forEach((content, index) => {
        console.log(`  ${index + 1}. ${content.contentType} - ${content.id}`);
    });

    // Generate ownership proof
    if (ownedContent.length > 0) {
        console.log('\n🔐 Generating Ownership Proof for first content:');
        const proof = ownershipTracker.generateOwnershipProof(ownedContent[0].id, userId);
        console.log(`Proof Hash: ${proof.proofHash}`);
        console.log(`Verified Owner: ${proof.owner}`);
    }

    // Platform statistics
    console.log('\n📈 Platform Statistics:');
    const stats = ownershipTracker.getStats();
    console.log(`Total Content: ${stats.totalContent}`);
    console.log(`Content Types: ${Object.keys(stats.contentTypes).join(', ')}`);
    console.log(`AI Models Used: ${Object.keys(stats.aiModels).join(', ')}`);

    console.log('\n✨ Demo completed successfully!');
    console.log('🌐 Start the web server with: npm start');
}

// Run the demo
if (require.main === module) {
    runDemo().catch(console.error);
}

module.exports = { runDemo };
