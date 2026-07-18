'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'es' | 'pt' | 'hi';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

// A simple dictionary for our MVP translations
const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Landing Page
    'landing.headline.part1': 'Welcome to the',
    'landing.headline.part2': 'Future of Fan Experience',
    'landing.subtitle': 'Your personal, AI-powered stadium assistant for the FIFA World Cup 2026. Get real-time navigation, instant multilingual help, and personalized match-day updates.',
    'landing.btn.getStarted': 'Get Started Now',
    'landing.btn.login': 'Fan Login',
    'landing.btn.assistant': 'Go to Fan Assistant',
    'landing.feat1.title': 'Multilingual AI Assistant',
    'landing.feat1.desc': 'Ask questions in any language. Get instant answers about stadium facilities, food, and match details.',
    'landing.feat2.title': 'Smart Navigation',
    'landing.feat2.desc': 'Never get lost. Get intelligent, crowd-aware routing to your seat, the nearest restroom, or concessions.',
    'landing.feat3.title': 'Real-time Crowd Updates',
    'landing.feat3.desc': 'Avoid the lines. Receive live alerts about gate congestion and the best times to visit concessions.',
    'landing.btn.guest': 'Continue as Guest',
    // Nav
    'nav.home': 'Home',
    'nav.assistant': 'Fan Assistant',
    'nav.crowd': 'Food & Crowd',
    'nav.transit': 'Transit',
    'nav.sustainability': 'Eco-Rewards',
    'nav.login': 'Log In / Sign Up',
    'nav.logout': 'Sign Out',
    // Chat
    'chat.title': 'Stadium Assistant',
    'chat.sub': 'Multilingual support',
    'chat.placeholder': 'Type your question...',
    'chat.empty': 'Ask me anything about gates, seating, restrooms, or medical facilities!',
    'chat.thinking': 'Thinking...',
    'chat.error': 'Something went wrong. Please try again.',
    // Map
    'map.title': 'Stadium Map',
    'map.subtitle': 'Ask the assistant for directions, or click below to run a demo navigation from Gate 1 to Food Court A.',
    'map.demoBtn': 'Run Demo Navigation',
    // Crowd
    'crowd.title': 'Smart Concessions',
    'crowd.subtitle': 'Avoid the lines. Tell us what you want to eat, and we\'ll find the best place to go based on live stadium crowd data.',
    'crowd.label': 'What do you want to eat now?',
    'crowd.aiTitle': 'AI Recommendation',
    'crowd.waitTitle': 'Live Wait Times',
    'crowd.wait': 'wait',
    'crowd.loading': 'Analyzing crowd data...',
    'crowd.any': 'Any',
    // Transit
    'transit.title': 'Match-Day Transit Hub',
    'transit.subtitle': 'Get home smoothly. We\'ll monitor the schedules for your preferred transit method and tell you exactly when to leave your seat.',
    'transit.label': 'Preferred Transit',
    'transit.aiTitle': 'AI Departure Plan',
    'transit.depTitle': 'Live Departures',
    'transit.loading': 'Calculating walking distance...',
    'transit.train': 'Train',
    'transit.bus': 'Bus',
    'transit.rideshare': 'Rideshare / Uber',
    'transit.parking': 'My Car (Parking)',
    // Eco
    'eco.title': 'Eco-Fan Rewards',
    'eco.subtitle': 'Log your sustainable actions today to earn points and see your impact on the planet!',
    'eco.impact': 'Your Impact',
    'eco.loading': 'Calculating your carbon savings...',
    'eco.action1': 'Took Public Transit',
    'eco.action2': 'Used Digital Ticket',
    'eco.action3': 'Recycled Stadium Cup',
  },
  es: {
    'landing.headline.part1': 'Bienvenido al',
    'landing.headline.part2': 'Futuro de la Experiencia del Fanático',
    'landing.subtitle': 'Tu asistente personal de estadio con IA para la Copa Mundial de la FIFA 2026. Obtén navegación en tiempo real, ayuda multilingüe instantánea y actualizaciones personalizadas.',
    'landing.btn.getStarted': 'Empezar Ahora',
    'landing.btn.login': 'Iniciar Sesión',
    'landing.btn.assistant': 'Ir al Asistente',
    'landing.feat1.title': 'Asistente de IA Multilingüe',
    'landing.feat1.desc': 'Haz preguntas en cualquier idioma. Obtén respuestas instantáneas sobre las instalaciones del estadio.',
    'landing.feat2.title': 'Navegación Inteligente',
    'landing.feat2.desc': 'Nunca te pierdas. Obtén rutas inteligentes para llegar a tu asiento o al baño más cercano.',
    'landing.feat3.title': 'Actualizaciones en Tiempo Real',
    'landing.feat3.desc': 'Evita las filas. Recibe alertas en vivo sobre la congestión de las puertas.',
    'nav.home': 'Inicio',
    'nav.assistant': 'Asistente',
    'nav.crowd': 'Comida y Multitudes',
    'nav.transit': 'Tránsito',
    'nav.sustainability': 'Eco-Recompensas',
    'nav.login': 'Iniciar Sesión / Registro',
    'nav.logout': 'Cerrar Sesión',
    'chat.title': 'Asistente del Estadio',
    'chat.sub': 'Soporte multilingüe',
    'chat.placeholder': 'Escribe tu pregunta...',
    'chat.empty': '¡Pregúntame cualquier cosa sobre puertas, asientos, baños o instalaciones médicas!',
    'chat.thinking': 'Pensando...',
    'chat.error': 'Algo salió mal. Por favor, inténtalo de nuevo.',
    'map.title': 'Mapa del Estadio',
    'map.subtitle': 'Pide indicaciones al asistente o haz clic a continuación para ejecutar una navegación de prueba.',
    'map.demoBtn': 'Ejecutar Navegação de Prova',
    'landing.btn.guest': 'Continuar como Invitado',
    'crowd.title': 'Concesiones Inteligentes',
    'crowd.subtitle': 'Evita las filas. Dinos qué quieres comer y encontraremos el mejor lugar basándonos en datos en vivo.',
    'crowd.label': '¿Qué quieres comer ahora?',
    'crowd.aiTitle': 'Recomendación de IA',
    'crowd.waitTitle': 'Tiempos de Espera en Vivo',
    'crowd.wait': 'espera',
    'crowd.loading': 'Analizando multitudes...',
    'crowd.any': 'Cualquiera',
    'transit.title': 'Centro de Tránsito del Partido',
    'transit.subtitle': 'Monitorearemos los horarios de tu método de tránsito preferido.',
    'transit.label': 'Tránsito Preferido',
    'transit.aiTitle': 'Plan de Salida de IA',
    'transit.depTitle': 'Salidas en Vivo',
    'transit.loading': 'Calculando distancia...',
    'transit.train': 'Tren',
    'transit.bus': 'Autobús',
    'transit.rideshare': 'Uber / Viaje Compartido',
    'transit.parking': 'Mi Coche (Estacionamiento)',
    'eco.title': 'Recompensas Eco-Fan',
    'eco.subtitle': '¡Registra tus acciones sostenibles hoy para ganar puntos!',
    'eco.impact': 'Tu Impacto',
    'eco.loading': 'Calculando tus ahorros de carbono...',
    'eco.action1': 'Tomó Tránsito Público',
    'eco.action2': 'Usó Boleto Digital',
    'eco.action3': 'Recicló Vaso',
  },
  pt: {
    'landing.headline.part1': 'Bem-vindo ao',
    'landing.headline.part2': 'Futuro da Experiência do Torcedor',
    'landing.subtitle': 'Seu assistente pessoal de estádio com IA para a Copa do Mundo da FIFA 2026. Obtenha navegação em tempo real, ajuda multilíngue instantânea e atualizações personalizadas.',
    'landing.btn.getStarted': 'Começar Agora',
    'landing.btn.login': 'Fazer Login',
    'landing.btn.assistant': 'Ir para o Assistente',
    'landing.feat1.title': 'Assistente de IA Multilíngue',
    'landing.feat1.desc': 'Faça perguntas em qualquer idioma. Obtenha respostas instantâneas sobre as instalações do estádio.',
    'landing.feat2.title': 'Navegação Inteligente',
    'landing.feat2.desc': 'Nunca se perca. Obtenha rotas inteligentes para chegar ao seu assento ou ao banheiro mais próximo.',
    'landing.feat3.title': 'Atualizações em Tempo Real',
    'landing.feat3.desc': 'Evite as filas. Receba alertas ao vivo sobre o congestionamento dos portões.',
    'nav.home': 'Início',
    'nav.assistant': 'Assistente',
    'nav.crowd': 'Comida e Multidões',
    'nav.transit': 'Trânsito',
    'nav.sustainability': 'Eco-Recompensas',
    'nav.login': 'Entrar / Registrar',
    'nav.logout': 'Sair',
    'chat.title': 'Assistente do Estádio',
    'chat.sub': 'Suporte multilíngue',
    'chat.placeholder': 'Digite sua pergunta...',
    'chat.empty': 'Pergunte-me qualquer coisa sobre portões, assentos, banheiros ou instalações médicas!',
    'chat.thinking': 'Pensando...',
    'chat.error': 'Algo deu errado. Por favor, tente novamente.',
    'map.title': 'Mapa do Estádio',
    'map.subtitle': 'Peça orientações ao assistente ou clique abaixo para executar uma navegação de demonstração.',
    'map.demoBtn': 'Executar Navegação de Demonstração',
    'landing.btn.guest': 'Continuar como Convidado',
    'crowd.title': 'Concessões Inteligentes',
    'crowd.subtitle': 'Evite as filas. Diga-nos o que quer comer e encontraremos o melhor lugar.',
    'crowd.label': 'O que você quer comer agora?',
    'crowd.aiTitle': 'Recomendação de IA',
    'crowd.waitTitle': 'Tempos de Espera ao Vivo',
    'crowd.wait': 'espera',
    'crowd.loading': 'Analisando multidões...',
    'crowd.any': 'Qualquer',
    'transit.title': 'Centro de Trânsito do Jogo',
    'transit.subtitle': 'Monitoraremos os horários do seu método de trânsito preferido.',
    'transit.label': 'Trânsito Preferido',
    'transit.aiTitle': 'Plano de Partida de IA',
    'transit.depTitle': 'Partidas ao Vivo',
    'transit.loading': 'Calculando distância...',
    'transit.train': 'Trem',
    'transit.bus': 'Ônibus',
    'transit.rideshare': 'Uber / Carona',
    'transit.parking': 'Meu Carro (Estacionamento)',
    'eco.title': 'Recompensas Eco-Fan',
    'eco.subtitle': 'Registre suas ações sustentáveis hoje para ganhar pontos!',
    'eco.impact': 'Seu Impacto',
    'eco.loading': 'Calculando sua economia de carbono...',
    'eco.action1': 'Pegou Trânsito Público',
    'eco.action2': 'Usou Ingresso Digital',
    'eco.action3': 'Reciclou Copo',
  },
  hi: {
    'landing.headline.part1': 'में आपका स्वागत है',
    'landing.headline.part2': 'फैन अनुभव का भविष्य',
    'landing.subtitle': 'फीफा विश्व कप 2026 के लिए आपका व्यक्तिगत, एआई-संचालित स्टेडियम सहायक। रीयल-टाइम नेविगेशन, त्वरित बहुभाषी सहायता प्राप्त करें।',
    'landing.btn.getStarted': 'अभी शुरू करें',
    'landing.btn.login': 'लॉगिन करें',
    'landing.btn.assistant': 'सहायक पर जाएं',
    'landing.feat1.title': 'बहुभाषी एआई सहायक',
    'landing.feat1.desc': 'किसी भी भाषा में प्रश्न पूछें। स्टेडियम की सुविधाओं के बारे में त्वरित उत्तर प्राप्त करें।',
    'landing.feat2.title': 'स्मार्ट नेविगेशन',
    'landing.feat2.desc': 'कभी न खोएं। अपनी सीट या निकटतम विश्राम कक्ष तक पहुंचने के लिए बुद्धिमान मार्ग प्राप्त करें।',
    'landing.feat3.title': 'रीयल-टाइम भीड़ अपडेट',
    'landing.feat3.desc': 'लाइनों से बचें। गेट की भीड़ के बारे में लाइव अलर्ट प्राप्त करें।',
    'nav.home': 'होम',
    'nav.assistant': 'सहायक',
    'nav.crowd': 'भोजन और भीड़',
    'nav.transit': 'पारगमन',
    'nav.sustainability': 'इको-इनाम',
    'nav.login': 'लॉग इन / साइन अप',
    'nav.logout': 'साइन आउट',
    'chat.title': 'स्टेडियम सहायक',
    'chat.sub': 'बहुभाषी समर्थन',
    'chat.placeholder': 'अपना प्रश्न टाइप करें...',
    'chat.empty': 'मुझसे गेट, बैठने की जगह, वॉशरूम या चिकित्सा सुविधाओं के बारे में कुछ भी पूछें!',
    'chat.thinking': 'सोच रहा है...',
    'chat.error': 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    'map.title': 'स्टेडियम का नक्शा',
    'map.subtitle': 'सहायक से दिशा-निर्देश मांगें, या डेमो नेविगेशन चलाने के लिए नीचे क्लिक करें।',
    'map.demoBtn': 'डेमो नेविगेशन चलाएं',
    'landing.btn.guest': 'अतिथि के रूप में जारी रखें',
    'crowd.title': 'स्मार्ट रियायतें',
    'crowd.subtitle': 'लाइनों से बचें। हमें बताएं कि आप क्या खाना चाहते हैं।',
    'crowd.label': 'अब आप क्या खाना चाहते हैं?',
    'crowd.aiTitle': 'एआई सिफारिश',
    'crowd.waitTitle': 'लाइव प्रतीक्षा समय',
    'crowd.wait': 'प्रतीक्षा',
    'crowd.loading': 'भीड़ का विश्लेषण...',
    'crowd.any': 'कोई भी',
    'transit.title': 'मैच-डे ट्रांजिट हब',
    'transit.subtitle': 'हम आपके पसंदीदा पारगमन के कार्यक्रम की निगरानी करेंगे।',
    'transit.label': 'पसंदीदा पारगमन',
    'transit.aiTitle': 'एआई प्रस्थान योजना',
    'transit.depTitle': 'लाइव प्रस्थान',
    'transit.loading': 'दूरी की गणना...',
    'transit.train': 'ट्रेन',
    'transit.bus': 'बस',
    'transit.rideshare': 'उबेर / राइडशेयर',
    'transit.parking': 'मेरी कार (पार्किंग)',
    'eco.title': 'इको-फैन इनाम',
    'eco.subtitle': 'अंक अर्जित करने के लिए आज ही अपने टिकाऊ कार्य दर्ज करें!',
    'eco.impact': 'आपका प्रभाव',
    'eco.loading': 'कार्बन बचत की गणना...',
    'eco.action1': 'सार्वजनिक पारगमन लिया',
    'eco.action2': 'डिजिटल टिकट का उपयोग किया',
    'eco.action3': 'स्टेडियम कप रीसायकल किया',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Update HTML lang attribute for accessibility (BCP 47 codes)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
