export const personalInfo = {
  name: 'Guilherme',
  lastName: 'E. Schlickmann',
  title: 'Analista Programador',
  subtitle: 'Delphi · Oracle · ERP Systems',
  description:
    'Desenvolvedor com experiência em sistemas ERP e aplicações legadas, atuando principalmente com Delphi e bancos de dados Oracle/PostgreSQL. Experiência em stored procedures, triggers e integrações de APIs corporativas.',
  email: 'Guilhermeespaniol@gmail.com',
  github: 'https://github.com/Espaniiol',
  linkedin: 'https://linkedin.com/in/gulherme-espaniol',
  location: 'Marmeleiro — PR',
};

export const experiences = [
  {
    id: 1,
    company: 'VIASOFT',
    role: 'Analista Programador JR',
    period: '04/2025 — Atual',
    description:
      'Desenvolvimento e manutenção de stored procedures e triggers Oracle para automação de regras de negócio em sistemas ERP. Implementação de validações e integração de dados para cobrança e pedidos. Revisão de código Delphi com foco em performance e estabilidade. Criação de scripts de personalização para usuários em sistemas legados. Home Office.',
    techs: ['Delphi', 'Oracle', 'PL/SQL', 'SQL', 'Git'],
    color: '#ffffff',
  },
  {
    id: 2,
    company: 'ELLON TECNOLOGIA EM GESTÃO',
    role: 'Analista de Teste Q/A JR',
    period: '01/2024 — 04/2025',
    description:
      'Planejamento, execução e documentação de testes manuais. Testes em APIs Mobile com Postman e Swagger. Validação de dados em PostgreSQL/SQL Server. Code Review em Delphi.',
    techs: ['Postman', 'Swagger', 'PostgreSQL', 'Delphi', 'SQL Server'],
    color: '#aaaaaa',
  },
  {
    id: 3,
    company: 'JAIR SCHLICKMANN TRANSPORTES ME',
    role: 'Auxiliar de Logística',
    period: '01/2020 — 01/2024',
    description:
      'Emissão de CT-e e MDF-e. Criação de planilhas para controle financeiro e operacional. Emissão de GNRE. Monitoramento de transportes via Trucks Control.',
    techs: ['Excel', 'Trucks Control', 'CT-e', 'MDF-e'],
    color: '#555555',
  },
];

