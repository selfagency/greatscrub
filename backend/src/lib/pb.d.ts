/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
  Authorigins = '_authOrigins',
  Checks = 'checks',
  Domains = 'domains',
  Externalauths = '_externalAuths',
  Mfas = '_mfas',
  Otps = '_otps',
  Superusers = '_superusers',
  Users = 'users',
}

export enum DomainsBranchOptions {
  'executive' = 'executive',
  'judicial' = 'judicial',
  'legislative' = 'legislative',
}
export type AuthoriginsRecord = {
  collectionRef: string;
  created?: IsoDateString;
  fingerprint: string;
  id: string;
  recordRef: string;
  updated?: IsoDateString;
};
// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<AuthoriginsRecord>;

export type AuthSystemFields<T = never> = BaseSystemFields<T> & {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
};

// System fields
export type BaseSystemFields<T = never> = {
  collectionId: string;
  collectionName: Collections;
  expand?: T;
  id: RecordIdString;
};

// Record types for each collection

export type ChecksRecord = {
  baseImgDiff?: string;
  baseTextDiff?: string;
  created?: IsoDateString;
  domain?: RecordIdString;
  down?: boolean;
  id: string;
  lastShotDiff?: string;
  lastTextDiff?: string;
  screenshot?: string;
  snapshot?: string;
  updated?: IsoDateString;
};

export type ChecksResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<ChecksRecord>;

export type CollectionRecords = {
  _authOrigins: AuthoriginsRecord;
  _externalAuths: ExternalauthsRecord;
  _mfas: MfasRecord;
  _otps: OtpsRecord;
  _superusers: SuperusersRecord;
  checks: ChecksRecord;
  domains: DomainsRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  _authOrigins: AuthoriginsResponse;
  _externalAuths: ExternalauthsResponse;
  _mfas: MfasResponse;
  _otps: OtpsResponse;
  _superusers: SuperusersResponse;
  checks: ChecksResponse;
  domains: DomainsResponse;
  users: UsersResponse;
};

export type DomainsRecord = {
  agency?: string;
  archiveUrl?: string;
  baseImage?: string;
  baseSnapshot?: string;
  branch?: DomainsBranchOptions;
  created?: IsoDateString;
  dead?: boolean;
  favicon?: string;
  id: string;
  office?: string;
  otherRedirect?: string;
  redirection?: RecordIdString;
  rss?: string;
  updated?: IsoDateString;
  url?: string;
  x?: string;
};

export type DomainsResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<DomainsRecord>;

export type ExternalauthsRecord = {
  collectionRef: string;
  created?: IsoDateString;
  id: string;
  provider: string;
  providerId: string;
  recordRef: string;
  updated?: IsoDateString;
};
export type ExternalauthsResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<ExternalauthsRecord>;

export type HTMLString = string;

// Alias types for improved usability
export type IsoDateString = string;
export type MfasRecord = {
  collectionRef: string;
  created?: IsoDateString;
  id: string;
  method: string;
  recordRef: string;
  updated?: IsoDateString;
};
export type MfasResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MfasRecord>;
export type OtpsRecord = {
  collectionRef: string;
  created?: IsoDateString;
  id: string;
  password: string;
  recordRef: string;
  sentTo?: string;
  updated?: IsoDateString;
};
export type OtpsResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<OtpsRecord>;
export type RecordIdString = string;
export type SuperusersRecord = {
  created?: IsoDateString;
  email: string;
  emailVisibility?: boolean;
  id: string;
  password: string;
  tokenKey: string;
  updated?: IsoDateString;
  verified?: boolean;
};
export type SuperusersResponse<Texpand = unknown> = AuthSystemFields<Texpand> & Required<SuperusersRecord>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>;
  collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>;
  collection(idOrName: '_mfas'): RecordService<MfasResponse>;
  collection(idOrName: '_otps'): RecordService<OtpsResponse>;
  collection(idOrName: '_superusers'): RecordService<SuperusersResponse>;
  collection(idOrName: 'checks'): RecordService<ChecksResponse>;
  collection(idOrName: 'domains'): RecordService<DomainsResponse>;
  collection(idOrName: 'users'): RecordService<UsersResponse>;
};

export type UsersRecord = {
  avatar?: string;
  created?: IsoDateString;
  email: string;
  emailVisibility?: boolean;
  id: string;
  name?: string;
  password: string;
  tokenKey: string;
  updated?: IsoDateString;
  verified?: boolean;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type UsersResponse<Texpand = unknown> = AuthSystemFields<Texpand> & Required<UsersRecord>;
