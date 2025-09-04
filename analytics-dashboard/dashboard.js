// StrayDog Analytics Dashboard JavaScript
// Real-time analytics dashboard with AI integration

// GitHub Integration Class
class GitHubIntegration {
    constructor(username = 'StrayDogSyn') {
        this.username = username;
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async fetchWithCache(url, cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            console.error(`GitHub API error for ${url}:`, error);
            return cached ? cached.data : null;
        }
    }

    async getUserData() {
        return await this.fetchWithCache(
            `${this.apiBase}/users/${this.username}`,
            'user-data'
        );
    }

    async getRepositories() {
        return await this.fetchWithCache(
            `${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=100`,
            'repositories'
        );
    }

    async getRecentActivity() {
        return await this.fetchWithCache(
            `${this.apiBase}/users/${this.username}/events/public?per_page=30`,
            'recent-activity'
        );
    }

    async updateGitHubMetrics() {
        try {
            const userData = await this.getUserData();
            if (!userData) return;

            // Update metric cards
            this.updateMetricCard('github-repos', userData.public_repos);
            this.updateMetricCard('github-followers', userData.followers);
            this.updateMetricCard('github-following', userData.following);

            // Calculate total stars
            const repos = await this.getRepositories();
            if (repos) {
                const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
                this.updateMetricCard('github-stars', totalStars);
            }

            // Update activity feed
            await this.updateActivityFeed();
            
            // Update repository showcase
            await this.updateRepositoryShowcase();

        } catch (error) {
            console.error('Error updating GitHub metrics:', error);
        }
    }

