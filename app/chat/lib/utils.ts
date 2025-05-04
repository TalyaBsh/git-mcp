import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRepoData(url: string): {
  owner: string | null;
  repo: string | null;
} {
  // Handle simple owner/repo format
  if (!url.includes("/") && !url.includes(".")) {
    return { owner: null, repo: null };
  }

  // Remove protocol if present
  const urlWithoutProtocol = url.replace(/^https?:\/\//, "");

  // Different URL patterns
  const patterns = [
    // github.com/owner/repo
    /^(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/,
    // owner.github.io/repo
    /^(?:www\.)?([^\/]+)\.github\.io\/([^\/]+)/,
    // repomcp.com/owner/repo
    /^(?:www\.)?gitmcp\.io\/([^\/]+)\/([^\/]+)/,
    // owner.repomcp.com/repo
    /^(?:www\.)?([^\/]+)\.gitmcp\.io\/([^\/]+)/,
    // owner.repomcp.com
    /^(?:www\.)?([^\/]+)\.gitmcp\.io/,
    // owner.github.io
    /^(?:www\.)?([^\/]+)\.github\.io/,
    // repomcp.com/docs
    /^(?:www\.)?gitmcp\.io\/(docs)/,
    // Simple owner/repo format
    /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = urlWithoutProtocol.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  // Default fallback
  return { owner: null, repo: null };
}
