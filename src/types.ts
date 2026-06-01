/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  colors?: string[];
  specs?: string[];
  rating?: number;
}

export interface ConsoleLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warn' | 'success' | 'error';
  source: string;
  message: string;
}

export interface FileEntry {
  path: string;
  name: string;
  language: 'json' | 'javascript' | 'typescript' | 'html' | 'css';
  content: string;
}

export interface ConfigState {
  appName: string;
  brandSlogan: string;
  ambassadorName: string;
  ambassadorTitle: string;
  couponAmount: number;
  bannerColor: string;
  accentColor: string;
}
