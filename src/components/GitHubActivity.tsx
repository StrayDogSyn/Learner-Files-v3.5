import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { Calendar, GitCommit, ExternalLink, Clock } from 'lucide-react';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
  repository?: {
    name: string;
    html_url: string;
  };
}

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  updated_at: string;
  language: string;
  stargazers_count: number;
}

const GitHubActivity: React.FC = () => {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = 'StrayDogSyn';

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
        );
        
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const reposData = await reposResponse.json();
        setRepos(reposData);
        
        // Fetch recent commits from multiple repos
        const commitPromises = reposData.slice(0, 3).map(async (repo: GitHubRepo) => {
          try {
            const commitsResponse = await fetch(
              `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=2`
            );
            
            if (commitsResponse.ok) {
              const commitsData = await commitsResponse.json();
              return commitsData.map((commit: GitHubCommit) => ({
                ...commit,
                repository: {
                  name: repo.name,
                  html_url: repo.html_url
                }
              }));
            }
            return [];
          } catch {
            return [];
          }
        });
        
        const allCommits = await Promise.all(commitPromises);
        const flatCommits = allCommits.flat().slice(0, 5);
        setCommits(flatCommits);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const truncateMessage = (message: string, maxLength: number = 60) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-hunter"></div>
              <span className="text-brand-hunter font-medium">Loading GitHub activity...</span>
            </div>
          </GlassCard>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-8">
            <div className="text-center">
              <p className="text-red-400 mb-4">Unable to load GitHub activity</p>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          </GlassCard>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" id="github-activity">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-brand-hunter via-brand-sage to-brand-hunter bg-clip-text text-transparent">
              What I'm Working On
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Live updates from my GitHub activity - see what I'm building and learning
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Commits */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <GitCommit className="h-6 w-6 text-brand-hunter" />
              <h3 className="text-2xl font-bold text-white">Recent Commits</h3>
            </div>
            
            <div className="space-y-4">
              {commits.length > 0 ? (
                commits.map((commit) => (
                  <div key={commit.sha} className="border-l-2 border-brand-hunter/30 pl-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">
                          {truncateMessage(commit.commit.message)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(commit.commit.author.date)}</span>
                          </span>
                          {commit.repository && (
                            <a 
                              href={commit.repository.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 hover:text-brand-hunter transition-colors"
                            >
                              <span>{commit.repository.name}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No recent commits found</p>
              )}
            </div>
          </GlassCard>

          {/* Active Repositories */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-6 w-6 text-brand-hunter" />
              <h3 className="text-2xl font-bold text-white">Active Projects</h3>
            </div>
            
            <div className="space-y-4">
              {repos.length > 0 ? (
                repos.slice(0, 4).map((repo) => (
                  <div key={repo.name} className="border border-white/10 rounded-lg p-4 hover:border-brand-hunter/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold">{repo.name}</h4>
                      <a 
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-hunter hover:text-brand-sage transition-colors"
                        title={`View ${repo.name} on GitHub`}
                        aria-label={`View ${repo.name} repository on GitHub`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    
                    {repo.description && (
                      <p className="text-gray-400 text-sm mb-3">
                        {truncateMessage(repo.description, 80)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        {repo.language && (
                          <span className="bg-brand-hunter/20 text-brand-hunter px-2 py-1 rounded">
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && (
                          <span>⭐ {repo.stargazers_count}</span>
                        )}
                      </div>
                      <span>Updated {formatDate(repo.updated_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No repositories found</p>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-hunter to-brand-sage text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-hunter/25 transition-all duration-300"
              >
                <span>View All Projects</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default GitHubActivity;