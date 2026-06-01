/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Cpu, Globe, Rocket, HelpCircle } from 'lucide-react';
import PhoneEmulator from './components/PhoneEmulator';
import DevTools from './components/DevTools';
import { mockProducts } from './data/products';
import { mockProjectFiles } from './data/files';
import { ConsoleLog, ConfigState } from './types';

export default function App() {
  // Configurable branding parameters (ConfigState)
  const [config, setConfig] = useState<ConfigState>({
    appName: 'tbh 野兽派家居',
    brandSlogan: '「夏日冒险岛」限定家纺系列',
    ambassadorName: '宋雨琦',
    ambassadorTitle: 'tbh家居品牌代言人',
    couponAmount: 100,
    bannerColor: '#E7926C',
    accentColor: '#111111'
  });

  // Navigation tab states
  const [activeTab, setActiveTab] = useState<'index' | 'list' | 'store' | 'user'>('index');

  // Logs stream tracker
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: 'init-1',
      timestamp: '14:38:03',
      type: 'info',
      source: 'system',
      message: '成功载入 @dcloudio/types 微信平台规范指令绑定。'
    },
    {
      id: 'init-2',
      timestamp: '14:38:03',
      type: 'success',
      source: 'compiler.api',
      message: 'Tailwind CSS v4.0.0 语法解析引擎启动成功！weapp-tailwindcss v4.0.0 核心转换服务已在 Vite 热启动钩子中注册。'
    },
    {
      id: 'init-3',
      timestamp: '14:38:04',
      type: 'info',
      source: 'compiler.api',
      message: '正在扫描项目模板并重塑小程序 CSS 规则...'
    }
  ]);

  // Log generator callback
  const handleLogEvent = (
    type: 'info' | 'warn' | 'success' | 'error',
    source: string,
    message: string
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: ConsoleLog = {
      id: `m-log-${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      type,
      source,
      message
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic top tech bar */}
      <div className="bg-neutral-900 border-b border-neutral-800/60 px-6 py-2.5 flex justify-between items-center text-xs text-neutral-400 select-none">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-neutral-200">微信版本环境:</strong>
            <span className="font-mono text-zinc-400">iOS WeChat v8.0.50</span>
          </span>
          <span className="hidden sm:inline-block text-neutral-700">|</span>
          <span className="hidden sm:flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <strong className="text-neutral-200">开发语言规范:</strong>
            <span className="font-mono text-zinc-400">TypeScript 4.9.5 (Bundler)</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-neutral-950/80 px-2.5 py-1 rounded border border-neutral-800 text-[10px] font-mono">
          <Rocket className="w-3 h-3 text-yellow-300 animate-pulse" />
          <span>Vite Hot HMR Module Live Listening</span>
        </div>
      </div>

      {/* Main Container display layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col space-y-6 md:space-y-8">
        
        {/* Title and presentation branding text */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 select-none pb-4 border-b border-neutral-900">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-950/40 border border-indigo-900/50 w-max px-3 py-1 rounded-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WeChat Mini Program Sandbox Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-2 font-sans">
              野兽派 &amp; tbh 联名大展
            </h1>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-2xl">
              探索结合了 <strong className="text-neutral-200">Uni-app + Vue3 + TypeScript + Tailwind CSS v4 + weapp-tailwindcss v4</strong> 技术栈的奢侈生活馆微信小程序真机实感。左侧为手机端真实交互界面，右侧为开发者后台及核心源码清单。
            </p>
          </div>
          
          <div className="flex items-center space-x-3.5 shrink-0">
            <a 
              href="https://developers.weixin.qq.com/miniprogram/dev/framework/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 px-4 py-2 hover:text-white transition-all flex items-center space-x-1.5"
            >
              <HelpCircle className="w-4 h-4 text-neutral-500" />
              <span>微信官方文档</span>
            </a>
          </div>
        </section>

        {/* Side-by-side interactive playground */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Column A: Physical Phone simulator mockup (Takes 5 cols of grid) */}
          <div className="lg:col-span-5 flex justify-center">
            <PhoneEmulator 
              config={config}
              products={mockProducts}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLog={handleLogEvent}
            />
          </div>

          {/* Column B: WeChat Developer tools mimicking panels (Takes 7 cols of grid) */}
          <div className="lg:col-span-7">
            <DevTools 
              files={mockProjectFiles}
              config={config}
              setConfig={setConfig}
              logs={logs}
              onClearLogs={handleClearLogs}
              onLog={handleLogEvent}
            />
          </div>

        </section>

      </main>

      {/* Global mini elegant footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 select-none py-6 text-center text-[10px] text-zinc-600 mt-auto">
        <p>© 2026 THE BEAST ART DESIGN &amp; tbh CO-BRANDED PREVIEW PLATFORM.</p>
        <p className="mt-1 font-mono">Powered by Vite 5.2.0, React 19, Tailwind CSS v4.0.0, weapp-tailwindcss v4.0.0.</p>
      </footer>

    </div>
  );
}
