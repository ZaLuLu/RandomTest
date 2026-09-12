export interface DivisionItem {
  id: string
  letter: string
  code: string
  title: string
  shortTitle: string
  tagline: string
  description: string
  route: string
  badge: string
  accentColor: string
  gradient: string
  tags: string[]
  metrics: { label: string; value: string }[]
  ctaText: string
}


export const DIVISIONS: DivisionItem[] = [
  {
    id: 'products',
    letter: 'P',
    code: 'Products',
    title: 'Software Products',
    shortTitle: 'Products',
    tagline: 'Products Made for the Way You Work',
    description: 'Making complex things feel simple. Interactive learning platforms, geospatial event discovery, and software applications built for everyone.',
    route: '/products',
    badge: 'Our Products',
    accentColor: '#8B5CF6',
    gradient: 'from-violet-500/20 to-purple-500/5',
    tags: ['#SoftwareProducts', '#AlgorithmVisualizer', '#EventMesh', '#EverydayTools'],
    metrics: [
      { label: 'Active Users', value: '4,200+' },
      { label: 'Platform Status', value: '99.9% Uptime' },
    ],
    ctaText: 'Explore Products',
  },
  {
    id: 'services',
    letter: 'S',
    code: 'Services',
    title: 'Software Development',
    shortTitle: 'Services',
    tagline: 'Senior Engineers for Your Product',
    description: 'We design, build, and ship full-stack web applications, backend APIs in FastAPI, and practical AI tools. Shipped with clean code, automated tests, and 100% code ownership.',
    route: '/services',
    badge: 'Engineering Team',
    accentColor: '#4F46E5',
    gradient: 'from-indigo-500/20 to-blue-500/5',
    tags: ['#WebApps', '#FastAPI', '#NextJS', '#PracticalAI'],
    metrics: [
      { label: 'Delivery Cadence', value: 'Sprint Based' },
      { label: 'Code Ownership', value: '100% Yours' },
    ],
    ctaText: 'View Services',
  },
  {
    id: 'academics',
    letter: 'A',
    code: 'Training',
    title: 'Technical Training',
    shortTitle: 'Training',
    tagline: 'Hands-on Cohorts Taught by Builders',
    description: 'Small-cohort engineering programs in backend architecture, systems design, and practical AI. Taught live by engineers who ship production code every day.',
    route: '/academics',
    badge: 'Live Cohorts',
    accentColor: '#0EA5E9',
    gradient: 'from-cyan-500/20 to-sky-500/5',
    tags: ['#LiveMentorship', '#SystemsDesign', '#RealProjects', '#CodeReviews'],
    metrics: [
      { label: 'Engineers Trained', value: '12,000+' },
      { label: 'Projects Shipped', value: '40+' },
    ],
    ctaText: 'View Curriculum',
  },
]

export const SCOPE_BADGES = [
  {
    iconName: 'Code2',
    title: 'Senior Engineering',
    subtitle: 'Clean & Tested Code',
    color: 'var(--accent-primary)',
  },
  {
    iconName: 'Cpu',
    title: 'Practical AI',
    subtitle: 'Built for Production',
    color: 'var(--accent-secondary)',
  },
  {
    iconName: 'Layers',
    title: 'Direct Mentorship',
    subtitle: 'Learn from Builders',
    color: 'var(--accent-tertiary)',
  },
  {
    iconName: 'Zap',
    title: 'Working Code',
    subtitle: 'Shipped Weekly',
    color: 'var(--accent-primary)',
  },
]