export const projects = [
  {
    id: 1,
    title: 'Sistema de Controle de Fretes',
    description:
      'Aplicação desktop desenvolvida com Electron para controle local de fretes — cadastro de cargas, rotas, motoristas e relatórios operacionais.',
    longDescription:
      'Sistema desktop completo construído com Electron, permitindo operação 100% local sem depender de internet. Inclui cadastro de fretes, controle de motoristas, rotas, geração de relatórios e histórico de operações. Desenvolvido para otimizar o dia a dia de pequenas transportadoras.',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
    video: '/videos/frete-app.mp4',
    poster: '/videos/frete-thumb.jpg',
    techs: ['Electron', 'JavaScript', 'HTML', 'CSS', 'PostgreSQL'],
    github: 'https://github.com/Espaniiol',
    demo: '#',
    featured: true,
    color: '#ffffff',
    year: '2025',
  },
  {
    id: 2,
    title: 'Sistema de Clínica Psiquiátrica',
    description:
      'Sistema desktop para gestão de clínica médica psiquiátrica — prontuários, agendamentos, pacientes e controle de consultas.',
    longDescription:
      'Sistema completo de gestão clínica desenvolvido para uso interno em consultórios e clínicas de psiquiatria. Permite controle de pacientes, histórico de consultas, prontuários digitais e agendamento de atendimentos.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    video: '/videos/clinica-app.mp4',
    techs: ['React', 'PostgreSQL', 'JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/Espaniiol',
    demo: '#',
    featured: true,
    color: '#aaaaaa',
    year: '2025',
  },
  {
    id: 3,
    title: 'App Loja de Roupas',
    description:
      'Aplicativo mobile em desenvolvimento para loja de roupas — catálogo de produtos, carrinho e experiência de compra moderna.',
    longDescription:
      'Aplicativo mobile em desenvolvimento com foco em experiência de compra fluida. Catálogo de produtos com filtros, carrinho de compras, favoritos e interface moderna pensada para conversão. Projeto em andamento.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    video: '/videos/loja-mobile.mp4',
    mobile: true,
    techs: ['React Native', 'TypeScript', 'Expo'],
    github: 'https://github.com/Espaniiol',
    demo: '#',
    featured: true,
    color: '#888888',
    year: '2025',
  },

];

export const techStack = [
  { name: 'Delphi',      category: 'Language',  icon: '🏛️', level: 85, color: '#e0e0e0' },
  { name: 'Oracle DB',   category: 'Database',  icon: '🗄️', level: 88, color: '#cccccc' },
  { name: 'PL/SQL',      category: 'Database',  icon: '📦', level: 86, color: '#bbbbbb' },
  { name: 'PostgreSQL',  category: 'Database',  icon: '🐘', level: 80, color: '#aaaaaa' },
  { name: 'TypeScript',  category: 'Language',  icon: '🔷', level: 75, color: '#999999' },
  { name: 'React',       category: 'Frontend',  icon: '⚛️', level: 72, color: '#888888' },
  { name: 'Python',      category: 'Language',  icon: '🐍', level: 74, color: '#aaaaaa' },
  { name: 'Prisma',      category: 'ORM',       icon: '◆',  level: 70, color: '#888888' },
  { name: 'Docker',      category: 'DevOps',    icon: '🐳', level: 65, color: '#777777' },
  { name: 'Git',         category: 'DevOps',    icon: '🌿', level: 82, color: '#cccccc' },
];

export const journeyEvents = [
  {
    year: '2020',
    title: 'Entrada no Mercado',
    description: 'Iniciei minha carreira na área logística, desenvolvendo habilidades analíticas e domínio de sistemas corporativos — base sólida para o que viria na TI.',
    icon: '🚀',
    color: '#888888',
  },
  {
    year: '2022',
    title: 'Graduação em ADS',
    description: 'Ingressei em Análise e Desenvolvimento de Sistemas na UNIPAR. Algoritmos, banco de dados, programação orientada a objetos e os fundamentos que moldaram minha visão técnica.',
    icon: '🎓',
    color: '#aaaaaa',
  },
  {
    year: '2023',
    title: 'Imersão Técnica',
    description: 'Intensifiquei estudos em Delphi, Oracle, Python e JavaScript. Completei cursos na Alura e Udemy, construindo portfólio técnico e consolidando banco de dados.',
    icon: '💻',
    color: '#999999',
  },
  {
    year: '2024',
    title: 'Primeiro Emprego em TI',
    description: 'Analista Q/A JR na Ellon Tecnologia. Testes manuais, automação de APIs com Postman/Swagger e Code Review em Delphi. A virada de chave na carreira.',
    icon: '⚙️',
    color: '#bbbbbb',
  },
  {
    year: '2025',
    title: 'Analista Programador',
    description: 'Desenvolvedor na VIASOFT. Criando stored procedures Oracle, triggers e integrações para sistemas ERP corporativos. Home Office.',
    icon: '⚡',
    color: '#dddddd',
  },
  {
    year: 'Futuro',
    title: 'Próximos Objetivos',
    description: 'Evoluir em full stack moderno, arquiteturas cloud, contribuir para open source e me tornar referência em integração de sistemas ERP com tecnologias modernas.',
    icon: '◎',
    color: '#ffffff',
  },
];

export const stats = [
  { value: 5, suffix: '+', label: 'Anos de Experiência' },
  { value: 10, suffix: '+', label: 'Tecnologias' },
];
