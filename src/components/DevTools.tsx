/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderTree, 
  Terminal, 
  Settings, 
  Sliders, 
  Copy, 
  Check, 
  RefreshCw, 
  Code, 
  FileCode, 
  Trash2, 
  Download, 
  Layers, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { ConsoleLog, FileEntry, ConfigState } from '../types';

interface DevToolsProps {
  files: FileEntry[];
  config: ConfigState;
  setConfig: React.Dispatch<React.SetStateAction<ConfigState>>;
  logs: ConsoleLog[];
  onClearLogs: () => void;
  onLog: (type: 'info' | 'warn' | 'success' | 'error', source: string, message: string) => void;
}

export default function DevTools({
  files,
  config,
  setConfig,
  logs,
  onClearLogs,
  onLog
}: DevToolsProps) {
  // Tabs: 'source' | 'config' | 'logs' | 'docs'
  const [activeTab, setActiveTab] = useState<'source' | 'config' | 'logs' | 'docs'>('source');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(3); // Default to splash.vue
  const [copiedIndex, setCopiedIndex] = useState<boolean>(false);
  const [editingConfig, setEditingConfig] = useState<ConfigState>({ ...config });
  const [isSaved, setIsSaved] = useState(false);

  // Helper colors
  const presetColors = [
    { name: '夏日蜜桃', color: '#E7926C', text: '#FFFFFF' },
    { name: '野兽玫瑰', color: '#B33E3E', text: '#FFFFFF' },
    { name: '经典雅黑', color: '#111111', text: '#FFFFFF' },
    { name: '椰风森林', color: '#2E5B42', text: '#FFFFFF' },
    { name: '紫罗静谧', color: '#7B5EA6', text: '#FFFFFF' }
  ];

  // Copy code handler
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(true);
    onLog('success', 'devtools.api', `已一键复制文件 [${files[selectedFileIndex].name}] 核心源码至剪切板`);
    setTimeout(() => setCopiedIndex(false), 2000);
  };

  // Live save handler
  const handleUpdateConfig = (key: keyof ConfigState, value: any) => {
    const updated = { ...editingConfig, [key]: value };
    setEditingConfig(updated);
    setConfig(updated); // Live preview binding
    onLog('info', 'devtools.api', `配置热重载: ${key} -> ${value}`);
  };

  const handleSaveAllConfig = () => {
    setConfig(editingConfig);
    setIsSaved(true);
    onLog('success', 'devtools.api', '🎉 全局环境参数已写盘应用成功！小程序实时渲染视图热更新。');
    setTimeout(() => setIsSaved(false), 1500);
  };

  const handlePresetSelect = (preset: typeof presetColors[0]) => {
    handleUpdateConfig('bannerColor', preset.color);
    onLog('success', 'theme.js', `主题变更为: ${preset.name} (${preset.color})`);
  };

  return (
    <div className="w-full h-[812px] bg-neutral-900 rounded-3xl border border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col font-sans select-none text-neutral-300">
      
      {/* Top Title Bar of WeChat DevTools Mockups */}
      <div className="bg-neutral-950 px-5 py-3 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          {/* Mock Red Yellow Green Window Controls */}
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="w-[1px] h-4 bg-neutral-800 mx-1" />
          <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
            <img 
              src="https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=80&q=80" 
              alt="Mini App Logo" 
              className="w-4.5 h-4.5 rounded-full object-cover shrink-0 border border-neutral-700/60"
              referrerPolicy="no-referrer"
            />
            <span>微信开发者工具 MP-DevTools [Uni-app v3]</span>
          </div>
        </div>

        {/* Mini status details on stack */}
        <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Compiler: Vite v5.2.0 | Tailwind v4.0</span>
        </div>
      </div>

      {/* Main DevTools ToolBar (Buttons like compile, compile success, clear logs, docs) */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-2 flex items-center justify-between shrink-0 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex space-x-1.5">
          <button 
            onClick={() => {
              setActiveTab('source');
              onLog('info', 'compiler.api', '重新分析 WXML 模版及 AST 状态');
            }}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'source' ? 'bg-neutral-800 text-white font-semibold' : 'hover:bg-neutral-800/40 text-neutral-400'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>核心源码 (WXML/JS)</span>
          </button>

          <button 
            onClick={() => setActiveTab('config')}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'config' ? 'bg-neutral-800 text-white font-semibold' : 'hover:bg-neutral-800/40 text-neutral-400'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>热重载参数 (Live Config)</span>
          </button>

          <button 
            onClick={() => {
              setActiveTab('logs');
              onLog('info', 'devtools.api', '打开运行日志控制台');
            }}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded transition-colors cursor-pointer relative ${
              activeTab === 'logs' ? 'bg-neutral-800 text-white font-semibold' : 'hover:bg-neutral-800/40 text-neutral-400'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>调试终端 Console</span>
            {logs.length > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-amber-500 text-neutral-950 font-bold font-mono text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-neutral-900">
                {logs.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'docs' ? 'bg-neutral-800 text-white font-semibold' : 'hover:bg-neutral-800/40 text-neutral-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>技术栈指南 Docs</span>
          </button>
        </div>

        {/* Dynamic Action Panel */}
        <button 
          onClick={() => {
            onLog('warn', 'compiler.api', '✨ 发起项目热清档重新编译 [pnpm run dev:mp-weixin]...');
            setTimeout(() => {
              onLog('success', 'compiler.api', '编译打包完成。生成 6 组 WXML 模板区块，AST 文件映射就位。实时渲染已对齐。');
            }, 800);
          }}
          className="bg-neutral-800 hover:bg-neutral-700 hover:text-white px-2.5 py-1 text-[11px] rounded flex items-center space-x-1 border border-neutral-700/60 transition-colors cursor-pointer active:scale-95 text-neutral-300 font-mono"
        >
          <RefreshCw className="w-3 h-3" />
          <span>重新编译</span>
        </button>
      </div>

      {/* Primary Panels Display container */}
      <div className="flex-1 min-h-0 flex bg-neutral-950">
        
        {/* TAB 1: SOURCE FILES PREVIEW */}
        {activeTab === 'source' && (
          <div className="flex-1 flex min-h-0 divide-x divide-neutral-800">
            
            {/* Left page selection listing */}
            <div className="w-[180px] bg-neutral-900/40 py-3 flex flex-col overflow-y-auto no-scrollbar justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-zinc-600 block px-4.5 mb-2.5 tracking-wider">
                  📂 项目工程目录 (Uni-App)
                </span>
                <nav className="space-y-0.5 px-2">
                  {files.map((file, idx) => (
                    <button
                      key={file.path}
                      onClick={() => {
                        setSelectedFileIndex(idx);
                        onLog('info', 'page-editor.js', `DevTools 打开工程文件: ${file.path}`);
                      }}
                      className={`w-full text-left py-1.5 px-3.5 rounded-md flex items-center space-x-2 text-xs truncate transition-all cursor-pointer ${
                        selectedFileIndex === idx 
                          ? 'bg-neutral-800 text-emerald-400 font-medium border border-neutral-700/50 shadow' 
                          : 'text-neutral-400 hover:bg-neutral-800/30 hover:text-white'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${selectedFileIndex === idx ? 'text-emerald-400' : 'text-neutral-500'}`} />
                      <span className="truncate">{file.path}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 bg-neutral-900/60 m-2.5 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-zinc-500 font-mono tracking-wide flex items-center space-x-1">
                  <Layers className="w-3 h-3 text-indigo-400" />
                  <span>工程规范</span>
                </span>
                <p className="text-[9.5px] text-neutral-400 leading-relaxed mt-1.5">
                  所有代码均符合 <strong className="text-zinc-300">weapp-tailwindcss v4</strong> WXML 类名规范与 <strong className="text-zinc-300">TS 4.9</strong> 原生类型约定。
                </p>
              </div>
            </div>

            {/* Right file contents container with custom highlighter */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#1E1E1E]">
              {/* Filename banner */}
              <div className="px-4.5 py-2.5 bg-neutral-900 border-b border-neutral-800/80 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-mono font-bold text-neutral-200">{files[selectedFileIndex].path}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-neutral-800 rounded font-mono text-neutral-500 font-bold border border-neutral-700/60">
                    {files[selectedFileIndex].language}
                  </span>
                </div>
                
                {/* One click copying utility */}
                <button
                  onClick={() => handleCopyCode(files[selectedFileIndex].content)}
                  className="text-[11px] font-medium text-neutral-400 hover:text-white flex items-center space-x-1 bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 border border-neutral-700/60 transition-colors rounded-none cursor-pointer"
                >
                  {copiedIndex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex ? '已复制！' : '复制代码'}</span>
                </button>
              </div>

              {/* Code viewer workspace */}
              <div className="flex-1 overflow-auto p-4.5 font-mono text-xs leading-relaxed tracking-tight text-zinc-300 selection:bg-emerald-500/20 selection:text-emerald-300 no-scrollbar">
                {files[selectedFileIndex].content.split('\n').map((line, index) => {
                  let lineClass = "text-zinc-400";
                  if (line.trim().startsWith('import') || line.trim().startsWith('const') || line.trim().startsWith('let') || line.trim().startsWith('export')) {
                    lineClass = "text-purple-400";
                  } else if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
                    lineClass = "text-zinc-500 italic";
                  } else if (line.trim().includes('<template>') || line.trim().includes('</template>') || line.trim().includes('<view') || line.trim().includes('</view>') || line.trim().includes('</text>')) {
                    lineClass = "text-sky-400";
                  } else if (line.trim().includes('class="') || line.trim().includes(':class="')) {
                    lineClass = "text-amber-300";
                  }
                  
                  return (
                    <div key={index} className="flex hover:bg-neutral-800/40 transition-colors">
                      <span className="w-8 select-none text-zinc-600 text-right pr-3.5 text-[10px] border-r border-neutral-800/50 mr-3.5">
                        {index + 1}
                      </span>
                      <span className={`${lineClass} whitespace-pre-wrap flex-1`}>{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE CONFIGURATOR INPUT PANEL */}
        {activeTab === 'config' && (
          <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-5.5 select-none text-neutral-300">
            <div className="border-b border-neutral-800 pb-3 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-neutral-100">联名展销配置热更新 (WeChat Environment Config)</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* App banner text item */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 block uppercase">微信小程序名称 App Name</label>
                <input 
                  type="text" 
                  value={editingConfig.appName}
                  onChange={(e) => handleUpdateConfig('appName', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 rounded p-2.5 text-xs text-neutral-100 placeholder-zinc-600 focus:outline-none"
                  placeholder="e.g. tbh 野兽派家居"
                />
              </div>

              {/* Slogan title customization */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 block uppercase">主推口号 Slogan</label>
                <input 
                  type="text" 
                  value={editingConfig.brandSlogan}
                  onChange={(e) => handleUpdateConfig('brandSlogan', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 rounded p-2.5 text-xs text-neutral-100 focus:outline-none"
                  placeholder="e.g. 「我心童真」生日限定系列"
                />
              </div>

              {/* Ambassador name configuration */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 block uppercase">代言人姓名 Ambassador Name</label>
                <input 
                  type="text" 
                  value={editingConfig.ambassadorName}
                  onChange={(e) => handleUpdateConfig('ambassadorName', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 rounded p-2.5 text-xs text-neutral-100 focus:outline-none"
                  placeholder="e.g. 宋雨琦"
                />
              </div>

              {/* Ambassador campaign subtitle detail designation */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 block uppercase">代言人头衔 Title Description</label>
                <input 
                  type="text" 
                  value={editingConfig.ambassadorTitle}
                  onChange={(e) => handleUpdateConfig('ambassadorTitle', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 rounded p-2.5 text-xs text-neutral-100 focus:outline-none"
                  placeholder="e.g. tbh家居品牌代言人"
                />
              </div>

              {/* Newcomer Coupon amount slider configuration */}
              <div className="space-y-1.5 col-span-2">
                <div className="flex justify-between items-baseline select-none">
                  <label className="text-[11px] font-mono text-neutral-400 block uppercase">新人卡券大礼包额度 Coupon Discount</label>
                  <span className="text-xs font-bold text-emerald-400 font-mono">¥{editingConfig.couponAmount}</span>
                </div>
                <div className="flex items-center space-x-3.5">
                  <span className="text-[10px] font-mono text-zinc-600">¥10</span>
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10"
                    value={editingConfig.couponAmount}
                    onChange={(e) => handleUpdateConfig('couponAmount', Number(e.target.value))}
                    className="flex-1 accent-emerald-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-zinc-600">¥500</span>
                </div>
              </div>

              {/* Visual brand colors definition and templates selection */}
              <div className="space-y-2 col-span-2">
                <label className="text-[11px] font-mono text-neutral-400 block uppercase">小程序主打系列色调 Active Banner Theme</label>
                
                {/* Visual blocks */}
                <div className="grid grid-cols-5 gap-2.5">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      className={`rounded p-2.5 flex flex-col items-center justify-between font-medium space-y-1 text-center text-[10px] shrink-0 border transition-all cursor-pointer ${
                        editingConfig.bannerColor === preset.color 
                          ? 'border-emerald-500 shadow ring-1 ring-emerald-500/50 bg-neutral-800/80 text-white' 
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full shadow border border-neutral-700" style={{ backgroundColor: preset.color }} />
                      <span className="line-clamp-1">{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <span className="text-[10px] font-mono text-zinc-500">自定义十六进制色值:</span>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded border border-neutral-800 shrink-0" style={{ backgroundColor: editingConfig.bannerColor }} />
                    <input 
                      type="text" 
                      value={editingConfig.bannerColor}
                      onChange={(e) => handleUpdateConfig('bannerColor', e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 font-mono text-xs text-white max-w-[90px] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save details check box and triggers */}
            <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between select-none">
              <span className="text-[10px] text-zinc-500 text-left block leading-relaxed max-w-[280px]">
                修改这些设置将立时动态同步至左侧手机端小程序模拟层。无需重起进程
              </span>
              <button
                onClick={handleSaveAllConfig}
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs px-4 py-2 flex items-center space-x-1.5 transition-colors cursor-pointer select-none"
              >
                {isSaved ? <Check className="w-4 h-4 shrink-0" /> : <Settings className="w-4 h-4 shrink-0" />}
                <span>{isSaved ? '生效应用中...' : '持久保存并热更新'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: WECHAT DEBUGGER CONSOLE LOGS */}
        {activeTab === 'logs' && (
          <div className="flex-1 flex flex-col min-h-0 bg-neutral-950">
            {/* Console Toolbar menu */}
            <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-800/80 flex justify-between items-center select-none shrink-0">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-400">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>Console 输出日志流 [Filter: All]</span>
              </div>
              <button
                onClick={() => {
                  onClearLogs();
                  onLog('info', 'console', '调试器已清空控制台日志数据。随时追踪小程序生命周期。');
                }}
                className="text-[10px] text-zinc-500 hover:text-rose-400 hover:bg-neutral-800/80 p-1.5 rounded transition-all cursor-pointer flex items-center space-x-1"
                title="清空日志"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清空</span>
              </button>
            </div>

            {/* Action stream flow list */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2.5 leading-normal no-scrollbar">
              {logs.length === 0 ? (
                <div className="py-20 text-center text-zinc-600">
                  <Terminal className="w-7 h-7 mx-auto mb-2 opacity-20" />
                  <span>等待用户点击并在小程序中开展交互...</span>
                </div>
              ) : (
                logs.map((log) => {
                  let badgeColor = "bg-blue-950/40 text-blue-400 border-blue-900/50";
                  let logTextColor = "text-neutral-300";
                  if (log.type === 'warn') {
                    badgeColor = "bg-amber-950/40 text-amber-400 border-amber-900/50";
                    logTextColor = "text-amber-300/90";
                  } else if (log.type === 'success') {
                    badgeColor = "bg-emerald-950/40 text-emerald-400 border-emerald-950/70";
                    logTextColor = "text-zinc-200";
                  } else if (log.type === 'error') {
                    badgeColor = "bg-rose-950/40 text-rose-400 border-rose-900/80";
                    logTextColor = "text-rose-300";
                  }

                  return (
                    <div key={log.id} className="flex flex-col space-y-0.5 border-b border-neutral-900 pb-2.5 group">
                      <div className="flex items-baseline justify-between select-none">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9.5px] font-medium font-sans text-neutral-500">
                            {log.timestamp}
                          </span>
                          <span className={`text-[9px] uppercase px-1 py-0.5 rounded border ${badgeColor} font-bold scale-[0.9] origin-left`}>
                            {log.type}
                          </span>
                          <span className="text-zinc-500 text-[10px]">
                            [{log.source}]
                          </span>
                        </div>
                      </div>
                      <p className={`text-xs pl-0.5 mt-1 ${logTextColor} whitespace-pre-wrap font-mono leading-relaxed break-all`}>
                        {log.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STACK TECHNICAL GUIDES */}
        {activeTab === 'docs' && (
          <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-5 select-none text-neutral-300">
            <div className="border-b border-neutral-800 pb-3 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-neutral-100">技术栈架构说明（微程序集成）</h4>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-neutral-400">
              <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-lg p-4 space-y-2.5">
                <span className="font-bold text-zinc-200 block text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <span>1. weapp-tailwindcss v4 的核心重要性</span>
                </span>
                <p>
                  由于微信小程序底层所采用的是 WXML 容器，对于常规 HTML 中的特殊多字符类名（比如带有冒号、百分数或斜杠的选择器 <code>lg:hover:bg-neutral-50</code> / <code>w-11/12</code> 等）无法直接识别运行。
                </p>
                <p>
                  <code>weapp-tailwindcss</code> 作为一个重磅的 Vite 编译插件，会在项目打包到 <code>mp-weixin</code> 输出时，<strong>自动、快速地在代码提取层面剔除与重写转换这些样式类</strong>。从而实现我们在开发阶段可以无痛地写着全套 Tailwind v4 规范，输出依然完美兼容小程序。
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-lg p-4 space-y-2.5">
                <span className="font-bold text-zinc-200 block text-xs flex items-center space-x-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. 类型定义与打包声明 (@dcloudio/types)</span>
                </span>
                <p>
                  集成了 <code>@dcloudio/types</code>（版本3.4/Vue3）为全局编译器注入完整的微信 API 类型提示（包括 <code>uni.switchTab</code>, <code>uni.navigateTo</code>, <code>wx.requestPayment</code> 等）。无需任何复杂的额外声明配置，开箱即用。
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-lg p-4 space-y-2.5">
                <span className="font-bold text-zinc-200 block text-xs flex items-center space-x-1.5">
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>3. 生产发布与真机预览流程</span>
                </span>
                <p className="border-l-2 border-neutral-700 pl-3.5 text-zinc-400 font-mono text-[11px]">
                  # 第一步: 从核心源码签出本工程模板到一个空文件夹<br />
                  # 第二步: 本地运行安装依赖包<br />
                  pnpm install<br /><br />
                  # 第三步: 编译针对微信平台的包体<br />
                  pnpm run dev:mp-weixin<br /><br />
                  # 第四步: 打开【微信开发者工具】，【导入项目】指向【dist/dev/mp-weixin】文件夹，即可在真机预览扫码！
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
