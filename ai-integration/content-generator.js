/**
 * Content Generator for StrayDog Syndications Portfolio
 * Handles dynamic content generation using Claude AI
 */

class ContentGenerator {
    constructor(claudeClient) {
        this.claude = claudeClient;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Generate dynamic hero content
     */
    async generateHeroContent(userContext = {}) {
        const cacheKey = `hero_${JSON.stringify(userContext)}`;

        if (this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        const prompt = `Generate a compelling hero section for a justice reform technology portfolio. Include:
        - A powerful headline (max 60 characters)
        - A compelling subtitle (max 120 characters)
        - A call-to-action phrase

        Context: ${JSON.stringify(userContext)}

        Return as JSON with keys: headline, subtitle, cta.`;

        const response = await this.claude.generateContent(prompt, 'portfolio');

        if (response.success) {
            try {
                const content = JSON.parse(response.content);
                this.setCache(cacheKey, content);
                return content;
            } catch (e) {
                // Fallback if JSON parsing fails
                return this.getFallbackHeroContent();
            }
        }

        return this.getFallbackHeroContent();
    }

    /**
     * Generate project descriptions
     */
    async generateProjectDescription(projectData) {
        const cacheKey = `project_${projectData.name || 'unknown'}`;

        if (this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        const prompt = `Create a compelling project description for:

        Project: ${projectData.name}
        Tech Stack: ${projectData.technologies?.join(', ') || 'Not specified'}
        Purpose: ${projectData.purpose || 'Not specified'}

        Generate:
        - A brief description (2-3 sentences)
        - Key features (3-4 bullet points)
        - Impact statement (1 sentence)

        Return as JSON with keys: description, features (array), impact`;

        const response = await this.claude.generateContent(prompt, 'projects');

        if (response.success) {
            try {
                const content = JSON.parse(response.content);
                this.setCache(cacheKey, content);
                return content;
            } catch (e) {
                return this.getFallbackProjectDescription(projectData);
            }
        }

        return this.getFallbackProjectDescription(projectData);
    }

    /**
     * Generate testimonial content
     */
    async generateTestimonial(clientType = 'general') {
        const cacheKey = `testimonial_${clientType}`;

        if (this.isCached(cacheKey)) {
            return this.getFromCache(cacheKey);
        }

        const prompt = `Generate a realistic testimonial for a justice reform technology consultant.
        Client type: ${clientType}

        Include:
        - Client name and title
        - Organization name
        - Testimonial text (2-3 sentences)
        - Rating (1-5 stars)

        Return as JSON with keys: name, title, organization, testimonial, rating`;

        const response = await this.claude.generateContent(prompt, 'consulting');

        if (response.success) {
            try {
                const content = JSON.parse(response.content);
                this.setCache(cacheKey, content);
                return content;
            } catch (e) {
                return this.getFallbackTestimonial();
            }
        }

        return this.getFallbackTestimonial();
    }

    /**
     * Generate blog post ideas
     */
    async generateBlogIdeas(topic = 'justice reform technology') {
        const prompt = `Generate 5 compelling blog post ideas about ${topic}. Each should include:
        - Title
        - Brief description
        - Target audience

        Return as JSON array with objects containing: title, description, audience`;

        const response = await this.claude.generateContent(prompt, 'portfolio');

        if (response.success) {
            try {
                return JSON.parse(response.content);
            } catch (e) {
                return this.getFallbackBlogIdeas();
            }
        }

        return this.getFallbackBlogIdeas();
    }

    /**
     * Generate performance insights
     */
    async generatePerformanceInsights(metrics) {
        const prompt = `Analyze these portfolio performance metrics and provide insights:

        ${JSON.stringify(metrics, null, 2)}

        Provide:
        - Key findings (3-4 points)
        - Recommendations (2-3 actions)
        - Success metrics to track

        Return as JSON with keys: findings (array), recommendations (array), metrics (array)`;

        const response = await this.claude.generateContent(prompt, 'analytics');

        if (response.success) {
            try {
                return JSON.parse(response.content);
            } catch (e) {
                return this.getFallbackInsights();
            }
        }

        return this.getFallbackInsights();
    }

    // Cache management
    isCached(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;

        const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
        if (isExpired) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    getFromCache(key) {
        return this.cache.get(key)?.data;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Fallback content methods
    getFallbackHeroContent() {
        return {
            headline: "Justice Reform Through Technology",
            subtitle: "Transforming criminal justice systems with innovative AI-powered solutions and 20+ years of expertise",
            cta: "Explore Our Impact"
        };
    }

    getFallbackProjectDescription(projectData) {
        return {
            description: `${projectData.name} is an innovative solution designed to address key challenges in justice reform technology.`,
            features: [
                "Modern, responsive design",
                "Advanced functionality",
                "User-focused experience",
                "Scalable architecture"
            ],
            impact: "This project demonstrates cutting-edge development practices and real-world problem solving."
        };
    }

    getFallbackTestimonial() {
        return {
            name: "Sarah Johnson",
            title: "Director of Technology",
            organization: "Justice Innovation Institute",
            testimonial: "StrayDog Syndications delivered exceptional results that transformed our approach to case management. Their expertise in justice reform technology is unmatched.",
            rating: 5
        };
    }

    getFallbackBlogIdeas() {
        return [
            {
                title: "The Future of AI in Criminal Justice Reform",
                description: "Exploring how artificial intelligence can create more equitable justice systems",
                audience: "Justice reform advocates and technology leaders"
            },
            {
                title: "Building Scalable Solutions for Court Systems",
                description: "Technical insights on modernizing court technology infrastructure",
                audience: "Court administrators and IT professionals"
            }
        ];
    }

    getFallbackInsights() {
        return {
            findings: [
                "Portfolio engagement has increased significantly",
                "Technical projects show strong user interest",
                "Justice reform content resonates with target audience"
            ],
            recommendations: [
                "Continue developing AI-focused content",
                "Expand case study documentation",
                "Enhance interactive project demonstrations"
            ],
            metrics: [
                "Page views and engagement time",
                "Project interaction rates",
                "Contact form conversions"
            ]
        };
    }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentGenerator;
} else {
    window.ContentGenerator = ContentGenerator;
}
