
export const languages = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const enTranslations = {
  nav: { products: 'Products', services: 'Services', materials: 'Materials', portfolio: 'Portfolio' },
  hero: {
    tag: 'Next-Gen 3D Manufacturing',
    title1: 'Shaping your',
    title2: 'ideas',
    desc: 'From rapid PLA prototyping to micrometric precision with UV resins. We bring your projects to life with cutting-edge 3D printing technologies.',
    cta1: 'Explore products',
    cta2: 'Request a project',
    stats: 'Projects successfully completed'
  },
  products: {
    tag: 'Showcase',
    title: 'Featured Productions',
    filters: { all: 'All', mech: 'Mechanical', design: 'Design', mini: 'Miniatures', arch: 'Architecture' },
    view: 'Details',
    startFrom: 'From'
  },
  services: {
    tag: 'Our Offering',
    title: 'Professional solutions',
    all: 'All services',
    process: 'Our Process',
    pla: {
      title: 'PLA Printing (FDM)',
      desc: 'Ideal for prototypes, mechanical parts, and large objects. Economical, durable, and eco-friendly.',
      f1: 'Bio-based Materials', f2: 'Volume up to 50cm', f3: 'Wide color range'
    },
    resina: {
      title: 'Resin Printing (SLA)',
      desc: 'Surgical precision and incredible details. Perfect for miniatures, jewelry, and high-definition design.',
      f1: '8K Resolution', f2: 'Smooth surface', f3: 'Micron details'
    },
    custom: {
      title: 'Custom Projects',
      desc: 'Got an idea but no 3D file? Our design team helps you from CAD modeling to final printing.',
      f1: 'CAD Modeling', f2: 'File optimization', f3: 'Dedicated consulting',
      cta: 'Get a Quote'
    }
  },
  materials: {
    tag: 'Material Library',
    title: 'Advanced Materials',
    desc: 'We select only the best polymers and resins to ensure superior mechanical performance.',
    stats: { strength: 'Strength', detail: 'Detail', flex: 'Flexibility', cost: 'Cost' }
  },
  portfolio: {
    tag: 'Gallery',
    title: 'Project Portfolio',
    viewAll: 'View all projects',
    categories: { all: 'All', proto: 'Prototypes', art: 'Art', tech: 'Technical' }
  },
  quality: {
    title: 'Superior quality, without compromise.',
    desc: 'We use only certified materials and the best printers on the market to ensure every piece meets your expectations.',
    delivery: 'Delivery Speed',
    days: '3-5 Business days',
    prec: { t: 'Precision', d: 'Guaranteed minimum tolerances on every industrial part.' },
    eco: { t: 'Eco-sustainable', d: 'Biodegradable PLA and eco-friendly resin options.' },
    ship: { t: 'Global Shipping', d: 'Tracked and insured shipping worldwide.' },
    supp: { t: '24/7 Support', d: 'Our technicians are always ready to support your project.' }
  },
  cta: {
    title: 'Ready to print your future?',
    desc: 'Upload your STL file and get an instant quote or browse our shop.',
    upload: 'Upload STL File',
    contact: 'Contact an Expert'
  },
  ai: {
    welcome: "Hello! I'm DreamAI Engineering. Upload an image of your model for a technical DfAM analysis and an instant cost estimation.",
    scanStatus: "Analyzing geometry and calculating costs...",
    placeholderMsg: "Send a message...",
    placeholderReq: "Specify requirements...",
    analyze: "Analyze & Quote",
    generate: "Visualize",
    history: "Analysis History",
    backChat: "Back to chat",
    backHistory: "Report Archive",
    noReports: "No archived reports.",
    certified: "Certified DfAM Analysis",
    reportTitle: "Geometry Analysis",
    quoteTitle: "Preliminary Quotation",
    errors: {
      invalidFile: "Please upload a valid image file (JPG, PNG).",
      processing: "An error occurred while processing the file. Please try again.",
      aiService: "The AI service is temporarily unavailable. Please try again in a few moments.",
      pdfExport: "Failed to export PDF report. Please try again.",
      emptyResponse: "The AI could not generate a response. Please try refining your request."
    }
  }
};

