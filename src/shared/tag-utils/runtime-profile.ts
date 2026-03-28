export type SupportedBrowserName = 'chromium' | 'firefox' | 'webkit';
export type BrowserMode = 'standard' | 'incognito';

export interface BrowserExecutionProfile {
  tags: string[];
  browserName: SupportedBrowserName;
  mode: BrowserMode;
  reasons: string[];
}

const browserTags: Record<string, SupportedBrowserName> = {
  '@firefox': 'firefox',
  '@webkit': 'webkit',
  '@safari': 'webkit'
};

export function extractTagsFromTitle(title: string): string[] {
  return title.match(/@\w+/g) ?? [];
}

export function resolveBrowserExecutionProfile(
  title: string,
  defaultBrowserName: SupportedBrowserName
): BrowserExecutionProfile {
  const tags = extractTagsFromTitle(title);
  const reasons: string[] = [];

  const browserTag = tags.find((tag) => tag in browserTags);
  const browserName = browserTag ? browserTags[browserTag] : defaultBrowserName;
  const mode: BrowserMode = tags.includes('@incognito') ? 'incognito' : 'standard';

  if (browserTag) {
    reasons.push(`tag ${browserTag} detected`);
  } else {
    reasons.push(`no browser-specific tag, using default ${defaultBrowserName}`);
  }

  if (mode === 'incognito') {
    reasons.push('tag @incognito detected');
  } else {
    reasons.push('no @incognito tag detected');
  }

  return {
    tags,
    browserName,
    mode,
    reasons
  };
}