    updateMetricCard(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = this.formatNumber(value);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    async updateActivityFeed() {
        const feedContainer = document.getElementById('github-activity-feed');
        if (!feedContainer) return;

        try {
            feedContainer.innerHTML = '<div class="activity-loading"><div class="loading-spinner"></div>Loading activity...</div>';
            
            const events = await this.getRecentActivity();
            if (!events || events.length === 0) {
                feedContainer.innerHTML = '<div class="activity-item"><div class="activity-content"><div class="activity-title">No recent activity</div></div></div>';
                return;
            }

            const activityHtml = events.slice(0, 10).map(event => {
                const icon = this.getEventIcon(event.type);
                const description = this.getEventDescription(event);
                const time = this.formatTime(event.created_at);
                
                return `
                    <div class="activity-item">
                        <div class="activity-icon">${icon}</div>
                        <div class="activity-content">
                            <div class="activity-title">${description.title}</div>
                            <div class="activity-description">${description.detail}</div>
                        </div>
                        <div class="activity-time">${time}</div>
                    </div>
                `;
            }).join('');

            feedContainer.innerHTML = activityHtml;
        } catch (error) {
            console.error('Error updating activity feed:', error);
            feedContainer.innerHTML = '<div class="activity-item"><div class="activity-content"><div class="activity-title">Error loading activity</div></div></div>';
        }
    }

    getEventIcon(eventType) {
        const icons = {
            'PushEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" /><path d="M14.5 5.5l4 4" /></svg>',
            'CreateEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>',
            'DeleteEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>',
            'ForkEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 18a3 3 0 0 1 -3 -3v-4l-3 3" /><path d="M6 15a3 3 0 1 1 0 -6a3 3 0 0 1 0 6z" /><path d="M18 9a3 3 0 1 1 0 -6a3 3 0 0 1 0 6z" /><path d="M18 15a3 3 0 1 1 0 -6a3 3 0 0 1 0 6z" /><path d="M9 15h3" /></svg>',
            'WatchEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>',
            'IssuesEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 8v4" /><path d="M12 16h.01" /><path d="M7.86 2h8.28l4.86 4.86v8.28l-4.86 4.86h-8.28l-4.86 -4.86v-8.28z" /></svg>',
            'PullRequestEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6 8l0 8" /><path d="M11 6h5a2 2 0 0 1 2 2v8" /><path d="M14 9l-2 -2l2 -2" /></svg>',
            'ReleaseEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" /><path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" /><path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>',
            'PublicEvent': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>'
        };
        return icons[eventType] || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>';
    }

    getEventDescription(event) {
        const repo = event.repo.name;
        
        switch (event.type) {
            case 'PushEvent':
                const commits = event.payload.commits?.length || 0;
                return {
                    title: `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${repo}`,
                    detail: event.payload.commits?.[0]?.message || 'No commit message'
                };
            case 'CreateEvent':
                return {
                    title: `Created ${event.payload.ref_type} in ${repo}`,
                    detail: event.payload.ref || 'New repository'
                };
            case 'ForkEvent':
                return {
                    title: `Forked ${repo}`,
                    detail: 'Repository forked'
                };
            case 'WatchEvent':
                return {
                    title: `Starred ${repo}`,
                    detail: 'Added to starred repositories'
                };
            case 'IssuesEvent':
                return {
                    title: `${event.payload.action} issue in ${repo}`,
                    detail: event.payload.issue?.title || 'Issue activity'
                };
            case 'PullRequestEvent':
                return {
                    title: `${event.payload.action} pull request in ${repo}`,
                    detail: event.payload.pull_request?.title || 'Pull request activity'
                };
            default:
                return {
                    title: `${event.type.replace('Event', '')} in ${repo}`,
                    detail: 'Repository activity'
                };
        }
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    }

    async updateRepositoryShowcase() {
        const showcaseContainer = document.getElementById('github-repos-showcase');
        if (!showcaseContainer) return;

        try {
            showcaseContainer.innerHTML = '<div class="repo-loading"><div class="loading-spinner"></div>Loading repositories...</div>';
            
            const repos = await this.getRepositories();
            if (!repos || repos.length === 0) {
                showcaseContainer.innerHTML = '<div class="repo-card"><div class="repo-header"><div class="repo-name">No repositories found</div></div></div>';
                return;
            }

            // Sort by stars and recent activity, take top 6
            const featuredRepos = repos
                .filter(repo => !repo.fork)
                .sort((a, b) => {
                    const scoreA = a.stargazers_count * 2 + (new Date(a.updated_at) - new Date()) / 86400000;
                    const scoreB = b.stargazers_count * 2 + (new Date(b.updated_at) - new Date()) / 86400000;
                    return scoreB - scoreA;
                })
                .slice(0, 6);

            const reposHtml = featuredRepos.map(repo => `
                <div class="repo-card">
                    <div class="repo-header">
                        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                        ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                    </div>
                    <div class="repo-description">${repo.description || 'No description available'}</div>
                    <div class="repo-stats">
                        <div class="repo-stat"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg> ${repo.stargazers_count}</div>
                        <div class="repo-stat"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 18a3 3 0 0 1 -3 -3v-4l-3 3" /><path d="M6 15a3 3 0 1 1 0 -6a3 3 0 0 1 0 6z" /><path d="M18 9a3 3 0 1 1 0 -6a3 3 0 0 1 0 6z" /><path d="M18 15a3 3 0 1 1 0 -6a3 3 0 0 1 0 6z" /><path d="M9 15h3" /></svg> ${repo.forks_count}</div>
                        <div class="repo-stat"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" /><path d="M14.5 5.5l4 4" /></svg> ${this.formatTime(repo.updated_at)}</div>
                    </div>
                </div>
            `).join('');

            showcaseContainer.innerHTML = reposHtml;
        } catch (error) {
            console.error('Error updating repository showcase:', error);
            showcaseContainer.innerHTML = '<div class="repo-card"><div class="repo-header"><div class="repo-name">Error loading repositories</div></div></div>';
        }
    }

    async refreshGitHubData() {
        // Clear cache to force fresh data
        this.cache.clear();
        await this.updateGitHubMetrics();
    }
}

class AnalyticsDashboard {
    constructor() {
        this.isConnected = false;
        this.updateInterval = null;
        this.charts = {};
        this.currentPeriod = '1h';
        this.eventSource = null;
        this.retryCount = 0;
        this.maxRetries = 5;
        this.github = new GitHubIntegration('StrayDogSyn');
        
        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            await this.setupEventListeners();
            await this.initializeCharts();
            await this.loadInitialData();
            this.showLoading(false);
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            this.showError('Failed to initialize dashboard');
            this.showLoading(false);
        }
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refreshData();
        });

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        // Time filter buttons
        document.querySelectorAll('.time-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changePeriod(e.target.dataset.period);
            });
        });

        // Modal close
        document.getElementById('close-error-modal').addEventListener('click', () => {
            this.hideError();
        });

        // Retry connection
        document.getElementById('retry-connection').addEventListener('click', () => {
            this.hideError();
            this.retryConnection();
        });

        // Window visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });

        // GitHub refresh button
        const githubRefreshBtn = document.getElementById('refresh-github');
        if (githubRefreshBtn) {
            githubRefreshBtn.addEventListener('click', () => {
                this.refreshGitHubData();
            });
        }
    }

    async initializeCharts() {
        // Initialize activity chart
        const activityCanvas = document.getElementById('activity-chart');
        const activityCtx = activityCanvas.getContext('2d');
        
        this.charts.activity = this.createLineChart(activityCtx, {
            labels: this.generateTimeLabels(this.currentPeriod),
            datasets: [
                {
                    label: 'Page Views',
                    data: [],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'AI Interactions',
                    data: [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        });

        // Initialize sources chart
        const sourcesCanvas = document.getElementById('sources-chart');
        const sourcesCtx = sourcesCanvas.getContext('2d');
        
        this.charts.sources = this.createDoughnutChart(sourcesCtx, {
            labels: ['Direct', 'Search', 'Social', 'Referral', 'AI Generated'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#a855f7',
                    '#c084fc',
                    '#e879f9'
                ],
                borderWidth: 0
            }]
        });
    }

    createLineChart(ctx, data) {
        return new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#e2e8f0',
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(99, 102, 241, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(99, 102, 241, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    createDoughnutChart(ctx, data) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    async loadInitialData() {
        // Load functional demo data immediately
        this.loadMockData();
        this.updateConnectionStatus('demo');
    }

    loadMockData() {
        // Load mock data for demonstration
        const mockData = {
            metrics: {
                totalVisitors: 1247,
                pageViews: 3891,
                aiInteractions: 567,
                conversionRate: 3.2,
                changes: {
                    visitors: 12.5,
                    views: 8.3,
                    ai: 23.1,
                    conversion: -1.2
                }
            },
            activity: {
                labels: this.generateTimeLabels(this.currentPeriod),
                pageViews: this.generateMockTimeSeries(24, 50, 200),
                aiInteractions: this.generateMockTimeSeries(24, 10, 50)
            },
            sources: {
                direct: 45,
                search: 30,
                social: 15,
                referral: 8,
                ai: 2
            },
            topPages: [
                { page: '/', views: 1234, time: '2:34' },
                { page: '/portfolio', views: 892, time: '3:12' },
                { page: '/ai-dashboard', views: 567, time: '4:23' },
                { page: '/about', views: 445, time: '1:56' },
                { page: '/contact', views: 234, time: '2:11' }
            ],
            aiMetrics: {
                responseTime: 245,
                successRate: 98.5,
                cacheRate: 76.3,
                errorRate: 1.5
            },
            recentEvents: [
                { type: 'success', text: 'AI content generated successfully', time: '2 min ago' },
                { type: 'info', text: 'New visitor from search engine', time: '3 min ago' },
                { type: 'success', text: 'Portfolio page viewed', time: '5 min ago' },
                { type: 'warning', text: 'Slow API response detected', time: '8 min ago' },
                { type: 'info', text: 'User interaction recorded', time: '10 min ago' }
            ],
            timestamp: new Date().toISOString()
        };

        this.updateDashboard(mockData);
    }

    updateDashboard(data) {
        // Validate data structure before updating
        if (!data || typeof data !== 'object') {
            console.error('Invalid data structure received');
            return;
        }

        try {
            // Update metrics with validation
            if (data.metrics && this.validateMetrics(data.metrics)) {
                this.updateMetrics(data.metrics);
            }

            // Update charts with validation
            if (data.activity && this.validateActivityData(data.activity)) {
                this.updateActivityChart(data.activity);
            }

            if (data.sources && this.validateSourcesData(data.sources)) {
                this.updateSourcesChart(data.sources);
            }

            // Update tables and lists with validation
            if (data.topPages && Array.isArray(data.topPages)) {
                this.updateTopPages(data.topPages);
            }

            if (data.aiMetrics && this.validateAIMetrics(data.aiMetrics)) {
                this.updateAIMetrics(data.aiMetrics);
            }

            if (data.recentEvents && Array.isArray(data.recentEvents)) {
                this.updateRecentEvents(data.recentEvents);
            }

            // Update timestamp if available
            if (data.timestamp) {
                this.updateLastRefresh(data.timestamp);
            }
        } catch (error) {
            console.error('Error updating dashboard:', error);
            this.showError('Failed to update dashboard data');
        }
    }

    validateMetrics(metrics) {
        return metrics && 
               typeof metrics.totalVisitors === 'number' &&
               typeof metrics.pageViews === 'number' &&
               typeof metrics.aiInteractions === 'number' &&
               typeof metrics.conversionRate === 'number';
    }

    validateActivityData(activity) {
        return activity &&
               Array.isArray(activity.labels) &&
               Array.isArray(activity.pageViews) &&
               Array.isArray(activity.aiInteractions);
    }

    validateSourcesData(sources) {
        return sources &&
               typeof sources.direct === 'number' &&
               typeof sources.search === 'number' &&
               typeof sources.social === 'number';
    }

    validateAIMetrics(aiMetrics) {
        return aiMetrics &&
               typeof aiMetrics.responseTime === 'number' &&
               typeof aiMetrics.successRate === 'number' &&
               typeof aiMetrics.cacheRate === 'number' &&
               typeof aiMetrics.errorRate === 'number';
    }

    updateLastRefresh(timestamp) {
        const refreshElement = document.getElementById('last-refresh');
        if (refreshElement) {
            const date = new Date(timestamp);
            refreshElement.textContent = `Last updated: ${date.toLocaleTimeString()}`;
        }
    }

    updateMetrics(metrics) {
        // Update metric values
        document.getElementById('total-visitors').textContent = this.formatNumber(metrics.totalVisitors);
        document.getElementById('page-views').textContent = this.formatNumber(metrics.pageViews);
        document.getElementById('ai-interactions').textContent = this.formatNumber(metrics.aiInteractions);
        document.getElementById('conversion-rate').textContent = `${metrics.conversionRate}%`;

        // Update changes
        if (metrics.changes) {
            this.updateChange('visitors-change', metrics.changes.visitors);
            this.updateChange('views-change', metrics.changes.views);
            this.updateChange('ai-change', metrics.changes.ai);
            this.updateChange('conversion-change', metrics.changes.conversion);
        }
    }

    updateChange(elementId, value) {
        const element = document.getElementById(elementId);
        const isPositive = value >= 0;
        
        element.textContent = `${isPositive ? '+' : ''}${value}%`;
        element.className = `metric-change ${isPositive ? 'positive' : 'negative'}`;
    }

    updateActivityChart(activity) {
        if (this.charts.activity) {
            this.charts.activity.data.labels = activity.labels;
            this.charts.activity.data.datasets[0].data = activity.pageViews;
            this.charts.activity.data.datasets[1].data = activity.aiInteractions;
            this.charts.activity.update('none');
        }
    }

    updateSourcesChart(sources) {
        if (this.charts.sources) {
            this.charts.sources.data.datasets[0].data = [
                sources.direct,
                sources.search,
                sources.social,
                sources.referral,
                sources.ai
            ];
            this.charts.sources.update('none');
        }
    }

    updateTopPages(pages) {
        const container = document.getElementById('top-pages');
        const header = container.querySelector('.table-header');
        
        // Clear existing rows
        container.querySelectorAll('.table-row').forEach(row => row.remove());
        
        // Add new rows
        pages.forEach(page => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <span>${page.page}</span>
                <span>${this.formatNumber(page.views)}</span>
                <span>${page.time}</span>
            `;
            container.appendChild(row);
        });
    }

    updateAIMetrics(metrics) {
        document.getElementById('ai-response-time').textContent = `${metrics.responseTime}ms`;
        document.getElementById('ai-success-rate').textContent = `${metrics.successRate}%`;
        document.getElementById('ai-cache-rate').textContent = `${metrics.cacheRate}%`;
        document.getElementById('ai-error-rate').textContent = `${metrics.errorRate}%`;
    }

    updateRecentEvents(events) {
        const container = document.getElementById('events-feed');
        container.innerHTML = '';
        
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <div class="event-icon ${event.type}"></div>
                <div class="event-text">${event.text}</div>
                <div class="event-time">${event.time}</div>
            `;
            container.appendChild(eventElement);
        });
    }

    setupDemoUpdates() {
        // Setup periodic updates with fresh mock data for demonstration
        this.updateInterval = setInterval(() => {
            console.log('Refreshing demo data...');
            this.loadMockData();
        }, 30000); // Update every 30 seconds with new mock data
        
        this.isConnected = 'demo';
    }

    async setupRealTimeUpdates() {
        // Try Server-Sent Events first
        try {
            this.eventSource = new EventSource('/api/analytics/stream');
            
            this.eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.updateDashboard(data);
            };
            
            this.eventSource.onerror = () => {
                console.warn('SSE connection failed, falling back to polling');
                this.setupPolling();
            };
            
            this.isConnected = true;
        } catch (error) {
            console.warn('SSE not supported, using polling');
            this.setupPolling();
        }
    }

    setupPolling() {
        // Clear any existing interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(async () => {
            try {
                await this.loadInitialData();
                this.updateConnectionStatus(true);
                this.retryCount = 0; // Reset retry count on success
            } catch (error) {
                console.error('Polling update failed:', error);
                this.updateConnectionStatus(false);
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                } else {
                    this.pauseUpdates();
                    this.showError('Connection lost. Please refresh the page.');
                }
            }
        }, 15000); // Update every 15 seconds for better real-time feel
        
        this.isConnected = true;
    }

    changePeriod(period) {
        this.currentPeriod = period;
        
        // Update active button
        document.querySelectorAll('.time-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        // Update chart labels
        const labels = this.generateTimeLabels(period);
        if (this.charts.activity) {
            this.charts.activity.data.labels = labels;
            this.charts.activity.update();
        }
        
        // Reload data for new period
        this.loadInitialData();
    }

    generateTimeLabels(period) {
        const labels = [];
        const now = new Date();
        
        switch (period) {
            case '1h':
                for (let i = 11; i >= 0; i--) {
                    const time = new Date(now.getTime() - i * 5 * 60000);
                    labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                }
                break;
            case '6h':
                for (let i = 11; i >= 0; i--) {
                    const time = new Date(now.getTime() - i * 30 * 60000);
                    labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                }
                break;
            case '24h':
                for (let i = 11; i >= 0; i--) {
                    const time = new Date(now.getTime() - i * 2 * 3600000);
                    labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                }
                break;
            case '7d':
                for (let i = 6; i >= 0; i--) {
                    const time = new Date(now.getTime() - i * 24 * 3600000);
                    labels.push(time.toLocaleDateString('en-US', { weekday: 'short' }));
                }
                break;
        }
        
        return labels;
    }

    generateMockTimeSeries(points, min, max) {
        const data = [];
        let current = Math.random() * (max - min) + min;
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 20;
            current = Math.max(min, Math.min(max, current + change));
            data.push(Math.round(current));
        }
        
        return data;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    refreshData() {
        this.showLoading(true);
        this.loadInitialData().finally(() => {
            this.showLoading(false);
        });
    }

    async refreshGitHubData() {
        try {
            console.log('Refreshing GitHub data...');
            await this.github.refreshGitHubData();
            console.log('GitHub data refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh GitHub data:', error);
        }
    }

    async exportData() {
        try {
            const response = await fetch('/api/analytics/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    period: this.currentPeriod,
                    format: 'csv'
                })
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Export failed:', error);
            this.showError('Failed to export data');
        }
    }

    pauseUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.eventSource) {
            this.eventSource.close();
        }
        this.updateConnectionStatus(false);
    }

    resumeUpdates() {
        this.setupDemoUpdates();
        this.updateConnectionStatus('demo');
    }

    retryConnection() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            this.showLoading(true);
            
            setTimeout(() => {
                this.init();
            }, 2000 * this.retryCount); // Exponential backoff
        } else {
            this.showError('Maximum retry attempts reached. Please refresh the page.');
        }
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        const statusText = document.getElementById('status-text');
        
        if (statusElement && statusText) {
            statusElement.className = `connection-status ${status}`;
            if (status === 'demo') {
                statusText.textContent = 'Demo Mode - Live Data Simulation';
            } else {
                statusText.textContent = status === 'online' ? 'Connected' : 'Offline - Demo Mode';
            }
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    showError(message) {
        const modal = document.getElementById('error-modal');
        const messageElement = document.getElementById('error-message');
        
        messageElement.textContent = message;
        modal.classList.add('active');
    }

    hideError() {
        const modal = document.getElementById('error-modal');
        modal.classList.remove('active');
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.eventSource) {
            this.eventSource.close();
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Chart.js mock for basic functionality
class Chart {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        this.data = config.data;
        this.options = config.options;
        
        this.render();
    }
    
    render() {
        // Simple canvas rendering for demonstration
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        if (this.config.type === 'line') {
            this.renderLineChart();
        } else if (this.config.type === 'doughnut') {
            this.renderDoughnutChart();
        }
    }
    
    renderLineChart() {
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - 2 * padding) * i / 5;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width - padding, y);
            this.ctx.stroke();
        }
        
        // Draw data lines
        this.data.datasets.forEach((dataset, index) => {
            if (dataset.data && dataset.data.length > 0) {
                this.ctx.strokeStyle = dataset.borderColor;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                
                const maxValue = Math.max(...dataset.data);
                const stepX = (width - 2 * padding) / (dataset.data.length - 1);
                
                dataset.data.forEach((value, i) => {
                    const x = padding + i * stepX;
                    const y = height - padding - (value / maxValue) * (height - 2 * padding);
                    
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                });
                
                this.ctx.stroke();
            }
        });
    }
    
    renderDoughnutChart() {
        const canvas = this.ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        const innerRadius = radius * 0.6;
        
        const dataset = this.data.datasets[0];
        const total = dataset.data.reduce((sum, value) => sum + value, 0);
        
        if (total === 0) return;
        
        let currentAngle = -Math.PI / 2;
        
        dataset.data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            this.ctx.fillStyle = dataset.backgroundColor[index];
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            this.ctx.closePath();
            this.ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }
    
    update(mode) {
        this.render();
    }
    
    destroy() {
        // Cleanup
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsDashboard = new AnalyticsDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.analyticsDashboard) {
        window.analyticsDashboard.destroy();
    }
});