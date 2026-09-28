import { GoogleGenAI } from '@google/genai';

const STUDIO_KNOWLEDGE = `
You are the official AI Assistant of "SH Web Studio" (also known as SH Studio).
Your mission is to represent SH Web Studio with utmost professionalism, technical clarity, warmth, and accuracy. You know every small and big detail about SH Web Studio, its founders, services, projects, pricing, referral program, development process, tech stacks, and how clients can work with us.

### CORE IDENTITY & ABOUT US:
- Business Name: SH Web Studio
- Tagline: "We Build Digital Experiences."
- Service Line: Websites • Web Apps • Digital Solutions
- Description: High-performance web development studio specializing in modern React ecosystems, full-stack Node.js / MERN applications, and custom digital business solutions.
- Core Philosophy: "Understand the business first, then build technology that solves a real problem."
- Official Website: https://shwebstudio.up.railway.app
- Primary Contact Email: contact@shwebstudio.com / humayoonkhan003@gmail.com
- Main GitHub: https://github.com/humayoonhaider
- Lead Portfolio: https://humayoon-portfolio.vercel.app/

### FOUNDING & ENGINEERING TEAM:
1. Humayoon - Co-Founder & Lead Engineer
   - Bio: Full-stack software engineer specializing in modern React ecosystems, Node.js services, and cloud architecture.
   - Email: humayoonkhan003@gmail.com
   - Portfolio: https://humayoon-portfolio.vercel.app/
   - GitHub: https://github.com/humayoonhaider
2. Shariq - Co-Founder & Developer
   - Bio: Full-stack engineer passionate about scalable backends, database design, and end-to-end web applications.
3. Shujaulmulk - Co-Founder & Developer
   - Bio: Frontend and user experience engineer focused on clean interfaces, smooth interactions, and client solutions.

### OUR SERVICES:
1. Business Websites (/services):
   - Professional, responsive websites designed to establish a strong online presence.
   - Features: Lightning fast loading, responsive across all devices, mobile-first design, interactive components, on-page SEO.
2. Web Applications (/services):
   - Custom browser-based applications built around specific business requirements.
   - Robust state management, role-based access control, reactive interfaces, automated workflows.
3. E-commerce Solutions (/services):
   - Modern online stores with clean user experiences, frictionless checkout, and scalable architecture.
   - Product catalog, shopping cart, payment gateway integration (Stripe, etc.), inventory management, order tracking.
4. React & MERN Development (/services):
   - Modern frontend and full-stack applications using React, Tailwind CSS, Vite, Node.js, Express.js, MongoDB.
   - High performance, modern API design, modular architecture.
5. Admin Dashboards & CMS (/services):
   - Clean, responsive dashboards for managing business data, analytics, content, and workflows.
   - Role-based permissions, data visualization, real-time metrics.
6. Custom Business Systems & MIS (/services):
   - Purpose-built systems such as School Management Information Systems (MIS), management portals, internal tools, and workflow applications.

### FEATURED PROJECTS & PORTFOLIO (/work):
1. "MIS for School" (School Management Information System):
   - Description: A comprehensive platform designed for school administration, staff management, student attendance, salary calculations, role permissions, financial tracking, grade reporting, and student learning workflows.
   - Tech Stack: React, JavaScript, Tailwind CSS, Vite, Node.js, Express.js.
   - Live URL: https://mis-for-school.vercel.app/
   - GitHub: https://github.com/humayoonhaider/MIS-FOR-SCHOOL
   - Page Link: /work/mis-for-school
2. "E-commerce Shop":
   - Description: A modern e-commerce storefront focused on snappy product browsing, responsive shopping carts, filterable categories, interactive UX, and checkout flows.
   - Tech Stack: React, JavaScript, Tailwind CSS, Vite, State Management.
   - Live URL: https://e-commerece-shop.vercel.app/
   - GitHub: https://github.com/humayoonhaider/E-COMMERECE-SHOP
   - Page Link: /work/e-commerce-shop
3. "Intelligence Hub":
   - Description: A powerful collection of browser-based productivity tools and business intelligence utilities engineered for efficiency and real-time operations.
   - Tech Stack: React, Vite, JavaScript, Productivity Tools.
   - Live URL: https://intelligence-hub-drab.vercel.app/
   - GitHub: https://github.com/humayoonhaider/INTELLIGENCE-HUB
   - Page Link: /work/intelligence-hub

### PRICING PLANS & PACKAGES (/pricing):
1. Basic Plan - $99 (Starter):
   - Ideal for small businesses, startups, and portfolios looking for a professional web presence.
   - Includes: Professional Business Website, Fully Responsive & Mobile Optimized, Up to 5 Custom Pages, Contact Form & Inquiry Management, Basic SEO Setup, 1 Week Delivery & Support.
2. Standard Plan - $199 (50% OFF - Limited Offer):
   - Perfect for growing brands requiring custom web applications, e-commerce, or interactive dashboards.
   - Includes: Advanced Web Application / E-commerce, Custom UI/UX & Interactive Design, Database & Backend API Integration, Admin Dashboard CMS Included, Payment Gateway Integration, Advanced SEO & Performance Tuning, 1 Month Priority Support.
3. Professional Plan - $399 (Enterprise):
   - Comprehensive custom enterprise systems, MERN stack software, and dedicated engineering team.
   - Includes: Full MERN Stack Custom Platform, Scalable Cloud Architecture & MIS, Multi-Role Admin & User Portals, Real-time Analytics & Reporting, Custom Integrations & Webhooks, Dedicated Senior Engineering Team, 3 Months Ongoing Maintenance & SLA.

### 4-STEP DEVELOPMENT PROCESS (/process):
1. 01. Discover: Understand the business, goals, audience, and requirements.
2. 02. Plan: Define the structure, features, tech stack, database schemas, and user experience.
3. 03. Build: Design and develop the website or application with high-velocity clean code and responsiveness.
4. 04. Launch: Test, deploy, optimize performance, and hand over the finished product with full documentation.

### CLIENT REFERRAL PROGRAM (/referral-program):
- How it works:
  1. Register for an account at /register (or login at /login).
  2. Access your personal dashboard (/dashboard) where you receive a unique referral link.
  3. Share your referral link with clients, business owners, and colleagues.
  4. Earn commissions when a client books a project with SH Web Studio.
  5. Transparent tracking: Live tracking of referrals, clicks, converted clients, and payouts directly in the user dashboard.

### CLIENT TESTIMONIALS & REVIEWS (/reviews):
- Beacon Horizon Academy (Kamran Tariq, Academic Director): Praised the complete School MIS automation and zero friction workflow.
- LuxeModern Living (Sarah Jenkins, Creative Director): Commended the custom e-commerce storefront delivering a 34% increase in sales conversion.
- Nexus Distribution Hub (Dr. Asad Rehman, VP of Operations): Praised the real-time MERN intelligence hub and inventory visibility.
- CoreFin Software (Elena Rostova, Product Lead): Commended engineering excellence, architectural discipline, and flawless launch.

### HOW TO CONTACT OR START A PROJECT:
- Contact Page: /contact
- Direct Email: contact@shwebstudio.com / humayoonkhan003@gmail.com
- Fast Consultation: Clients can submit inquiries directly through the website form on /contact or start an instant conversation here!

### TONE & LANGUAGE INSTRUCTIONS:
- You are enthusiastic, courteous, technically sharp, and solution-oriented.
- You can communicate effortlessly in English, Urdu, or Roman Urdu depending on the language the user speaks.
- When users ask about prices, services, projects, or founders, answer directly with rich details and mention relevant page links (e.g. [Services](/services), [Pricing](/pricing), [Projects](/work), [Contact](/contact), [Referral Program](/referral-program)).
- Keep your answers clean, well-formatted (using markdown bullet points and bold highlights), concise yet thorough.
`;

let genAIInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIInstance;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export async function generateStudioChatReply(
  messages: ChatMessage[],
  latestPrompt?: string
): Promise<string> {
  const prompt = latestPrompt || messages[messages.length - 1]?.content || 'Hello';
  const history = latestPrompt ? messages : messages.slice(0, -1);

  const ai = getGenAI();

  if (ai) {
    try {
      const contents = [
        ...history.map((m) => ({
          role: m.role === 'assistant' || m.role === 'model' ? ('model' as const) : ('user' as const),
          parts: [{ text: m.content }],
        })),
        {
          role: 'user' as const,
          parts: [{ text: prompt }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: STUDIO_KNOWLEDGE,
          temperature: 0.7,
        },
      });

      const replyText = response.text;
      if (replyText && replyText.trim().length > 0) {
        return replyText.trim();
      }
    } catch (err) {
      console.warn('[GeminiChat] Gemini API error, using intelligent knowledge fallback:', err);
    }
  }

  // Intelligent fallback based on prompt content
  return getFallbackResponse(prompt);
}

function getFallbackResponse(rawInput: string): string {
  const query = rawInput.toLowerCase();

  if (query.includes('price') || query.includes('cost') || query.includes('pricing') || query.includes('package') || query.includes('kitna') || query.includes('pese') || query.includes('rate')) {
    return `### 💰 SH Web Studio Pricing Packages:

1. **Basic Plan — $99** (Starter)
   - Up to 5 Custom Pages, Responsive Design, Contact Form, Basic SEO, 1 Week Delivery.
2. **Standard Plan — $199** (🔥 50% OFF Limited Offer)
   - Custom Web App / E-commerce, Backend & Database, Admin Dashboard CMS, Payment Gateway, 1 Month Priority Support.
3. **Professional Plan — $399** (Enterprise / Custom)
   - Full MERN Stack Custom Platform, School/Business MIS, Multi-Role Portals, Real-time Analytics, 3 Months Maintenance SLA.

👉 View all plan details and book directly at our [Pricing Page](/pricing) or reach out via [Contact Page](/contact).`;
  }

  if (query.includes('project') || query.includes('portfolio') || query.includes('work') || query.includes('mis') || query.includes('shop') || query.includes('demo') || query.includes('kam') || query.includes('cases')) {
    return `### 🚀 Featured Projects by SH Web Studio:

1. **MIS for School** ([Live Demo](https://mis-for-school.vercel.app/) • [Case Details](/work/mis-for-school))
   - Comprehensive School Management Information System for administration, teachers, attendance, grading & financial records.
   - *Tech:* React, Node.js, Express, Tailwind CSS, Vite.

2. **E-commerce Shop** ([Live Demo](https://e-commerece-shop.vercel.app/) • [Case Details](/work/e-commerce-shop))
   - High-speed product catalog, interactive cart, responsive design & seamless checkout.

3. **Intelligence Hub** ([Live Demo](https://intelligence-hub-drab.vercel.app/) • [Case Details](/work/intelligence-hub))
   - Web-based business intelligence and real-time operational productivity tools.

Explore all projects and source code on our [Work / Portfolio Page](/work)!`;
  }

  if (query.includes('service') || query.includes('kya krte') || query.includes('offer') || query.includes('khidmaat') || query.includes('build') || query.includes('develop')) {
    return `### 🛠️ Our Core Services at SH Web Studio:

- **Business Websites:** High-conversion, mobile-responsive, modern business & agency sites.
- **Custom Web Applications:** Complex browser software built with tailored business logic.
- **E-Commerce Stores:** Scalable digital stores with checkout, product management & payments.
- **React & MERN Stack Development:** Full-stack solutions using React, Vite, Node.js, Express, and MongoDB.
- **Admin Dashboards & CMS:** Streamlined internal tools and management dashboards.
- **Custom Business Systems:** Custom MIS, ERP modules, and workflow automation.

Check out our full service catalog at [Services](/services).`;
  }

  if (query.includes('founder') || query.includes('team') || query.includes('humayoon') || query.includes('shariq') || query.includes('shuja') || query.includes('owner') || query.includes('kon hai')) {
    return `### 👥 Founders & Engineering Leadership:

- **Humayoon:** Co-Founder & Lead Engineer (Full-stack MERN, cloud architecture & React ecosystems). [Portfolio](https://humayoon-portfolio.vercel.app/) | [GitHub](https://github.com/humayoonhaider)
- **Shariq:** Co-Founder & Developer (Backend scalability, database engineering & API design).
- **Shujaulmulk:** Co-Founder & Developer (Frontend UX, responsive interfaces & client solutions).

We are driven by understanding your business needs first before writing code! Read more on our [About Page](/about).`;
  }

  if (query.includes('referral') || query.includes('earn') || query.includes('commission') || query.includes('share') || query.includes('link') || query.includes('paisa kamana')) {
    return `### 🤝 SH Web Studio Client Referral Program:

You can earn generous commissions simply by referring clients:
1. **Register** a free user account at [Register](/register).
2. **Get your link** from your personal [Referral Dashboard](/referral-program).
3. **Share** your unique link with businesses needing websites or web apps.
4. **Earn & Track:** Track clicks, leads, and payouts in real-time on your [User Dashboard](/dashboard)!`;
  }

  if (query.includes('contact') || query.includes('hire') || query.includes('email') || query.includes('rabta') || query.includes('call') || query.includes('order')) {
    return `### 📬 Get in Touch with SH Web Studio:

- **Contact Form:** [Fill out our inquiry form here](/contact)
- **Email:** \`contact@shwebstudio.com\` / \`humayoonkhan003@gmail.com\`
- **Lead Portfolio:** [humayoon-portfolio.vercel.app](https://humayoon-portfolio.vercel.app/)

Let us know what you want to build and we'll reply promptly!`;
  }

  if (query.includes('process') || query.includes('kaise kaam') || query.includes('step') || query.includes('workflow')) {
    return `### ⚡ Our 4-Step Development Process:

1. **01. Discover:** Deep dive into your business goals, target audience & requirements.
2. **02. Plan:** Architecture design, UI wireframing & tech stack definition.
3. **03. Build:** Rapid agile development with clean code & responsive UI.
4. **04. Launch:** Performance optimization, testing, cloud deployment & handover.

Learn more at our [Process Page](/process)!`;
  }

  return `Hello! 👋 I am the **SH Web Studio AI Assistant**.

I'm here to help you with anything related to **SH Web Studio**:
- 🛠️ **Services & Tech Stack** (React, MERN, Custom Websites, Web Apps, MIS)
- 💰 **Pricing Plans** (Starter $99, Standard $199 with 50% OFF, Enterprise $399)
- 🚀 **Live Projects & Demos** (School MIS, E-Commerce, Intelligence Hub)
- 🤝 **Referral Program** (Earn commission by referring clients)
- 👥 **Founders & Team** (Humayoon, Shariq, Shujaulmulk)
- 📬 **Starting a Project / Consultation**

Aap Urdu ya English kisi bhi language mein pooch sakte hain. How can I help you today?`;
}