const zhTranslations = {
  nav: { products: '产品', services: '服务', materials: '材料', portfolio: '作品集' },
  hero: {
    tag: '下一代 3D 制造',
    title1: '塑造您的',
    title2: '创意',
    desc: '从快速 PLA 原型制作到 UV 树脂的微米级精度制造。我们利用前沿 3D 打印技术将您的项目变为现实。',
    cta1: '探索产品',
    cta2: '申请项目',
    stats: '成功完成的项目'
  },
  products: {
    tag: '展示',
    title: '精选作品',
    filters: { all: '全部', mech: '机械', design: '设计', mini: '微型', arch: '建筑' },
    view: '详情',
    startFrom: '起价'
  },
  services: {
    tag: '我们的服务',
    title: '专业解决方案',
    all: '全部服务',
    process: '我们的流程',
    pla: {
      title: 'PLA 打印 (FDM)',
      desc: '原型、机械零件和大尺寸物体的理想选择。经济、耐用且环保。',
      f1: '生物基材料', f2: '打印体积高达 50cm', f3: '丰富的颜色选择'
    },
    resina: {
      title: '树脂打印 (SLA)',
      desc: '手术级的精度和令人惊叹的细节。非常适合微型模型、珠宝和高清设计。',
      f1: '8K 分辨率', f2: '光滑表面', f3: '微米级细节'
    },
    custom: {
      title: '定制项目',
      desc: '有想法但没有 3D 文件？我们的设计团队协助您完成从 CAD 建模到最终打印的整个过程。',
      f1: 'CAD 建模', f2: '文件优化', f3: '专属咨询',
      cta: '获取报价'
    }
  },
  materials: {
    tag: '材料库',
    title: '先进材料',
    desc: '我们仅选择最优质的聚合物和树脂，以确保卓越的机械性能。',
    stats: { strength: '强度', detail: '细节', flex: '柔韧性', cost: '成本' }
  },
  portfolio: {
    tag: '画廊',
    title: '项目作品集',
    viewAll: '查看所有项目',
    categories: { all: '全部', proto: '原型', art: '艺术', tech: '技术' }
  },
  quality: {
    title: '卓越品质，绝不妥协。',
    desc: '我们仅使用经过认证的材料和市场上最好的打印机，以确保每一件作品都符合您的期望。',
    delivery: '交货速度',
    days: '3-5 个工作日',
    prec: { t: '精度', d: '保证每个工业零件的最小公差。' },
    eco: { t: '生态可持续', d: '生物可降解 PLA 和环保树脂选项。' },
    ship: { t: '全球发货', d: '全球范围内提供跟踪和保险的运输。' },
    supp: { t: '24/7 支持', d: '我们的技术人员随时准备为您的项目提供支持。' }
  },
  cta: {
    title: '准备好打印您的未来了吗？',
    desc: '上传您的 STL 文件即可获得即时报价，或浏览我们的商店。',
    upload: '上传 STL 文件',
    contact: '联系专家'
  },
  ai: {
    welcome: "您好！我是 DreamAI 工程助手。上传您的模型图片，即可进行技术 DfAM 分析并获得即时报价。",
    scanStatus: "正在分析几何形状并计算成本...",
    placeholderMsg: "发送消息...",
    placeholderReq: "指定要求...",
    analyze: "分析并报价",
    generate: "可视化",
    history: "分析历史",
    backChat: "返回聊天",
    backHistory: "报告存档",
    noReports: "暂无存档报告。",
    certified: "认证 DfAM 分析",
    reportTitle: "几何分析",
    quoteTitle: "初步报价",
    errors: {
      invalidFile: "请上传有效的图片文件 (JPG, PNG)。",
      processing: "处理文件时出错。请稍后重试。",
      aiService: "AI 服务暂时不可用。请稍后再试。",
      pdfExport: "导出 PDF 报告失败。请稍后重试。",
      emptyResponse: "AI 无法生成响应。请尝试精炼您的请求。"
    }
  }
};

