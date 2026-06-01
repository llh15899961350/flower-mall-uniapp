/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Hello Kitty × tbh 「我心童真」生日限定花束',
    subtitle: 'Classic Floral Romance',
    price: 1680,
    originalPrice: 1880,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600&auto=format&fit=crop',
    category: '花艺',
    description: '野兽派精选「我心童真」联名款花束。搭配经典红、奶油粉玫瑰，以及高定绣球花，融合Hello Kitty优雅蝴蝶结丝带。每一朵花都承载着关于夏日和童趣的冒险誓言，是生日与纪念日的奢华首选。',
    colors: ['红粉初心', '经典复古'],
    specs: ['大号高约60cm', '精选昆明直供特级玫瑰', '高定防水毛边宣纸包装'],
    rating: 4.9
  },
  {
    id: 2,
    title: 'Hello Kitty × tbh 「我心童真」生日限定花桶-小号',
    subtitle: 'Tabletop Blossom Box',
    price: 2280,
    originalPrice: 2480,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
    category: '花艺',
    description: '采用野兽派标志性的圆柱高定皮质花桶，将满满的暖色玫瑰和玲珑配草锁入其中。顶端点缀特制Hello Kitty金属电镀挂饰，散发无尽的少女情怀。精致小巧，适合放置于玄关或梳妆台。',
    colors: ['香槟金桶', '珊瑚粉桶'],
    specs: ['精巧圆桶直径22cm', '保鲜期3-5天', '含联名版Kitty烫金生日贺卡'],
    rating: 4.8
  },
  {
    id: 3,
    title: 'tbh「夏日冒险岛」不锈钢吸管保温杯 (含mini包挂件)',
    subtitle: 'Adventure Tumbler',
    price: 269,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600&auto=format&fit=crop',
    category: '家居',
    description: '双层食品级304不锈钢抽真空设计，强效保温保冷12小时。杯身印有Hello Kitty探险家限定手绘涂鸦，搭配珊瑚粉烤漆，既温暖又活力。随杯附赠超级软萌的Mini羽绒收纳杯套挂件，可挂在包包上作为潮流点缀。',
    colors: ['珊瑚粉 700ml', '椰林绿 700ml'],
    specs: ['双层304不锈钢', 'Tritan食品级吸管', '长效坚固真空层'],
    rating: 5.0
  },
  {
    id: 4,
    title: 'Hello Kitty × tbh 全棉高密缎纹印花四件套-黄色豹纹',
    subtitle: 'Sateen Bedding Sheet Set',
    price: 999,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop',
    category: '床品',
    description: '100%长绒棉，80支五枚缎纹，交织出丝缎般的光泽与极致柔软的垂顺触感。狂野的黄色小豹纹与Hello Kitty经典的可爱呆萌大头印花碰撞，展现反差萌趣味！A/B两面多彩设计，给夏日卧室注入前卫大胆的艺术感。',
    colors: ['黄色豹纹-双人1.8米', '香草奶黄-单人1.5米'],
    specs: ['100%新疆长绒棉', '80支高密五枚缎纹', '环保活性印染，耐洗不褪色'],
    rating: 4.9
  },
  {
    id: 5,
    title: 'tbh 莫代尔经典真丝镶边家居睡衣套装',
    subtitle: 'Silk-Trim Lounge Pajamas',
    price: 590,
    originalPrice: 690,
    image: 'https://images.unsplash.com/photo-1598121696010-039d6406028d?q=80&w=600&auto=format&fit=crop',
    category: '家居',
    description: '采用高支莫代尔纤维，并融入天然桑蚕丝细密收口滚边，实现丝滑糯感，透气不贴身。宽松微廓形裁剪，复古法式西装领设计，不仅舒适度百分百，更能展现慵懒随性美感。让宅家睡眠时光变得无比奢华。',
    colors: ['浅杏白', '复古藏青', '落日粉'],
    specs: ['93%兰精莫代尔 + 7%桑蚕丝镶边', '抗起球亲肤工艺', '纽扣排扣，带两个侧边口袋'],
    rating: 4.7
  },
  {
    id: 6,
    title: '野兽派「熊猫噗噗」香氛系列-车载艺术扩香器',
    subtitle: 'Panda Poopo Car Diffuser',
    price: 360,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
    category: '香氛',
    description: '深受喜爱的超人气IP「熊猫噗噗」车载版。采用哑光质感电锤工艺制成的大头噗噗造型，夹在车载空调出风口。选用法国核心调香室特制的绿意森林香调，带给您宛若行驶在雨后竹林般的清冷治愈。',
    colors: ['大熊猫噗噗', '幼年滚滚'],
    specs: ['环保合金夹口，防刮软胶保护', '附赠林间竹香替换片*2', '精美礼盒包装'],
    rating: 4.9
  },
  {
    id: 7,
    title: 'tbh 经典格纹澳洲美利奴羊毛保暖膝盖毯/沙发布',
    subtitle: 'Merino Wool Throw Blanket',
    price: 780,
    originalPrice: 880,
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=600&auto=format&fit=crop',
    category: '床品',
    description: '精选百分百澳洲进口超细美利奴羊毛，经过双面起绒和轻微起剪缩绒处理，实现无重飘逸却又澎湃温暖的奇妙体验。经典隽永的沙漏棕橙复古棋盘格纹，无论是当作膝盖毯、午休搭肩披肩还是沙发盖毯，都是提升空间质感的艺术配饰。',
    colors: ['沙漏棕橙', '北欧冷空灰'],
    specs: ['100%美利奴羊毛', '130cm x 170cm (含复古扭边流苏)', '建议专业干洗'],
    rating: 4.8
  },
  {
    id: 8,
    title: '野兽派「夏日乌托邦」经典金色杯香氛蜡烛礼盒',
    subtitle: 'Golden Cup Holiday Candle',
    price: 490,
    originalPrice: 520,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop',
    category: '香氛',
    description: '采用特制复古黃铜杯身，手工浇筑100%天然大豆蜡。纯棉多股烛芯，燃烧时毫无黑烟。前调是爆浆清甜的無花果與柑橘，中调弥散出迷人的椰奶与雪松。金色高光映射暖光，营造极致的法式度假梦境。',
    colors: ['220g 晨曦椰香', '220g 暮光黑雪松'],
    specs: ['天然精炼大豆蜡 + 进口高浓度植物精油', '持续燃烧约50小时', '配备原装防尘纯铜杯盖'],
    rating: 4.9
  }
];
