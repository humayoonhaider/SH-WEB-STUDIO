import { Project } from '../types';

export const defaultProjects: Project[] = [
  {
    _id: 'proj_mis_school',
    title: 'MIS for School',
    slug: 'mis-for-school',
    category: 'School Management System',
    description:
      'A comprehensive management platform designed for school administration, staff management, student attendance, salaries, permissions, financial tracking and student learning workflows.',
    imageUrl: '',
    liveUrl: 'https://mis-for-school.vercel.app/',
    githubUrl: 'https://github.com/humayoonhaider/MIS-FOR-SCHOOL',
    featured: true,
    order: 1,
    isActive: true,
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Express.js'],
  },
  {
    _id: 'proj_ecommerce_shop',
    title: 'E-commerce Shop',
    slug: 'e-commerce-shop',
    category: 'E-commerce',
    description:
      'A modern e-commerce interface focused on product browsing, shopping experiences and responsive frontend design.',
    imageUrl: '',
    liveUrl: 'https://e-commerece-shop.vercel.app/',
    githubUrl: 'https://github.com/humayoonhaider/E-COMMERECE-SHOP',
    featured: true,
    order: 2,
    isActive: true,
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'State Management'],
  },
  {
    _id: 'proj_intelligence_hub',
    title: 'Intelligence Hub',
    slug: 'intelligence-hub',
    category: 'Web Application',
    description:
      'A collection of browser-based productivity and intelligence tools built with React and Vite.',
    imageUrl: '',
    liveUrl: 'https://intelligence-hub-drab.vercel.app/',
    githubUrl: 'https://github.com/humayoonhaider/INTELLIGENCE-HUB',
    featured: true,
    order: 3,
    isActive: true,
    technologies: ['React', 'Vite', 'JavaScript', 'Productivity Tools'],
  },
];