const deTranslations = {
  ...enTranslations,
  ai: {
    ...enTranslations.ai,
    welcome: "Hallo! Ich bin DreamAI Engineering. Laden Sie ein Bild Ihres Modells für eine technische DfAM-Analyse und eine sofortige Kostenschätzung hoch.",
    scanStatus: "Geometrie wird analysiert und Kosten werden berechnet...",
    placeholderMsg: "Nachricht senden...",
    placeholderReq: "Anforderungen spezifizieren...",
    analyze: "Analysieren & Angebot",
    generate: "Visualisieren",
    history: "Analyse-Verlauf",
    backChat: "Zurück zum Chat",
    backHistory: "Bericht-Archiv",
    noReports: "Keine archivierten Berichte.",
    certified: "Zertifizierte DfAM-Analyse",
    reportTitle: "Geometrie-Analyse",
    quoteTitle: "Vorläufiges Angebot",
    errors: {
      invalidFile: "Bitte laden Sie eine gültige Bilddatei hoch (JPG, PNG).",
      processing: "Fehler bei der Dateiverarbeitung. Bitte versuchen Sie es erneut.",
      aiService: "Der KI-Dienst ist vorübergehend nicht verfügbar. Bitte versuchen Sie es in Kürze erneut.",
      pdfExport: "PDF-Export fehlgeschlagen. Bitte versuchen Sie es erneut.",
      emptyResponse: "Die KI konnte keine Antwort generieren. Bitte verfeinern Sie Ihre Anfrage."
    }
  }
};

const frTranslations = {
  ...enTranslations,
  ai: {
    ...enTranslations.ai,
    welcome: "Bonjour ! Je suis DreamAI Engineering. Téléchargez une image de votre modèle pour une analyse technique DfAM et une estimation instantanée des coûts.",
    scanStatus: "Analyse de la géométrie et calcul des coûts...",
    placeholderMsg: "Envoyer un message...",
    placeholderReq: "Spécifier les exigences...",
    analyze: "Analyser & Devis",
    generate: "Visualiser",
    history: "Historique des analyses",
    backChat: "Retour au chat",
    backHistory: "Archive des rapports",
    noReports: "Aucun rapport archivé.",
    certified: "Analyse DfAM certifiée",
    reportTitle: "Analyse de Géométrie",
    quoteTitle: "Devis Préliminaire",
    errors: {
      invalidFile: "Veuillez télécharger un fichier image valide (JPG, PNG).",
      processing: "Une erreur est survenue lors du traitement du fichier. Veuillez réessayer.",
      aiService: "Le service d'IA est temporairement indisponible. Veuillez réessayer dans quelques instants.",
      pdfExport: "Échec de l'exportation du PDF. Veuillez réessayer.",
      emptyResponse: "L'IA n'a pas pu generer de réponse. Veuillez affiner votre demande."
    }
  }
};

const esTranslations = {
  ...enTranslations,
  ai: {
    ...enTranslations.ai,
    welcome: "¡Hola! Soy DreamAI Engineering. Sube una imagen de tu modelo para un análisis técnico DfAM y un presupuesto instantáneo.",
    scanStatus: "Analizando geometría y calculando costes...",
    placeholderMsg: "Enviar un mensaje...",
    placeholderReq: "Especificar requisitos...",
    analyze: "Analizar y Cotizar",
    generate: "Visualizar",
    history: "Historial de análisis",
    backChat: "Volver al chat",
    backHistory: "Archivo de informes",
    noReports: "No hay informes archivados.",
    certified: "Análisis DfAM certificado",
    reportTitle: "Análisis de Geometría",
    quoteTitle: "Presupuesto Preliminar",
    errors: {
      invalidFile: "Por favor, sube un archivo de imagen válido (JPG, PNG).",
      processing: "Ocurrió un error al procesar el archivo. Por favor, inténtalo de nuevo.",
      aiService: "El servicio de IA no está disponible temporalmente. Por favor, inténtalo de nuovo en unos momentos.",
      pdfExport: "Error al exportar el PDF. Por favor, inténtalo de nuevo.",
      emptyResponse: "La IA no pudo generar una respuesta. Por favor, intenta refinar tu solicitud."
    }
  }
};

