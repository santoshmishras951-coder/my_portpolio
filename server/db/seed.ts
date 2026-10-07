import { PortfolioData } from '../../src/types/portfolio.js';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: 'SANTOSH MISHRA',
    headline: 'Computer Science Student & Aspiring Software Engineer',
    subheadline: 'I build responsive, reliable, and practical web applications using modern frontend and backend technologies.',
    typingTitles: [
      'Frontend Developer',
      'Full-Stack Engineer',
      'Software Engineering Student',
      'CS Undergraduate'
    ],
    bio: 'I am a 3rd-year B.Tech Computer Science & Engineering student based in Odisha, India. My passion lies in building real-world web applications that blend clean UI architecture with robust backend APIs. I focus on writing maintainable TypeScript, architecting accessible React interfaces, and understanding the core computer science principles powering modern distributed web systems.',
    location: 'Odisha, India',
    currentStatus: '3rd-Year B.Tech Computer Science & Engineering Undergraduate',
    availabilityStatus: '',
    avatarUrl: '/src/assets/images/santosh_formal_suit_portrait_1791041720230.jpg',
    email: 'santoshmishras951@gmail.com',
    phone: '+91 9668139559',
    philosophy: 'Write clean code, understand the core mechanics before reaching for abstractions, and design user interfaces that are fast, accessible, and respect user attention.',
    interests: [
      'Frontend Engineering',
      'Distributed Web Systems',
      'Database Architecture',
      'UI/UX Design Systems',
      'Open Source Contribution'
    ]
  },
  skills: [
    {
      id: 'skill-react',
      name: 'React',
      category: 'Frontend',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'SPA architecture, custom hooks, state management, accessibility, and modern functional components.',
      displayOrder: 1,
      isVisible: true
    },
    {
      id: 'skill-ts',
      name: 'TypeScript',
      category: 'Programming',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Static typing, generic constraints, interface segregation, and type-safe API contracts.',
      displayOrder: 2,
      isVisible: true
    },
    {
      id: 'skill-js',
      name: 'JavaScript (ES6+)',
      category: 'Programming',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Event loop, asynchronous programming, DOM manipulation, promises, and modern ES features.',
      displayOrder: 3,
      isVisible: true
    },
    {
      id: 'skill-tailwind',
      name: 'Tailwind CSS',
      category: 'Frontend',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Utility-first styling, design system tokens, responsive layouts, and dark mode theming.',
      displayOrder: 4,
      isVisible: true
    },
    {
      id: 'skill-nextjs',
      name: 'Next.js',
      category: 'Frontend',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Server components, client rendering, file-system routing, and SEO optimization.',
      displayOrder: 5,
      isVisible: true
    },
    {
      id: 'skill-html-css',
      name: 'HTML5 & CSS3',
      category: 'Frontend',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Semantic markup, accessible forms, flexbox, CSS grid, and responsive media queries.',
      displayOrder: 6,
      isVisible: true
    },
    {
      id: 'skill-node',
      name: 'Node.js',
      category: 'Backend',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Server-side runtime, asynchronous I/O, file handling, and modular service architecture.',
      displayOrder: 7,
      isVisible: true
    },
    {
      id: 'skill-express',
      name: 'Express.js',
      category: 'Backend',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Middleware pipelines, routing, authentication guards, and error handling.',
      displayOrder: 8,
      isVisible: true
    },
    {
      id: 'skill-rest',
      name: 'REST APIs',
      category: 'Backend',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Resource naming, status codes, query filtering, pagination, and payload validation.',
      displayOrder: 9,
      isVisible: true
    },
    {
      id: 'skill-mongodb',
      name: 'MongoDB',
      category: 'Database',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Document schema design, aggregation pipelines, Mongoose modeling, and indexing.',
      displayOrder: 10,
      isVisible: true
    },
    {
      id: 'skill-postgres',
      name: 'PostgreSQL',
      category: 'Database',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Relational schema design, SQL queries, foreign key constraints, and ACID transactions.',
      displayOrder: 11,
      isVisible: true
    },
    {
      id: 'skill-firebase',
      name: 'Firebase',
      category: 'Database',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Firestore collections, client-side authentication, and cloud security rules.',
      displayOrder: 12,
      isVisible: true
    },
    {
      id: 'skill-git',
      name: 'Git & GitHub',
      category: 'Tools',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Version control branching strategies, PR reviews, merge conflict resolution, and commits.',
      displayOrder: 13,
      isVisible: true
    },
    {
      id: 'skill-figma',
      name: 'Figma',
      category: 'Tools',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Wireframing, interactive prototyping, component variants, and design handoff.',
      displayOrder: 14,
      isVisible: true
    },
    {
      id: 'skill-aws',
      name: 'AWS / Cloud Fundamentals',
      category: 'Cloud',
      proficiency: 'Intermediate',
      yearsExperience: '',
      description: 'Basic compute (EC2), storage (S3), IAM policies, and cloud deployment pipelines.',
      displayOrder: 15,
      isVisible: true
    }
  ],
  projects: [
    {
      id: 'proj-kanihamedical',
      title: 'Kaniha Medical - Clinic & Health Inventory System',
      shortDescription: 'Comprehensive full-stack clinical management and pharmaceutical stock tracking web application designed for regional healthcare practitioners.',
      detailedDescription: 'Kaniha Medical is a production-style healthcare web application developed to streamline patient consultations, digital health records, appointment scheduling, and automated pharmaceutical stock alerts. Built to handle clinical workflows with high data integrity and responsive accessibility.',
      category: 'Full-Stack Web App',
      projectImage: '/src/assets/images/project_kanihamedical_1791011611801.jpg',
      galleryImages: [
        '/src/assets/images/project_kanihamedical_1791011611801.jpg'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Tailwind CSS'],
      githubUrl: 'https://github.com/santoshmishra/kaniha-medical-system',
      liveDemoUrl: 'https://kaniha-medical.vercel.app/',
      caseStudyUrl: 'file:///C:/Users/USER/OneDrive/Documents/Desktop/medical.pdf',
      startDate: 'Aug 2024',
      completionDate: 'Nov 2024',
      isFeatured: true,
      displayOrder: 1,
      challenges: 'Managing multi-table relational records between visiting doctors, daily appointments, patient diagnoses, and dynamic medicine batch expiry without causing data synchronization anomalies.',
      solution: 'Engineered a normalized PostgreSQL relational database schema with transactional locks for stock updates and an intuitive React interface featuring live validation and optimistic UI states.',
      keyFeatures: [
        'Real-time appointment calendar with slot reservation logic',
        'Patient digital record management with encrypted historical notes',
        'Pharmacy stock tracker with automatic low-quantity alerts',
        'Role-based access view for doctors, receptionist, and pharmacist'
      ],
      myContribution: 'Architected the backend RESTful API in Express.js, structured database schemas with indexing, and implemented responsive clinic dashboard views with dark/light mode.',
      results: 'Reduced patient intake registration time and demonstrated zero inventory stock mismatch during local pilot testing.',
      architectureExplanation: 'Client-server architecture with Express API serving JSON endpoints, secured with JWT headers, paired with a React single-page frontend styled with utility-first Tailwind CSS.',
      isVisible: true
    },
    {
      id: 'proj-techgrads',
      title: 'TechGrads - Engineering Campus Placement Readiness Portal',
      shortDescription: 'Interactive skill readiness and placement preparation platform for engineering undergraduates with structured DSA roadmaps and mock analytics.',
      detailedDescription: 'TechGrads is a student-centric platform engineered to bridge the gap between engineering college curricula and modern software engineering recruitment standards. It features interactive technical track roadmaps, curated algorithmic problem lists, and personal progress analytics.',
      category: 'EdTech / Web Platform',
      projectImage: '/src/assets/images/project_techgrads_1791011625834.jpg',
      galleryImages: [
        '/src/assets/images/project_techgrads_1791011625834.jpg'
      ],
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'REST APIs', 'Express.js'],
      githubUrl: 'https://github.com/santoshmishra/techgrads-portal',
      liveDemoUrl: 'https://aistudio.google.com/apps/2a257f0f-ecc0-49e1-b459-f3de874875cb?showPreview=true&showAssistant=true&fullscreenApplet=true',
      caseStudyUrl: '',
      startDate: 'Jan 2024',
      completionDate: 'Apr 2024',
      isFeatured: true,
      displayOrder: 2,
      challenges: 'Providing students with intuitive visual feedback of their multi-topic preparation status across 100+ data structures and algorithms questions without heavy bundle footprints.',
      solution: 'Designed lightweight modular state hooks in React with localized cache strategies and a flexible MongoDB document model for topic hierarchies and user progress documents.',
      keyFeatures: [
        'Curated technical roadmap: DSA, Web Tech, Core CS (OS, DBMS, CN)',
        'Personal readiness dashboard with completion percentages and streak tracker',
        'Code snippet viewer with syntax highlighting and complexity analysis',
        'Searchable repository of company-wise interview experiences and guides'
      ],
      myContribution: 'Led frontend UI design from initial Figma wireframes to full React implementation, and designed MongoDB collection schemas for student milestones.',
      results: 'Adopted by peer engineering student study circles at college with over 150 active problem completions logged.',
      architectureExplanation: 'React SPA on Vite communicating with an Express.js microservice layer backed by MongoDB Atlas cloud database.',
      isVisible: true
    },
    {
      id: 'proj-artisan-marketplace',
      title: 'CraftOdisha - AI-Assisted Artisan Heritage Marketplace',
      shortDescription: 'Digital catalog and direct inquiry marketplace empowering traditional Odisha weavers and brass craft artisans with multilingual automated cataloging.',
      detailedDescription: 'CraftOdisha is a digital heritage commerce platform built to empower indigenous artisans and handicraft makers in Odisha. It facilitates automated product cataloging from simple smartphone photo uploads and enables direct buyer inquiries without intermediary markups.',
      category: 'E-Commerce / Heritage',
      projectImage: '/src/assets/images/project_artisan_marketplace_1791011636769.jpg',
      galleryImages: [
        '/src/assets/images/project_artisan_marketplace_1791011636769.jpg'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Firebase Firestore', 'Express.js'],
      githubUrl: 'https://github.com/santoshmishra/craft-odisha-marketplace',
      liveDemoUrl: 'https://www.craftsodisha.com/?srsltid=AU7gw4V1LlnBSmXwrN4C9f3mn67eQP3C4K0kJW4h1Dkml_qC3ny-SrIr',
      caseStudyUrl: '',
      startDate: 'Oct 2024',
      completionDate: 'Jan 2025',
      isFeatured: true,
      displayOrder: 3,
      challenges: 'Traditional artisans often lack the time or digital literacy to write descriptive SEO product listings and handle complex e-commerce checkouts.',
      solution: 'Created a minimal upload flow where artisans upload a single craft photo, and automated assistive cataloging generates descriptive product tags, heritage backstories, and direct WhatsApp buyer connect links.',
      keyFeatures: [
        'Clean high-contrast craft showcases for Dhokra brass craft and Sambalpuri textiles',
        'Direct WhatsApp contact generation with pre-filled item references for buyers',
        'Bilingual English / Odia metadata support',
        'Category filters by regional craft clusters and materials'
      ],
      myContribution: 'Developed the front-end catalog browsing experience, built mobile-first search filters, and implemented direct inquiry link generation.',
      results: 'Showcased at institutional student innovation showcase with praise for regional cultural empowerment.',
      architectureExplanation: 'Full-stack application with React frontend, server-side REST API, and Firestore database for fast real-time catalog syncing.',
      isVisible: true
    },
    {
      id: 'proj-portfolio-cms',
      title: 'Personal Developer Portfolio & Headless Admin CMS',
      shortDescription: 'High-performance personal developer portfolio with dynamic content management, real-time message tracking, and private administrative dashboard.',
      detailedDescription: 'A production-grade, fully dynamic portfolio website and custom content management system built specifically for software engineers. Allows complete real-time control over projects, skills, education, experience, achievements, and contact responses without modifying source code.',
      category: 'Full-Stack Web App',
      projectImage: '/src/assets/images/project_portfolio_showcase_1791011648013.jpg',
      galleryImages: [
        '/src/assets/images/project_portfolio_showcase_1791011648013.jpg'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'Tailwind CSS', 'Vite'],
      githubUrl: 'https://github.com/santoshmishra/portfolio-cms',
      liveDemoUrl: 'https://contra.com/community/LGZtOoTy-personal-portfolio-and-headless-cms',
      caseStudyUrl: 'https://contra.com/community/LGZtOoTy-personal-portfolio-and-headless-cms',
      startDate: 'Feb 2025',
      completionDate: 'Present',
      isFeatured: true,
      displayOrder: 4,
      challenges: 'Building an enterprise-grade admin experience with full CRUD operations, secure authentication, file upload safety, and live public sync while maintaining instant performance.',
      solution: 'Implemented atomic persistent storage with RESTful endpoints, cryptographic authentication, and clean separation between public views and protected administrative controls.',
      keyFeatures: [
        'Zero-code public website updates via password-protected admin dashboard',
        'Contact inquiry inbox with status tracking and direct email/WhatsApp reply links',
        'Dynamic resume manager with versioning and public download toggle',
        'Dark/Light/System theme persistence and responsive mobile drawer navigation'
      ],
      myContribution: 'Designed and built the entire application end-to-end including database architecture, REST endpoints, security controls, and responsive UI components.',
      results: 'Delivers sub-100ms API response times and a clean, distraction-free recruiter presentation.',
      architectureExplanation: 'Express.js backend integrated directly with Vite SPA middleware, custom persistent storage engine, and JWT bearer authentication.',
      isVisible: true
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'UpToSkills',
      position: 'Web Development Intern',
      employmentType: '3 Months Internship',
      location: 'Remote / Hybrid',
      startDate: '2024',
      endDate: '2024',
      currentlyWorking: false,
      description: 'Completed a comprehensive 3-month web development internship focusing on production-grade frontend architecture, interactive UI engineering, and collaborative team delivery.',
      responsibilities: [
        'Developed responsive and user-friendly web interfaces using HTML, CSS, JavaScript, and React.js.',
        'Worked on real-world web development tasks and contributed to team-based projects.',
        'Collaborated with other developers using Git and GitHub.',
        'Took responsibility as a Development Team Captain, coordinating tasks and supporting team members.',
        'Improved practical skills in frontend development, debugging, and deployment.'
      ],
      achievements: [
        'Served as Development Team Captain, coordinating sprint deliverables and mentoring team peers.'
      ],
      technologies: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'GitHub', 'Responsive UI'],
      companyLogo: '',
      companyUrl: '',
      displayOrder: 1
    },
    {
      id: 'exp-2',
      company: 'Internshala',
      position: 'Web Development Intern',
      employmentType: 'Web Development Internship',
      location: 'Remote',
      startDate: '2024',
      endDate: '2024',
      currentlyWorking: false,
      description: 'Engaged in hands-on practical web development assignments and real-world project modules following structured modern web development workflows.',
      responsibilities: [
        'Built responsive web pages using HTML, CSS, and JavaScript.',
        'Worked on practical web development assignments and projects.',
        'Implemented responsive layouts and interactive UI components.',
        'Strengthened fundamentals of frontend development, Git, and web technologies.',
        'Gained hands-on experience following a structured development workflow.'
      ],
      achievements: [
        'Successfully built and deployed interactive web project modules meeting industry standards.'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Git', 'Web Technologies'],
      companyLogo: '',
      companyUrl: '',
      displayOrder: 2
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'B.Tech in Computer Science & Engineering',
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Engineering',
      startYear: '2024',
      endYear: '2028',
      currentStatus: 'Pursuing B.Tech CSE',
      grade: '8.4 / 10 CGPA',
      description: 'Core coursework includes Data Structures & Algorithms, Object-Oriented Programming (Java/C++), Database Management Systems (DBMS), Operating Systems, Computer Networks, and Software Engineering.',
      institutionLogo: '',
      certificateLink: '',
      displayOrder: 1
    },
    {
      id: 'edu-2',
      institution: 'Higher Secondary Education (Class XII - Science)',
      degree: 'Higher Secondary Certificate (CHSE)',
      field: 'Science (Physics, Chemistry, Mathematics, CS)',
      startYear: '2022',
      endYear: '2024',
      currentStatus: 'Completed with Distinction',
      grade: '88.6%',
      description: 'Excelled in Mathematics and Computer Science fundamentals, participating in state-level science exhibitions and computational problem-solving.',
      institutionLogo: '',
      certificateLink: '',
      displayOrder: 2
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Third Place - Regional Inter-College Hackathon',
      organization: 'State Technical University Innovation Cell',
      date: 'Oct 2024',
      description: 'Built a working prototype of an emergency medical supply and doctor appointment booking system for rural clinics within 36 hours.',
      certificateImage: '',
      verificationUrl: '',
      category: 'Hackathon',
      displayOrder: 1
    },
    {
      id: 'ach-2',
      title: 'Full-Stack Web Development Certification',
      organization: 'Industry-Standard Online Curriculum',
      date: 'July 2025',
      description: 'Completed 120+ hours of rigorous coursework covering modern React architecture, Node.js REST APIs, MongoDB integration, and secure web application development.',
      certificateImage: '',
      verificationUrl: '',
      category: 'Certification',
      displayOrder: 2
    },
    {
      id: 'ach-3',
      title: 'Technical Symposium Web Lead Recognition',
      organization: 'Department of Computer Science & Engineering',
      date: 'March 2026',
      description: 'Awarded letter of appreciation for designing and managing the institutional event registration portal handling 400+ participants.',
      certificateImage: '',
      verificationUrl: '',
      category: 'Academic',
      displayOrder: 3
    }
  ],
  resumes: [
    {
      id: 'resume-1',
      title: 'Santosh Mishra - Software Engineer Resume',
      fileUrl: '/api/resume/download',
      fileName: 'Santosh_Mishra_Resume.pdf',
      fileSize: '148 KB',
      uploadDate: 'March 2026',
      version: 'v2.4',
      isCurrent: true
    }
  ],
  messages: [
    {
      id: 'msg-sample-1',
      name: 'Priya Sharma',
      email: 'priya.sharma@talenttech.example.com',
      phone: '+91 98111 22334',
      company: 'TalentTech Solutions',
      subject: 'Inquiry regarding Software Engineering Internship 2026',
      message: 'Hello Santosh, I reviewed your Kaniha Medical project and was impressed with the clean interface and API structure. We are looking for undergraduate software engineering interns for Summer 2026. Would you be open to an introductory call?',
      createdAt: '2026-09-28T14:32:00.000Z',
      status: 'unread',
      ip: '103.21.244.2',
      notes: ''
    }
  ],
  socialLinks: [
    {
      id: 'soc-github',
      platform: 'GitHub',
      url: 'https://github.com/santoshmishras951-coder',
      iconName: 'Github',
      displayName: 'github.com/santoshmishras951-coder',
      isVisible: true,
      displayOrder: 1
    },
    {
      id: 'soc-linkedin',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/santosh-mishra-3rd-year-499b86331/?isSelfProfile=true',
      iconName: 'Linkedin',
      displayName: 'linkedin.com/in/santosh-mishra',
      isVisible: true,
      displayOrder: 2
    },
    {
      id: 'soc-email',
      platform: 'Gmail',
      url: 'https://mail.google.com/mail/u/0/#inbox?compose=new',
      iconName: 'Mail',
      displayName: 'Gmail',
      isVisible: true,
      displayOrder: 3
    },
    {
      id: 'soc-whatsapp',
      platform: 'WhatsApp',
      url: 'https://wa.me/919668139559',
      iconName: 'MessageCircle',
      displayName: 'WhatsApp (+91 9668139559)',
      isVisible: true,
      displayOrder: 4
    }
  ],
  settings: {
    siteTitle: 'Santosh Mishra - Software Engineer & Web Developer Portfolio',
    metaDescription: 'Portfolio of Santosh Mishra, 3rd-year Computer Science Engineering student building production-ready web applications with React, TypeScript, Node.js, and modern databases.',
    ogTitle: 'Santosh Mishra - Software Engineer Portfolio',
    ogDescription: 'Explore full-stack web applications, technical skill sets, and projects by Santosh Mishra, B.Tech CSE student from Odisha, India.',
    ogImage: '/src/assets/images/santosh_profile_photo_1791011596236.jpg',
    canonicalUrl: 'https://santosh-mishra.dev',
    notificationEmail: 'santoshmishras951@gmail.com',
    emailNotificationsEnabled: false,
    allowPublicResumeDownload: true,
    showAvailabilityBadge: true,
    analyticsNoticeEnabled: true,
    privacyPolicyContent: 'This website respects visitor privacy. Information submitted through the contact form (name, email, phone, and message) is stored securely in our private database solely for the purpose of communicating back with you. We do not sell, rent, or distribute personal information to third parties, nor do we track visitors across other websites.'
  },
  media: [
    {
      id: 'med-avatar',
      name: 'Santosh Mishra Profile Photo',
      originalName: 'santosh_profile_photo.jpg',
      url: '/src/assets/images/santosh_profile_photo_1791011596236.jpg',
      mimeType: 'image/jpeg',
      size: 142000,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'med-kanihamedical',
      name: 'Kaniha Medical Screenshot',
      originalName: 'project_kanihamedical.jpg',
      url: '/src/assets/images/project_kanihamedical_1791011611801.jpg',
      mimeType: 'image/jpeg',
      size: 215000,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'med-techgrads',
      name: 'TechGrads Screenshot',
      originalName: 'project_techgrads.jpg',
      url: '/src/assets/images/project_techgrads_1791011625834.jpg',
      mimeType: 'image/jpeg',
      size: 198000,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'med-artisan',
      name: 'CraftOdisha Marketplace Screenshot',
      originalName: 'project_artisan_marketplace.jpg',
      url: '/src/assets/images/project_artisan_marketplace_1791011636769.jpg',
      mimeType: 'image/jpeg',
      size: 240000,
      uploadedAt: new Date().toISOString()
    },
    {
      id: 'med-portfolio',
      name: 'Portfolio CMS Screenshot',
      originalName: 'project_portfolio_showcase.jpg',
      url: '/src/assets/images/project_portfolio_showcase_1791011648013.jpg',
      mimeType: 'image/jpeg',
      size: 180000,
      uploadedAt: new Date().toISOString()
    }
  ]
};
