// GitHub-related type definitions for the dynamic portfolio
// Language color mapping for visual consistency
export const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    SCSS: '#c6538c',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Angular: '#DD0031',
    Svelte: '#ff3e00',
    Shell: '#89e051',
    PowerShell: '#012456',
    Dockerfile: '#384d54',
    YAML: '#cb171e',
    JSON: '#292929',
    Markdown: '#083fa1'
};
// Project category icons mapping
export const CATEGORY_ICONS = {
    web: 'Globe',
    mobile: 'Smartphone',
    desktop: 'Monitor',
    library: 'Package',
    tool: 'Wrench',
    game: 'Gamepad2',
    other: 'Code'
};
// Helper functions for type safety
export const isValidRepository = (repo) => {
    return (repo &&
        typeof repo.id === 'number' &&
        typeof repo.name === 'string' &&
        typeof repo.full_name === 'string' &&
        typeof repo.html_url === 'string');
};
export const isValidGitHubUser = (user) => {
    return (user &&
        typeof user.login === 'string' &&
        typeof user.id === 'number' &&
        typeof user.public_repos === 'number');
};
export const getLanguageColor = (language) => {
    if (!language)
        return '#6b7280'; // Default gray
    return LANGUAGE_COLORS[language] || '#6b7280';
};
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1)
        return 'Yesterday';
    if (diffDays < 7)
        return `${diffDays} days ago`;
    if (diffDays < 30)
        return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365)
        return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
};
export const categorizeRepository = (repo) => {
    const name = repo.name.toLowerCase();
    const description = repo.description?.toLowerCase() || '';
    const topics = repo.topics.map(t => t.toLowerCase());
    // Check for specific patterns
    if (topics.includes('game') || name.includes('game') || description.includes('game')) {
        return 'game';
    }
    if (topics.includes('mobile') || topics.includes('android') || topics.includes('ios') ||
        name.includes('mobile') || description.includes('mobile')) {
        return 'mobile';
    }
    if (topics.includes('desktop') || topics.includes('electron') ||
        name.includes('desktop') || description.includes('desktop')) {
        return 'desktop';
    }
    if (topics.includes('library') || topics.includes('package') || topics.includes('npm') ||
        name.includes('lib') || description.includes('library')) {
        return 'library';
    }
    if (topics.includes('tool') || topics.includes('cli') || topics.includes('utility') ||
        name.includes('tool') || description.includes('tool')) {
        return 'tool';
    }
    if (topics.includes('web') || topics.includes('website') || topics.includes('webapp') ||
        repo.language === 'HTML' || repo.language === 'CSS' || repo.language === 'JavaScript' ||
        repo.language === 'TypeScript' || description.includes('web')) {
        return 'web';
    }
    return 'other';
};
//# sourceMappingURL=github.js.map