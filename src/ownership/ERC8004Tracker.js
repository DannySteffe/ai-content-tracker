// ERC-8004 Style Ownership Tracking
// Tracks ownership and provenance of AI-generated content

class ERC8004Tracker {
    constructor() {
        this.contentRegistry = new Map();
        this.ownershipHistory = new Map();
        this.metadata = new Map();
    }

    // Register new AI-generated content
    registerContent(contentId, owner, contentType, aiModel, prompt, paymentTxId) {
        const contentRecord = {
            id: contentId,
            owner: owner,
            contentType: contentType,
            aiModel: aiModel,
            prompt: prompt,
            creationTime: new Date(),
            paymentTransaction: paymentTxId,
            status: 'active'
        };

        this.contentRegistry.set(contentId, contentRecord);
        
        // Initialize ownership history
        this.ownershipHistory.set(contentId, [{
            owner: owner,
            timestamp: new Date(),
            transactionType: 'creation',
            paymentTx: paymentTxId
        }]);

        console.log(`Content ${contentId} registered to owner ${owner}`);
        return contentRecord;
    }

    // Transfer ownership (for licensing/selling)
    transferOwnership(contentId, currentOwner, newOwner, paymentTxId = null) {
        const content = this.contentRegistry.get(contentId);
        
        if (!content) {
            throw new Error(`Content ${contentId} not found`);
        }
        
        if (content.owner !== currentOwner) {
            throw new Error(`Only current owner can transfer ownership`);
        }

        // Update owner
        content.owner = newOwner;
        this.contentRegistry.set(contentId, content);

        // Add to ownership history
        const history = this.ownershipHistory.get(contentId) || [];
        history.push({
            previousOwner: currentOwner,
            owner: newOwner,
            timestamp: new Date(),
            transactionType: 'transfer',
            paymentTx: paymentTxId
        });
        this.ownershipHistory.set(contentId, history);

        console.log(`Ownership of ${contentId} transferred from ${currentOwner} to ${newOwner}`);
        return true;
    }

    // Verify ownership
    verifyOwnership(contentId, claimedOwner) {
        const content = this.contentRegistry.get(contentId);
        return content && content.owner === claimedOwner;
    }

    // Get content details
    getContentDetails(contentId) {
        const content = this.contentRegistry.get(contentId);
        const history = this.ownershipHistory.get(contentId) || [];
        
        return {
            content: content,
            ownershipHistory: history,
            metadata: this.metadata.get(contentId) || {}
        };
    }

    // Get all content owned by a user
    getOwnedContent(owner) {
        return Array.from(this.contentRegistry.values())
            .filter(content => content.owner === owner && content.status === 'active');
    }

    // Add metadata to content
    addMetadata(contentId, key, value) {
        if (!this.metadata.has(contentId)) {
            this.metadata.set(contentId, {});
        }
        
        const contentMetadata = this.metadata.get(contentId);
        contentMetadata[key] = value;
        this.metadata.set(contentId, contentMetadata);
    }

    // Generate content proof (simplified)
    generateOwnershipProof(contentId, owner) {
        const content = this.contentRegistry.get(contentId);
        
        if (!content || content.owner !== owner) {
            return null;
        }

        return {
            contentId: contentId,
            owner: owner,
            creationTime: content.creationTime,
            aiModel: content.aiModel,
            paymentTx: content.paymentTransaction,
            proofHash: this.generateProofHash(content),
            timestamp: new Date()
        };
    }

    // Generate a simple proof hash
    generateProofHash(content) {
        const data = `${content.id}${content.owner}${content.creationTime}${content.aiModel}`;
        return Buffer.from(data).toString('base64');
    }

    // Get platform statistics
    getStats() {
        const totalContent = this.contentRegistry.size;
        const contentTypes = {};
        const aiModels = {};
        
        for (const content of this.contentRegistry.values()) {
            contentTypes[content.contentType] = (contentTypes[content.contentType] || 0) + 1;
            aiModels[content.aiModel] = (aiModels[content.aiModel] || 0) + 1;
        }
        
        return {
            totalContent,
            contentTypes,
            aiModels,
            totalTransfers: Array.from(this.ownershipHistory.values())
                .reduce((sum, history) => sum + history.length - 1, 0)
        };
    }
}

module.exports = ERC8004Tracker;
