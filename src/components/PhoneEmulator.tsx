/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Battery, 
  ChevronLeft, 
  MoreHorizontal, 
  Circle, 
  ShoppingBag, 
  Heart, 
  Share2, 
  X, 
  Plus, 
  Minus, 
  Check, 
  Sparkle, 
  ArrowRight,
  SlidersHorizontal,
  Home,
  Grid
} from 'lucide-react';
import { Product, ConfigState } from '../types';

interface PhoneEmulatorProps {
  config: ConfigState;
  products: Product[];
  activeTab: 'index' | 'list';
  setActiveTab: (tab: 'index' | 'list') => void;
  onLog: (type: 'info' | 'warn' | 'success' | 'error', source: string, message: string) => void;
}

export default function PhoneEmulator({
  config,
  products,
  activeTab,
  setActiveTab,
  onLog
}: PhoneEmulatorProps) {
  // Navigation internal state inside WeChat
  const [currentPage, setCurrentPage] = useState<'splash' | 'index' | 'list'>('splash');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number; spec: string; color: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentFilterCategory, setCurrentFilterCategory] = useState<string>('全部');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  
  // Custom interactive spec states inside product drawer
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // WeChat Payment Simulation State
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'input' | 'processing' | 'success'>('idle');

  // Automatic splash timeout
  useEffect(() => {
    if (currentPage === 'splash') {
      onLog('info', 'app.js', '微信小程序/智能框架初起初始化中...');
      onLog('info', 'page/splash/splash.js', 'Splash 启动页加载完成，等待跳转...');
      const timer = setTimeout(() => {
        setCurrentPage('index');
        onLog('success', 'app.js', 'Splash 结束，路由重定向[wx.switchTab]至 /pages/index/index');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Update selected specs when a product changes
  useEffect(() => {
    if (selectedProduct) {
      setSelectedSpec(selectedProduct.specs?.[0] || '标准版');
      setSelectedColor(selectedProduct.colors?.[0] || '经典款');
      setQuantity(1);
    }
  }, [selectedProduct]);

  // Fast Tab Switching Logger
  const handleTabChange = (tab: 'index' | 'list') => {
    if (currentPage === 'splash') return;
    setActiveTab(tab);
    setCurrentPage(tab);
    onLog('info', 'app.json', `TabBar点击切换: ${tab === 'index' ? '首页(/pages/index/index)' : '分类/选购(/pages/product/list)'}`);
  };

  // Skip splash direct interaction
  const skipSplash = () => {
    setCurrentPage('index');
    onLog('success', 'page/splash/splash.js', '用户手动跳过启动页');
  };

  // Add Product to Cart Action
  const addToCart = () => {
    if (!selectedProduct) return;
    
    const existingIndex = cart.findIndex(
      item => item.product.id === selectedProduct.id && 
              item.spec === selectedSpec && 
              item.color === selectedColor
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, {
        product: selectedProduct,
        quantity,
        spec: selectedSpec,
        color: selectedColor
      }]);
    }

    onLog('success', 'cart.js', `已添至购物车: ${selectedProduct.title} | 规格: ${selectedSpec} | 数量: ${quantity}`);
    setSelectedProduct(null); // Close Drawer
    setIsCartOpen(true); // Open Cart to show feedback
  };

  // Compute Cart Summary
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Simulated Checkout payment
  const handleCheckoutInit = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setShowPayModal(true);
    setPaymentStep('input');
    onLog('info', 'pay.api', `开启微信支付流程，订单应付总额: ¥${cartTotalAmount.toLocaleString()}`);
  };

  const handleConfirmPayment = () => {
    setPaymentStep('processing');
    onLog('info', 'pay.api', '向网关发送微信预支付单据 [wx.requestPayment]...');
    
    setTimeout(() => {
      setPaymentStep('success');
      onLog('success', 'pay.api', `支付成功! 交易流流水号: BEAST_PAY_2026_0601_${Math.floor(Math.random() * 89999) + 10000}`);
      onLog('success', 'order.js', '已成功分配顺丰冷链特惠/奢品专递运单，即将进入发货配货序列');
    }, 1800);
  };

  const closePayment = () => {
    if (paymentStep === 'success') {
      setCart([]); // Clear cart upon successful payment
    }
    setShowPayModal(false);
    setPaymentStep('idle');
  };

  // Filtered Products list based on current active filters
  const filteredProducts = products.filter(product => {
    if (currentFilterCategory === '全部') return true;
    return product.category === currentFilterCategory;
  }).sort((a, b) => {
    if (priceSort === 'asc') return a.price - b.price;
    if (priceSort === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="relative flex flex-col items-center">
      {/* Dynamic Header Badge for Status */}
      <div className="mb-4 flex items-center space-x-2 text-xs text-gray-500 bg-gray-100/80 backend-badge px-3 py-1.5 rounded-full shadow-sm select-none border border-gray-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono font-medium text-gray-700">WeChat IP: 127.0.0.1:3000 | Dev Mode</span>
      </div>

      {/* iPhone Device Wrapper */}
      <div className="relative w-[390px] h-[812px] rounded-[56px] ring-[14px] ring-neutral-900 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden border-[4px] border-neutral-800 select-none">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-3xl z-50 flex items-center justify-between px-3.5">
          {/* Camera aperture and sensor subtle graphics */}
          <div className="w-3.5 h-3.5 bg-neutral-900 rounded-full border border-neutral-800/40 relative">
            <div className="absolute top-1 left-1 w-1 h-1 bg-indigo-950 rounded-full" />
          </div>
          <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
          <div className="w-[18px] h-2 bg-neutral-950 rounded-lg relative overflow-hidden">
            <div className="absolute top-0.5 left-0.5 w-[6px] h-1 bg-green-500 rounded-sm" />
          </div>
        </div>

        {/* WeChat Screen Overlay Frame - Phone contents */}
        <div className="w-full h-full flex flex-col bg-[#F8F9FA] relative text-neutral-800 overflow-hidden text-sm">
          
          {/* Custom WeChat Header & Capsule Menu */}
          <div 
            className="w-full pt-[46px] pb-2 px-4 flex items-center justify-between z-40 border-b relative shrink-0 transition-colors duration-300"
            style={{
              backgroundColor: currentPage === 'index' ? config.bannerColor : '#FFFFFF',
              borderColor: currentPage === 'index' ? 'transparent' : '#F1F3F5',
              color: currentPage === 'index' ? '#FFFFFF' : '#111111'
            }}
          >
            {/* Left Back or Home Navigation Icon */}
            <div className="flex items-center min-w-[60px]">
              {currentPage === 'list' && (
                <button 
                  onClick={() => handleTabChange('index')}
                  className="flex items-center text-xs space-x-0.5 hover:opacity-75 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5 shrink-0" />
                  <span>首页</span>
                </button>
              )}
              {currentPage === 'index' && (
                <span className="font-serif font-bold text-lg tracking-wider">tbh</span>
              )}
              {currentPage === 'splash' && (
                <span className="text-xs opacity-40 font-mono">BOOTING</span>
              )}
            </div>

            {/* Current Page WeChat Title bar title */}
            <div className="text-center font-semibold text-sm max-w-[140px] truncate">
              {currentPage === 'splash' ? '' : currentPage === 'index' ? config.appName : '选购精品'}
            </div>

            {/* Right Standard WeChat Capsule Button (胶囊按钮) */}
            <div 
              className="flex items-center justify-between w-[80px] h-[30px] rounded-full border px-2.5 space-x-1.5 shadow-sm relative shrink-0"
              style={{
                backgroundColor: currentPage === 'index' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.85)',
                borderColor: currentPage === 'index' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                color: currentPage === 'index' ? '#FFFFFF' : '#111111'
              }}
            >
              <button 
                onClick={() => {
                  onLog('info', 'capsule.api', '触发微信右上角 [Menu] 控制菜单：包含收藏、转发、关于、添加至桌面。');
                  alert('小程序信息:\n品牌: ' + config.appName + '\n当前页面路径: /pages/' + currentPage + '/' + currentPage + '\n技术支撑: Uni-app Vue3 + Tailwind v4');
                }}
                className="hover:opacity-75 transition-opacity"
              >
                <MoreHorizontal className="w-5 h-5 shrink-0" />
              </button>
              <div className="w-[1px] h-4 bg-gray-400/30" />
              <button 
                onClick={() => {
                  onLog('warn', 'capsule.api', '微信小程序重载 [wx.reLaunch] 回到启动页');
                  setCurrentPage('splash');
                }}
                className="hover:opacity-75 transition-opacity"
              >
                <Circle className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              </button>
            </div>
          </div>

          {/* Phone Screen Core Content Flow */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* PAGE 1: SPLASH SCREEN */}
              {currentPage === 'splash' && (
                <motion.div
                  key="splash-page"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white flex flex-col items-center justify-between pb-16 pt-32 z-10"
                >
                  <div />
                  {/* BEAST Signature High-Contrast Serif Logo */}
                  <div className="flex flex-col items-center space-y-4">
                    <motion.div 
                      initial={{ scale: 0.93, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="flex items-baseline tracking-[0.25em]"
                    >
                      <span className="text-5xl font-serif font-black text-black">B</span>
                      <span className="text-4xl font-serif text-gray-300 ml-1">EAST</span>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 0.8 }}
                      className="text-xs font-mono tracking-widest text-neutral-500"
                    >
                      THE BEAST HOME &amp; ART LIVING
                    </motion.p>
                  </div>

                  {/* Intersecting load controls */}
                  <div className="flex flex-col items-center space-y-4">
                    <button 
                      onClick={skipSplash}
                      className="px-5 py-2 border border-gray-200 hover:border-gray-800 text-xs text-neutral-500 hover:text-black rounded-full font-mono tracking-widest flex items-center space-x-1.5 transition-all"
                    >
                      <span>SKIP AD</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <div className="flex items-center space-x-1.5 text-[11px] text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                      <span>正在拉取 {config.appName} 会话凭证...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAGE 2: HOME SCREEN (index) */}
              {currentPage === 'index' && (
                <motion.div
                  key="home-page"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col bg-white"
                >
                  {/* Head-cover Banner visual style inspired by "Hello Kitty x tbh" */}
                  <div 
                    className="w-full h-[320px] flex flex-col justify-end relative overflow-hidden shrink-0 border-b border-gray-100"
                    style={{ backgroundColor: config.bannerColor }}
                  >
                    {/* Ambassador background picture - Simulated illustration using fine Unsplash */}
                    <img 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-85" 
                      src="https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=600&q=80" 
                      alt="Floral Background decoration"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient top & bottom for high-contrast reading values */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-0" />

                    {/* Visual Brand Title labels */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center text-white z-10 w-full px-8 pointer-events-none">
                      <span className="text-4xl font-extrabold tracking-[0.3em] font-sans text-center inline-block">tbh</span>
                      <p className="text-[9px] tracking-[0.4em] uppercase text-white/70 mt-1">THE BEAST HOME</p>
                    </div>

                    {/* Ambassador Campaign Content Panel */}
                    <div className="relative z-10 px-6 pb-6 pt-12 flex flex-col items-center text-center text-white">
                      <div className="bg-amber-300 text-black font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 mb-1.5 inline-block select-none rounded-[2px]">
                        {config.ambassadorTitle}
                      </div>
                      <h4 className="text-xl font-black tracking-widest mt-0.5 leading-snug">
                        {config.brandSlogan}
                      </h4>
                      <p className="text-xs text-white/90 tracking-widest mt-1">
                        Hello Kitty × tbh
                      </p>

                      <button 
                        onClick={() => handleTabChange('list')}
                        className="mt-4 px-7 py-2 bg-white text-black text-xs font-bold tracking-widest hover:bg-neutral-100 transition-colors rounded-none shadow-lg transform hover:scale-105"
                      >
                        即刻选购 COLLECTION
                      </button>
                    </div>
                  </div>

                  {/* Register promotional ribbon / banner */}
                  <div className="bg-black text-white py-3 px-5 flex justify-between items-center text-xs tracking-wider select-none shrink-0">
                    <div className="flex items-center space-x-2">
                      <Sparkle className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>注册即领 <strong className="text-yellow-300">¥{config.couponAmount}</strong> 新人立折包</span>
                    </div>
                    <button 
                      onClick={() => {
                        onLog('success', 'user.js', `微信快捷注册成功，专享价值 ¥${config.couponAmount} 的大礼包优惠券已存入微信卡包 [wx.addCard]`);
                        alert(`恭喜！领券成功\n我们派发了 ¥${config.couponAmount} 的专属联名卡券到您的微信账户中。可直接抵扣床品和香氛类订单。`);
                      }}
                      className="underline font-bold hover:text-yellow-300 transition-colors"
                    >
                      立即领
                    </button>
                  </div>

                  {/* Categorical quick actions (Ribbon / Bubbles) */}
                  <div className="py-6 px-4 bg-white border-b border-gray-100 grid grid-cols-4 gap-2 shrink-0">
                    {[
                      { icon: '🎀', title: '上新', category: '全部', log: '浏览「上新/联名限定」分类' },
                      { icon: '🌸', title: '花艺', category: '花艺', log: '浏览「精品花卉艺术」分类' },
                      { icon: '🌴', title: '香氛', category: '香氛', log: '浏览「沙龙香散扩香」分类' },
                      { icon: '🏷️', title: '生活', category: '家居', log: '浏览「起居室居家/床单」分类' }
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onLog('info', 'page/index/index.js', btn.log);
                          setCurrentFilterCategory(btn.category);
                          handleTabChange('list');
                        }}
                        className="flex flex-col items-center space-y-1.5 focus:scale-95 duration-100 transition-all cursor-pointer group"
                      >
                        <div className="w-13 h-13 rounded-full border border-neutral-100 bg-neutral-50 flex items-center justify-center text-2xl group-hover:bg-neutral-100/50 transition-colors shadow-sm">
                          {btn.icon}
                        </div>
                        <span className="text-[11px] font-medium text-neutral-600 block">{btn.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Hot Recommendations Feed Grid - Exquisite Mini Catalog Cards */}
                  <div className="p-4 bg-neutral-50 flex-1">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xs font-serif font-bold text-black border-l-2 border-black pl-1.5">EDITOR&apos;S PICK</span>
                        <span className="text-[10px] text-gray-400 font-mono tracking-tighter">/ 本季主推</span>
                      </div>
                      <button 
                        onClick={() => handleTabChange('list')}
                        className="text-[10px] text-neutral-500 hover:text-black hover:underline cursor-pointer flex items-center space-x-0.5"
                      >
                        <span>查看全部</span>
                        <span>&rarr;</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Featured Big Spotlight Banner item */}
                      {products.slice(0, 1).map((prod) => (
                        <div 
                          key={prod.id} 
                          onClick={() => {
                            onLog('info', 'page/index/index.js', `用户点击精选曝光位: ${prod.title}`);
                            setSelectedProduct(prod);
                          }}
                          className="bg-white rounded-xl overflow-hidden border border-neutral-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
                        >
                          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                            <img 
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                              src={prod.image} 
                              alt={prod.title}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3 bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-sm">
                              LIMITED
                            </div>
                          </div>
                          <div className="p-4 flex justify-between items-center">
                            <div>
                              <h5 className="font-semibold text-xs text-neutral-800 line-clamp-1">{prod.title}</h5>
                              <p className="text-[10px] text-neutral-400 mt-0.5 font-mono tracking-tight">{prod.subtitle || 'Wild beasts premium'}</p>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <span className="text-xs font-bold text-neutral-950 font-mono">¥{prod.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Side by side mini list recommended slots */}
                      <div className="grid grid-cols-2 gap-3.5">
                        {products.slice(2, 4).map((prod) => (
                          <div 
                            key={prod.id}
                            onClick={() => {
                              onLog('info', 'page/index/index.js', `点击推荐位: ${prod.title}`);
                              setSelectedProduct(prod);
                            }}
                            className="bg-white rounded-lg p-3 border border-neutral-100 flex flex-col justify-between cursor-pointer hover:shadow-xs transition-shadow"
                          >
                            <div className="aspect-square w-full rounded bg-neutral-50 flex items-center justify-center p-1 relative">
                              <img className="max-h-full max-w-full object-contain" src={prod.image} alt={prod.title} referrerPolicy="no-referrer" />
                              <span className="absolute bottom-1 right-1 text-[9px] font-serif font-black bg-black/5 text-black px-1 rounded-xs">tbh</span>
                            </div>
                            <div className="mt-2 text-center">
                              <h6 className="text-[10px] text-gray-700 line-clamp-1">{prod.title}</h6>
                              <div className="mt-1 flex items-center justify-center space-x-1.5">
                                <span className="text-xs font-bold text-black">¥{prod.price}</span>
                                {prod.originalPrice && (
                                  <span className="text-[9px] text-gray-400 line-through">¥{prod.originalPrice}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAGE 3: PRODUCT GRID SCREEN (list) */}
              {currentPage === 'list' && (
                <motion.div
                  key="list-page"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col bg-neutral-50"
                >
                  {/* Category Pill select strip */}
                  <div className="bg-white border-b border-gray-100 py-2 px-3 flex space-x-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
                    {['全部', '花艺', '香氛', '床品', '家居'].map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setCurrentFilterCategory(category);
                          onLog('info', 'page/product/list.js', `过滤器变更: 显示 "${category}" 品类`);
                        }}
                        className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors border cursor-pointer font-medium ${
                          currentFilterCategory === category 
                            ? 'bg-black text-white border-black' 
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200/60 hover:bg-neutral-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Filter and Sorting strip */}
                  <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between text-[11px] text-gray-500 shrink-0 uppercase select-none">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => {
                          setPriceSort('none');
                          onLog('info', 'page/product/list.js', '排序重置为默认「综合排序」');
                        }}
                        className={`font-semibold ${priceSort === 'none' ? 'text-black font-bold' : ''}`}
                      >
                        综合
                      </button>
                      <button 
                        onClick={() => {
                          onLog('info', 'page/product/list.js', '点击「新品优先」筛选');
                          alert('提示: 当前所有商品均已是2026夏日最新「我心童真」联名新品');
                        }}
                        className="hover:text-black"
                      >
                        新品优先
                      </button>
                      <button
                        onClick={() => {
                          const nextSort = priceSort === 'asc' ? 'desc' : 'asc';
                          setPriceSort(nextSort);
                          onLog('info', 'page/product/list.js', `价格排序变更: ${nextSort === 'asc' ? '从低到高' : '从高到低'}`);
                        }}
                        className={`flex items-center space-x-0.5 hover:text-black ${priceSort !== 'none' ? 'text-black font-bold' : ''}`}
                      >
                        <span>价格</span>
                        <span className="font-sans font-normal">{priceSort === 'asc' ? '▲' : priceSort === 'desc' ? '▼' : '⇅'}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1 text-gray-400">
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>筛选</span>
                    </div>
                  </div>

                  {/* Double-column responsive product lists */}
                  <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                    {filteredProducts.length === 0 ? (
                      <div className="py-20 text-center text-gray-400 text-xs">
                        <Grid className="w-8 h-8 mx-auto mb-2 opacity-30 stroke-1" />
                        <p>该分类目前没有上架商品</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {filteredProducts.map((prod) => (
                          <div 
                            key={prod.id}
                            onClick={() => {
                              onLog('info', 'page/product/list.js', `浏览商品详情: ${prod.title}`);
                              setSelectedProduct(prod);
                            }}
                            className="bg-white rounded-lg p-3 border border-neutral-200/50 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow transition-all group"
                          >
                            <div className="aspect-square w-full rounded-md bg-neutral-50 flex items-center justify-center p-1.5 relative overflow-hidden">
                              <img 
                                className="max-h-full max-w-full object-contain group-hover:scale-103 transition-transform" 
                                src={prod.image} 
                                alt={prod.title}
                                referrerPolicy="no-referrer"
                              />
                              {prod.originalPrice && (
                                <span className="absolute top-1 left-1 bg-black text-white text-[8px] px-1.5 py-0.5 rounded-sm scale-90 origin-top-left">
                                  折
                                </span>
                              )}
                              <span className="absolute bottom-1 right-1 text-[8px] bg-gray-100 text-gray-400 px-1 rounded-sm">
                                {prod.category}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-col flex-1 justify-between">
                              <div>
                                <h3 className="text-xs font-semibold text-neutral-800 line-clamp-2 leading-relaxed min-h-[32px]">
                                  {prod.title}
                                </h3>
                                <p className="text-[9px] text-gray-400 mt-1 line-clamp-1">{prod.subtitle}</p>
                              </div>

                              <div className="mt-2.5 flex items-baseline justify-between">
                                <div className="flex items-baseline space-x-1.5">
                                  <span className="text-xs font-bold text-neutral-950 font-mono">¥{prod.price.toLocaleString()}</span>
                                  {prod.originalPrice && (
                                    <span className="text-[10px] text-gray-400 line-through font-mono">¥{prod.originalPrice.toLocaleString()}</span>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLog('info', 'page/product/list.js', `快捷选择SKU并购买: ${prod.title}`);
                                    setSelectedProduct(prod);
                                  }}
                                  className="w-5.5 h-5.5 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs hover:bg-neutral-800 focus:scale-90 transition-all cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Persistent Standard WeChat TabBar (固定底部导航栏) */}
          {currentPage !== 'splash' && (
            <div className="w-full h-[58px] bg-white border-t border-gray-100 flex items-center justify-around z-30 shrink-0 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] select-none">
              <button 
                onClick={() => handleTabChange('index')}
                className="flex flex-col items-center justify-center space-y-1 py-1 px-4 cursor-pointer transition-transform duration-100 active:scale-95"
              >
                <Home className={`w-5 h-5 ${currentPage === 'index' ? 'text-black stroke-[2.5px]' : 'text-neutral-400 stroke-[1.8px]'}`} />
                <span className={`text-[10px] font-medium leading-none ${currentPage === 'index' ? 'text-black font-semibold' : 'text-neutral-400'}`}>
                  首页
                </span>
              </button>

              <button 
                onClick={() => handleTabChange('list')}
                className="flex flex-col items-center justify-center space-y-1 py-1 px-4 cursor-pointer transition-transform duration-100 active:scale-95"
              >
                <Grid className={`w-5 h-5 ${currentPage === 'list' ? 'text-black stroke-[2.5px]' : 'text-neutral-400 stroke-[1.8px]'}`} />
                <span className={`text-[10px] font-medium leading-none ${currentPage === 'list' ? 'text-black font-semibold' : 'text-neutral-400'}`}>
                  选购
                </span>
              </button>

              <button 
                onClick={() => {
                  setIsCartOpen(true);
                  onLog('info', 'cart.js', '用户在悬浮菜单中打开了购物车面板');
                }}
                className="flex flex-col items-center justify-center space-y-1 py-1 px-4 cursor-pointer transition-transform duration-100 active:scale-95 relative"
              >
                <ShoppingBag className="w-5 h-5 text-neutral-400 stroke-[1.8px]" />
                <span className="text-[10px] font-medium leading-none text-neutral-400">
                  袋中
                </span>
                {cartTotalCount > 0 && (
                  <span className="absolute top-1 right-2 bg-red-500 text-white font-mono scale-90 text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
                    {cartTotalCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Standard iPhone Home Screen Bar Indicator (苹果底部操作长条) */}
          <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-neutral-900/50 rounded-full z-50 pointer-events-none" />

          {/* BOTTOM MODAL DRAWER 1: PRODUCT SPECIFICATION SELECTOR */}
          <AnimatePresence>
            {selectedProduct && (
              <>
                {/* Backdrop Click Mask */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedProduct(null)}
                  className="absolute inset-0 bg-black z-45"
                />

                {/* Sliding details dialog */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl min-h-[460px] max-h-[90%] overflow-y-auto no-scrollbar z-50 p-5 pb-8 flex flex-col justify-between"
                >
                  {/* Exit Cross button */}
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 hover:bg-neutral-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div>
                    {/* Header Details summary */}
                    <div className="flex space-x-4 border-b border-gray-100 pb-4">
                      <div className="w-24 h-24 rounded-lg bg-neutral-50 flex items-center justify-center border border-gray-100 shrink-0">
                        <img 
                          className="max-h-full max-w-full object-contain p-1" 
                          src={selectedProduct.image} 
                          alt="Selected product snapshot"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-6 flex flex-col justify-end">
                        <span className="text-rose-500 bg-rose-50 text-[10px] self-start px-2 py-0.5 rounded-sm font-semibold tracking-wide border border-rose-100">
                          ¥{config.couponAmount} 券可用
                        </span>
                        <h4 className="text-sm font-black text-neutral-800 line-clamp-1 mt-1.5">{selectedProduct.title}</h4>
                        <div className="mt-1.5 flex items-baseline space-x-2">
                          <span className="text-base font-bold text-neutral-950 font-mono">¥{selectedProduct.price.toLocaleString()}</span>
                          {selectedProduct.originalPrice && (
                            <span className="text-xs text-gray-400 line-through font-mono">¥{selectedProduct.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">已选: {selectedColor} / {selectedSpec}</p>
                      </div>
                    </div>

                    {/* Spec Selection 1: Color Variants (颜色分类) */}
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="py-4 border-b border-gray-100 select-none">
                        <span className="text-xs font-semibold text-neutral-700 block mb-2">样式选择 Choice</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColor(color);
                                onLog('info', 'sku.js', `用户变更产品样式: ${color}`);
                              }}
                              className={`text-xs px-3.5 py-1.5 rounded-sm cursor-pointer transition-all border ${
                                selectedColor === color 
                                  ? 'bg-black text-white border-black font-semibold' 
                                  : 'bg-neutral-50 text-neutral-600 border-neutral-200/60 hover:bg-neutral-100'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spec Selection 2: Dimensions & Features (规格型号) */}
                    {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                      <div className="py-4 border-b border-gray-100 select-none">
                        <span className="text-xs font-semibold text-neutral-700 block mb-2">规格说明 Dimensions</span>
                        <div className="flex flex-wrap gap-2.5">
                          {selectedProduct.specs.map(spec => (
                            <button
                              key={spec}
                              onClick={() => {
                                setSelectedSpec(spec);
                                onLog('info', 'sku.js', `用户选择规格变体: ${spec}`);
                              }}
                              className={`text-[11px] px-3 py-1.5 rounded-sm cursor-pointer transition-all border ${
                                selectedSpec === spec 
                                  ? 'bg-black text-white border-black font-semibold' 
                                  : 'bg-neutral-50 text-neutral-600 border-neutral-200/60 hover:bg-neutral-100'
                              }`}
                            >
                              {spec}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity selectors */}
                    <div className="py-4 flex items-center justify-between border-b border-gray-50 select-none">
                      <div>
                        <span className="text-xs font-semibold text-neutral-700 block">购买数量 Quantity</span>
                        <span className="text-[10px] text-gray-400">单笔每人限购5件</span>
                      </div>
                      <div className="flex items-center border border-gray-200 rounded">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-bold font-mono text-gray-800">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(Math.min(5, quantity + 1))}
                          disabled={quantity >= 5}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Product description statement block */}
                    <div className="py-4 text-[11px] text-gray-500 leading-relaxed bg-neutral-50 p-3 rounded mt-3">
                      <strong className="text-neutral-700 block mb-1">主打设计亮点 Design Concept:</strong>
                      {selectedProduct.description}
                    </div>
                  </div>

                  {/* Actions purchase buttons */}
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => {
                        onLog('info', 'sku.js', '点击「加入艺术袋」');
                        addToCart();
                      }}
                      className="flex-1 py-3 border border-neutral-800 text-neutral-900 font-bold hover:bg-neutral-50 text-xs tracking-widest bg-white select-none transition-colors active:bg-neutral-100 cursor-pointer text-center"
                    >
                      加入艺术袋 ADD TO CART
                    </button>
                    <button 
                      onClick={() => {
                        onLog('info', 'sku.js', '快捷结算：跳过购物车，初始化立即购买');
                        // Fast buy route adds to card then checkout
                        setCart([{
                          product: selectedProduct,
                          quantity,
                          spec: selectedSpec,
                          color: selectedColor
                        }]);
                        setSelectedProduct(null);
                        setShowPayModal(true);
                        setPaymentStep('input');
                      }}
                      className="flex-1 py-3 bg-black text-white font-bold hover:bg-neutral-900 text-xs tracking-widest select-none transition-colors active:bg-neutral-900 cursor-pointer text-center"
                    >
                      立即结算 BUY NOW
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* BOTTOM MODAL DRAWER 2: SHOPPING CART OVERLAY */}
          <AnimatePresence>
            {isCartOpen && (
              <>
                {/* Backdrop Click Mask */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCartOpen(false)}
                  className="absolute inset-0 bg-black z-45"
                />

                {/* Sliding cart dialog */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute bottom-0 inset-x-0 bg-neutral-50 rounded-t-3xl min-h-[460px] max-h-[85%] overflow-y-auto no-scrollbar z-50 p-5 pb-8 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 select-none">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-serif font-bold text-neutral-950">BEAST 购物袋</span>
                        <span className="text-xs text-gray-400 font-mono">({cartTotalCount}件商品)</span>
                      </div>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-black p-1 hover:bg-neutral-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="py-4 space-y-3.5 max-h-[280px] overflow-y-auto no-scrollbar">
                      {cart.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                          <ShoppingBag className="w-10 h-10 text-gray-300 stroke-1 mb-2" />
                          <p className="text-xs">您的购物袋是空的</p>
                          <button 
                            onClick={() => {
                              setIsCartOpen(false);
                              handleTabChange('list');
                            }}
                            className="mt-3 px-4 py-1.5 border border-black text-black text-[10px] uppercase font-bold tracking-wider"
                          >
                            立即去挑选
                          </button>
                        </div>
                      ) : (
                        cart.map((item, idx) => (
                          <div 
                            key={idx}
                            className="bg-white rounded-lg p-3 border border-neutral-200/60 flex space-x-3.5 relative"
                          >
                            {/* Product mini thumbnail */}
                            <div className="w-16 h-16 bg-neutral-50 rounded border border-gray-100 flex items-center justify-center p-0.5 shrink-0">
                              <img className="max-h-full max-w-full object-contain" src={item.product.image} alt="Thumbnail preview" referrerPolicy="no-referrer" />
                            </div>

                            {/* Info text fields */}
                            <div className="flex-1 min-w-0 pr-6 flex flex-col justify-between">
                              <div>
                                <h5 className="text-xs font-bold text-neutral-800 truncate">{item.product.title}</h5>
                                <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm inline-block mt-0.5 max-w-full truncate">
                                  {item.color} | {item.spec}
                                </span>
                              </div>
                              <div className="flex items-baseline justify-between mt-1">
                                <span className="text-xs font-bold text-neutral-950 font-mono">¥{(item.product.price * item.quantity).toLocaleString()}</span>
                                
                                {/* Inner micro counter */}
                                <div className="flex items-center border border-gray-200 rounded scale-90">
                                  <button 
                                    onClick={() => {
                                      const updated = [...cart];
                                      if (updated[idx].quantity <= 1) {
                                        updated.splice(idx, 1);
                                        onLog('warn', 'cart.js', `移出了购物车: ${item.product.title}`);
                                      } else {
                                        updated[idx].quantity -= 1;
                                        onLog('info', 'cart.js', `减少购买数量: ${item.product.title} [${updated[idx].quantity}]`);
                                      }
                                      setCart(updated);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black"
                                  >
                                    <Minus className="w-3" />
                                  </button>
                                  <span className="w-6 text-center text-[11px] font-bold font-mono text-gray-800">{item.quantity}</span>
                                  <button 
                                    onClick={() => {
                                      const updated = [...cart];
                                      updated[idx].quantity += 1;
                                      setCart(updated);
                                      onLog('info', 'cart.js', `递增购买数量: ${item.product.title} [${updated[idx].quantity}]`);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black"
                                  >
                                    <Plus className="w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Delete single Item button */}
                            <button 
                              onClick={() => {
                                const updated = [...cart];
                                updated.splice(idx, 1);
                                setCart(updated);
                                onLog('warn', 'cart.js', `清空单项商品: ${item.product.title}`);
                              }}
                              className="absolute top-2.5 right-2 text-neutral-300 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Promo coupon notice */}
                    {cart.length > 0 && (
                      <div className="bg-yellow-50 rounded border border-yellow-200/50 p-2.5 flex items-center justify-between text-[11px] text-yellow-800 select-none mb-3">
                        <span>新人大礼包已自动兑扣: <strong>-¥{config.couponAmount}</strong>立折</span>
                        <span className="bg-yellow-500 text-white font-extrabold text-[8px] px-1 rounded-sm">AUTO CODE</span>
                      </div>
                    )}
                  </div>

                  {/* Summary Footer bar and Checkout button */}
                  {cart.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-baseline mb-4 text-xs select-none px-1">
                        <span className="text-gray-500">商品原价:</span>
                        <span className="text-gray-400 line-through font-mono">¥{(cartTotalAmount + config.couponAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-baseline mb-4 px-1">
                        <span className="text-xs font-bold text-neutral-800">总计金额 Total:</span>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-black text-rose-500 font-mono">¥{Math.max(0, cartTotalAmount - config.couponAmount).toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400">已优惠-¥{config.couponAmount} | 顺丰免包邮</span>
                        </div>
                      </div>

                      <button 
                        onClick={handleCheckoutInit}
                        className="w-full py-3.5 bg-black text-white hover:bg-neutral-900 font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 rounded-none cursor-pointer"
                      >
                        <span>确认提交订单 CHECKOUT</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* HIGH-FIDELITY WECHAT PAYMENT SIMULATOR MODAL BACKGROUND */}
          <AnimatePresence>
            {showPayModal && (
              <div className="absolute inset-0 bg-black/60 z-55 flex flex-col justify-end">
                {/* Simulated Sheet sliding up */}
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 26 }}
                  className="bg-white rounded-t-2xl p-5 pb-8 flex flex-col space-y-5"
                >
                  {/* Title WeChat Pay bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <button onClick={closePayment} className="text-gray-400 hover:text-black">
                      <X className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-neutral-900">使用微信支付</span>
                    <div className="w-5" />
                  </div>

                  {paymentStep === 'input' && (
                    <div className="flex flex-col items-center py-4 text-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <span className="text-xs text-gray-500">商户: 野兽派 (BEAST ART)</span>
                      <h4 className="text-3xl font-black text-neutral-950 font-mono mt-2.5">
                        ¥{Math.max(0, cartTotalAmount - config.couponAmount).toLocaleString()}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">付款方式: 微信零钱 / 双重安全加密通道</p>

                      <div className="w-full mt-6 bg-gray-50 border border-gray-100 rounded-lg p-3 text-[11px] text-gray-600 space-y-1.5 text-left">
                        <div className="flex justify-between">
                          <span>订单编号 Description</span>
                          <span className="font-mono">BEAST_MP_{Date.now().toString().slice(-6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>优惠方式 Discount</span>
                          <span className="text-emerald-500">-¥{config.couponAmount} (新人礼包)</span>
                        </div>
                      </div>

                      <button 
                        onClick={handleConfirmPayment}
                        className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold text-xs tracking-wider rounded-none shadow-md flex items-center justify-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>立即支付 CONFIRM PAYMENT</span>
                      </button>
                    </div>
                  )}

                  {paymentStep === 'processing' && (
                    <div className="flex flex-col items-center py-10 text-center">
                      <div className="w-12 h-12 rounded-full border-4 border-solid border-emerald-500 border-t-transparent animate-spin mb-4" />
                      <span className="text-xs text-neutral-600">正在与微信支付网关建立签名握手...</span>
                      <p className="text-[10px] text-gray-400 mt-1.5">请不要退出或关闭会话</p>
                    </div>
                  )}

                  {paymentStep === 'success' && (
                    <div className="flex flex-col items-center py-6 text-center select-none">
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow"
                      >
                        <Check className="w-8 h-8 stroke-[3]" />
                      </motion.div>
                      <h5 className="text-base font-bold text-neutral-900">支付成功 Paid Successfully</h5>
                      <p className="text-xs text-neutral-400 mt-1">感谢选择 BEAST 野兽派。我们将火速安排极速发货。</p>

                      <div className="w-full mt-5 border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 text-[11px] text-gray-600 space-y-2 text-left">
                        <div className="flex justify-between">
                          <span>出单日期:</span>
                          <span className="font-mono">2026-06-01 14:38:05</span>
                        </div>
                        <div className="flex justify-between">
                          <span>实际付款:</span>
                          <span className="font-bold text-black font-mono">¥{Math.max(0, cartTotalAmount - config.couponAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>发货商户:</span>
                          <span>野兽派上海奢品艺术总仓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>运输合作:</span>
                          <span>顺丰特急冷链精专</span>
                        </div>
                      </div>

                      <button 
                        onClick={closePayment}
                        className="w-full mt-6 py-3 bg-neutral-900 hover:bg-black transition-colors text-white font-bold text-xs tracking-wider rounded-none"
                      >
                        <span>返回精品小程序</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
