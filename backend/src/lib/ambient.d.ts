declare interface Domain {
  agency: string;
  branch: string;
  dead?: boolean;
  feed?: string;
  icon?: Blob;
  jan19Screenshot?: File;
  jan19Snapshot?: string;
  office: string;
  otherRedirect?: string;
  redirection?: string;
  url: string;
  x?: string;
}

declare interface DomainRaw {
  Agency: string;
  City: string;
  'Domain name': string;
  'Domain type': string;
  'Organization name': string;
  'Security contact email': string;
  State: string;
}

declare interface FeedResult {
  favicon: string;
  href: string;
  rel: string;
  sitename: string;
  title: string;
  type: string;
  url: string;
}

declare module 'puppeteer-full-page-screenshot';

declare interface Snapshot {
  [key: string]: {
    available: boolean;
    status: string;
    timestamp: string;
    url: string;
  };
}

declare interface Wayback {
  archived_snapshots: Snapshot;
  timestamp: 'string';
  url: string;
}
