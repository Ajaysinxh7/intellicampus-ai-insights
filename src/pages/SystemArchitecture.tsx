import SectionHeader from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { 
  Layout, Server, Database, Lock, 
  Brain, FileJson, Cloud, Activity 
} from "lucide-react";

const SystemArchitecture = () => {
  const components = [
    {
      icon: Layout,
      title: "Frontend (React)",
      description: "Modern React application with TypeScript, Tailwind CSS, and responsive design. Interactive dashboards for attendance, marks, and chat interface.",
      tech: ["React", "TypeScript", "Tailwind CSS", "React Query"]
    },
    {
      icon: Server,
      title: "Backend API (Node.js/Express)",
      description: "RESTful API handling all CRUD operations, authentication middleware, and request validation. Connects frontend with database and ML services.",
      tech: ["Node.js", "Express", "JWT Auth", "REST API"]
    },
    {
      icon: Lock,
      title: "Authentication Service",
      description: "Secure JWT-based authentication with role-based access control (Student, Faculty, Admin). Password hashing and session management.",
      tech: ["JWT", "bcrypt", "RBAC", "Session Management"]
    },
    {
      icon: Brain,
      title: "ML Service (Python)",
      description: "Flask/FastAPI service running machine learning models for attendance and marks prediction. Exposes endpoints for model inference.",
      tech: ["Python", "Flask/FastAPI", "scikit-learn", "pandas"]
    },
    {
      icon: FileJson,
      title: "Vector DB / RAG",
      description: "Stores student data as embeddings for semantic search. Enables RAG pipeline to retrieve relevant context before LLM generation.",
      tech: ["Pinecone/Chroma", "OpenAI Embeddings", "Similarity Search"]
    },
    {
      icon: Database,
      title: "Database (PostgreSQL)",
      description: "Relational database storing users, attendance records, marks, subjects, and chat history. Optimized queries and proper indexing.",
      tech: ["PostgreSQL", "SQL", "Indexing", "Relationships"]
    },
    {
      icon: Cloud,
      title: "Storage (S3)",
      description: "Cloud object storage for files, documents, and backups. Scalable and secure file management system.",
      tech: ["AWS S3", "CDN", "File Management"]
    },
    {
      icon: Activity,
      title: "Logging & Monitoring",
      description: "Comprehensive logging, error tracking, and performance monitoring. Real-time insights into system health and user activity.",
      tech: ["Winston/Morgan", "Sentry", "Prometheus"]
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="System Architecture"
          subtitle="A comprehensive view of IntelliCampus infrastructure and components"
          centered
        />

        {/* Architecture Diagram */}
        <div className="mb-20">
          <Card className="p-8 bg-card/50 border-border/40 backdrop-blur overflow-x-auto">
            <div className="min-w-[800px]">
              <svg viewBox="0 0 800 600" className="w-full h-auto">
                {/* Frontend Layer */}
                <rect x="50" y="50" width="700" height="80" fill="hsl(239 84% 67% / 0.1)" stroke="hsl(239 84% 67%)" strokeWidth="2" rx="8"/>
                <text x="400" y="95" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="16" fontWeight="bold">Frontend (React + TypeScript)</text>
                
                {/* API Gateway */}
                <rect x="250" y="180" width="300" height="60" fill="hsl(271 81% 67% / 0.1)" stroke="hsl(271 81% 67%)" strokeWidth="2" rx="8"/>
                <text x="400" y="215" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="14" fontWeight="bold">Backend API (Node.js/Express)</text>
                
                {/* Auth Service */}
                <rect x="50" y="290" width="150" height="60" fill="hsl(220 15% 20%)" stroke="hsl(239 84% 67%)" strokeWidth="2" rx="8"/>
                <text x="125" y="325" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="12">Auth Service (JWT)</text>
                
                {/* ML Service */}
                <rect x="220" y="290" width="150" height="60" fill="hsl(220 15% 20%)" stroke="hsl(271 81% 67%)" strokeWidth="2" rx="8"/>
                <text x="295" y="325" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="12">ML Service (Python)</text>
                
                {/* RAG / Vector DB */}
                <rect x="390" y="290" width="150" height="60" fill="hsl(220 15% 20%)" stroke="hsl(239 84% 67%)" strokeWidth="2" rx="8"/>
                <text x="465" y="325" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="12">Vector DB / RAG</text>
                
                {/* LLM API */}
                <rect x="560" y="290" width="150" height="60" fill="hsl(220 15% 20%)" stroke="hsl(271 81% 67%)" strokeWidth="2" rx="8"/>
                <text x="635" y="325" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="12">LLM API (OpenAI)</text>
                
                {/* Database */}
                <rect x="150" y="410" width="180" height="60" fill="hsl(220 15% 20%)" stroke="hsl(239 84% 67%)" strokeWidth="2" rx="8"/>
                <text x="240" y="445" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="12">PostgreSQL Database</text>
                
                {/* Storage */}
                <rect x="350" y="410" width="180" height="60" fill="hsl(220 15% 20%)" stroke="hsl(271 81% 67%)" strokeWidth="2" rx="8"/>
                <text x="440" y="445" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="12">Cloud Storage (S3)</text>
                
                {/* Logging */}
                <rect x="550" y="410" width="180" height="60" fill="hsl(220 15% 20%)" stroke="hsl(239 84% 67%)" strokeWidth="2" rx="8"/>
                <text x="640" y="445" textAnchor="middle" fill="hsl(210 40% 98%)" fontSize="12">Logging & Monitoring</text>
                
                {/* Connection Lines */}
                <line x1="400" y1="130" x2="400" y2="180" stroke="hsl(239 84% 67%)" strokeWidth="2"/>
                <line x1="400" y1="240" x2="125" y2="290" stroke="hsl(239 84% 67%)" strokeWidth="1.5" strokeDasharray="5,5"/>
                <line x1="400" y1="240" x2="295" y2="290" stroke="hsl(271 81% 67%)" strokeWidth="1.5" strokeDasharray="5,5"/>
                <line x1="400" y1="240" x2="465" y2="290" stroke="hsl(239 84% 67%)" strokeWidth="1.5" strokeDasharray="5,5"/>
                <line x1="400" y1="240" x2="635" y2="290" stroke="hsl(271 81% 67%)" strokeWidth="1.5" strokeDasharray="5,5"/>
                <line x1="295" y1="350" x2="240" y2="410" stroke="hsl(239 84% 67%)" strokeWidth="1.5"/>
                <line x1="400" y1="350" x2="440" y2="410" stroke="hsl(271 81% 67%)" strokeWidth="1.5"/>
                <line x1="500" y1="350" x2="640" y2="410" stroke="hsl(239 84% 67%)" strokeWidth="1.5"/>
              </svg>
            </div>
          </Card>
        </div>

        {/* Component Details */}
        <SectionHeader
          title="Component Details"
          subtitle="Deep dive into each architectural component"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {components.map((component, index) => {
            const Icon = component.icon;
            return (
              <Card key={index} className="p-6 bg-card/50 border-border/40 backdrop-blur hover:shadow-card-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gradient-primary p-3 shrink-0">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-semibold">{component.title}</h3>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {component.tech.map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Data Flow */}
        <div className="mt-20">
          <SectionHeader title="Data Flow" />
          <Card className="p-8 bg-card/50 border-border/40 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-semibold mb-1">User Query</h4>
                  <p className="text-sm text-muted-foreground">User sends a natural language query through the chat interface (e.g., "What's my attendance in Physics?")</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-semibold mb-1">Authentication & Routing</h4>
                  <p className="text-sm text-muted-foreground">Backend API validates JWT token, identifies the user, and routes the request to appropriate service</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Context Retrieval (RAG)</h4>
                  <p className="text-sm text-muted-foreground">Vector DB searches for relevant student data using embeddings and similarity search</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">4</div>
                <div>
                  <h4 className="font-semibold mb-1">LLM Processing</h4>
                  <p className="text-sm text-muted-foreground">LLM receives context + query, decides if function calling is needed, and generates response</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">5</div>
                <div>
                  <h4 className="font-semibold mb-1">Response Delivery</h4>
                  <p className="text-sm text-muted-foreground">Backend formats and sends the response back to frontend, which displays it in the chat interface</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;