export const translations: Record<string, any> = {
  it: {
    nav: { products: 'Prodotti', services: 'Servizi', materials: 'Materiali', portfolio: 'Portfolio' },
    hero: {
      tag: 'Next-Gen 3D Manufacturing',
      title1: 'Diamo forma alle',
      title2: 'tue idee',
      desc: 'Dalla prototipazione rapida in PLA alla precisione micrometrica delle resine UV. Realizziamo i tuoi progetti con tecnologie di stampa 3D all\'avanguardia.',
      cta1: 'Scopri i prodotti',
      cta2: 'Richiedi un progetto',
      stats: 'Progetti realizzati con successo'
    },
    products: {
      tag: 'Showcase',
      title: 'Realizzazioni in evidenza',
      filters: { all: 'Tutti', mech: 'Meccanica', design: 'Design', mini: 'Miniature', arch: 'Architettura' },
      view: 'Dettagli',
      startFrom: 'Da'
    },
    services: {
      tag: 'La nostra offerta',
      title: 'Soluzioni professionali',
      all: 'Tutti i servizi',
      process: 'Il nostro processo',
      pla: {
        title: 'Stampa PLA (FDM)',
        desc: 'Ideale per prototipi, pezzi meccanici e oggetti di grandi dimensioni. Economico, resistente ed ecosostenibile.',
        f1: 'Materiali Bio-based', f2: 'Volume fino a 50cm', f3: 'Ampia gamma colori'
      },
      resina: {
        title: 'Stampa Resina (SLA)',
        desc: 'Precisione chirurgica e dettagli incredibili. Perfetto per miniature, gioielleria e design ad alta definizione.',
        f1: 'Risoluzione 8K', f2: 'Superficie liscia', f3: 'Dettagli micron'
      },
      custom: {
        title: 'Progetti Custom',
        desc: 'Hai un\'idea ma non il file 3D? Il nostro team di design ti aiuta dalla modellazione CAD alla stampa finale.',
        f1: 'Modellazione CAD', f2: 'Ottimizzazione file', f3: 'Consulenza dedicata',
        cta: 'Richiedi Preventivo'
      }
    },
    materials: {
      tag: 'Material Library',
      title: 'Materiali Avanzati',
      desc: 'Selezioniamo solo i migliori polimeri e resine per garantire performance meccaniche superiori.',
      stats: { strength: 'Resistenza', detail: 'Dettaglio', flex: 'Flessibilità', cost: 'Costo' }
    },
    portfolio: {
      tag: 'Gallery',
      title: 'Portfolio Progetti',
      viewAll: 'Vedi tutti i progetti',
      categories: { all: 'Tutti', proto: 'Prototipi', art: 'Arte', tech: 'Tecnico' }
    },
    quality: {
      title: 'Qualità superiore, senza compromessi.',
      desc: 'Utilizziamo solo materiali certificati e le migliori stampanti sul mercato per garantire che ogni pezzo rispetti le tue aspettative.',
      delivery: 'Velocità di consegna',
      days: '3-5 Giorni lavorativi',
      prec: { t: 'Precisione', d: 'Tolleranze minime garantite su ogni pezzo industriale.' },
      eco: { t: 'Ecosostenibile', d: 'Opzioni in PLA biodegradabile e resine eco-friendly.' },
      ship: { t: 'Global Shipping', d: 'Tracked and insured shipping worldwide.' },
      supp: { t: 'Supporto 24/7', d: 'I nostri tecnici sono sempre pronti a supportare il tuo progetto.' }
    },
    cta: {
      title: 'Pronto a stampare il tuo futuro?',
      desc: 'Carica il tuo file STL e ricevi un preventivo immediato oppure naviga nel nostro shop.',
      upload: 'Carica File STL',
      contact: 'Contatta un esperto'
    },
    ai: {
      welcome: "Ciao! Sono DreamAI Engineering. Carica un'immagine del tuo modello per un'analisi tecnica DfAM e un preventivo immediato.",
      scanStatus: "Analisi geometria e calcolo preventivo in corso...",
      placeholderMsg: "Invia un messaggio...",
      placeholderReq: "Specifica i requisiti...",
      analyze: "Analizza e Quota",
      generate: "Visualizza",
      history: "Cronologia analisi",
      backChat: "Torna alla chat",
      backHistory: "Archivio Report",
      noReports: "Nessun report archiviato.",
      certified: "Analisi DfAM Certificata",
      reportTitle: "Analisi Geometria",
      quoteTitle: "Preventivo Preliminare",
      errors: {
        invalidFile: "Per favore carica un file immagine valido (JPG, PNG).",
        processing: "Si è verificato un errore durante l'elaborazione del file. Riprova.",
        aiService: "Il servizio AI è temporaneamente non disponibile. Riprova tra pochi istanti.",
        pdfExport: "Esportazione PDF fallita. Riprova.",
        emptyResponse: "L'AI non ha potuto generare una risposta. Prova a rifinire la tua richiesta."
      }
    }
  },
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
  es: esTranslations,
  zh: zhTranslations
};
