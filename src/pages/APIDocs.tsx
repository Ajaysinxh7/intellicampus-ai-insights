import SectionHeader from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Code, Lock, Calendar, TrendingUp, MessageSquare, Brain } from "lucide-react";

const APIDocs = () => {
  const endpoints = [
    {
      category: "Authentication",
      icon: Lock,
      endpoints: [
        {
          method: "POST",
          path: "/api/auth/register",
          description: "Register a new user account",
          body: { email: "string", password: "string", name: "string", role: "student | faculty | admin" }
        },
        {
          method: "POST",
          path: "/api/auth/login",
          description: "Authenticate user and receive JWT token",
          body: { email: "string", password: "string" }
        },
        {
          method: "POST",
          path: "/api/auth/logout",
          description: "Invalidate current session",
          auth: true
        }
      ]
    },
    {
      category: "Attendance",
      icon: Calendar,
      endpoints: [
        {
          method: "GET",
          path: "/api/attendance",
          description: "Get all attendance records for authenticated user",
          auth: true,
          query: { subject_id: "optional string", semester: "optional number" }
        },
        {
          method: "POST",
          path: "/api/attendance",
          description: "Mark attendance (Faculty only)",
          auth: true,
          body: { student_id: "string", subject_id: "string", status: "present | absent", date: "ISO date" }
        },
        {
          method: "GET",
          path: "/api/attendance/percentage",
          description: "Calculate attendance percentage",
          auth: true,
          query: { subject_id: "optional string" }
        },
        {
          method: "GET",
          path: "/api/attendance/classes-needed",
          description: "Calculate classes needed to reach target percentage",
          auth: true,
          query: { target: "number (default 75)", subject_id: "optional string" }
        }
      ]
    },
    {
      category: "Marks",
      icon: TrendingUp,
      endpoints: [
        {
          method: "GET",
          path: "/api/marks",
          description: "Get all marks for authenticated user",
          auth: true,
          query: { subject_id: "optional string", exam_type: "optional string" }
        },
        {
          method: "POST",
          path: "/api/marks",
          description: "Add marks entry (Faculty only)",
          auth: true,
          body: { student_id: "string", subject_id: "string", exam_type: "string", marks_obtained: "number", max_marks: "number" }
        },
        {
          method: "GET",
          path: "/api/marks/analytics",
          description: "Get marks analytics and trends",
          auth: true
        }
      ]
    },
    {
      category: "Chat / LLM",
      icon: MessageSquare,
      endpoints: [
        {
          method: "POST",
          path: "/api/chat",
          description: "Send message to AI chatbot",
          auth: true,
          body: { message: "string", conversation_id: "optional string" }
        },
        {
          method: "GET",
          path: "/api/chat/history",
          description: "Get chat conversation history",
          auth: true,
          query: { conversation_id: "optional string", limit: "number" }
        }
      ]
    },
    {
      category: "ML Predictions",
      icon: Brain,
      endpoints: [
        {
          method: "POST",
          path: "/api/ml/predict-attendance",
          description: "Predict future attendance using ML model",
          auth: true,
          body: { subject_id: "string", weeks_ahead: "number" }
        },
        {
          method: "POST",
          path: "/api/ml/predict-marks",
          description: "Predict future marks using ML model",
          auth: true,
          body: { subject_id: "string", exam_type: "string" }
        }
      ]
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "text-blue-400";
      case "POST": return "text-green-400";
      case "PUT": return "text-yellow-400";
      case "DELETE": return "text-red-400";
      default: return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeader
          title="API Documentation"
          subtitle="Complete REST API reference for IntelliCampus backend"
          centered
        />

        {/* Base URL */}
        <Card className="p-6 mb-8 bg-card/50 border-border/40 backdrop-blur">
          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Base URL</h3>
              <code className="block bg-muted/50 p-3 rounded-lg text-sm">
                https://api.intellicampus.com/v1
              </code>
            </div>
          </div>
        </Card>

        {/* Authentication Note */}
        <Card className="p-6 mb-12 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Protected endpoints require a valid JWT token in the Authorization header:
              </p>
              <code className="block bg-card/50 p-3 rounded-lg text-sm">
                Authorization: Bearer {"{"}your_jwt_token{"}"}
              </code>
            </div>
          </div>
        </Card>

        {/* Endpoints by Category */}
        <div className="space-y-8">
          {endpoints.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="space-y-4 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-gradient-primary p-2">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">{category.category}</h2>
                </div>

                {category.endpoints.map((endpoint, endpointIdx) => (
                  <Card key={endpointIdx} className="p-6 bg-card/50 border-border/40 backdrop-blur hover:shadow-card-glow transition-all duration-300">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`font-mono font-bold text-sm ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm bg-muted/50 px-3 py-1 rounded flex-1 min-w-0">
                          {endpoint.path}
                        </code>
                        {endpoint.auth && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            Auth Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      
                      {endpoint.body && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground">Request Body:</p>
                          <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto">
                            {JSON.stringify(endpoint.body, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {endpoint.query && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground">Query Parameters:</p>
                          <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto">
                            {JSON.stringify(endpoint.query, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>

        {/* Function Calling Schema */}
        <div className="mt-16">
          <SectionHeader title="LLM Function Calling Schema" />
          <Card className="p-6 bg-card/50 border-border/40 backdrop-blur">
            <p className="text-sm text-muted-foreground mb-4">
              The LLM uses function calling to interact with the API. Example schema:
            </p>
            <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
{`{
  "name": "get_attendance",
  "description": "Get attendance records for a student",
  "parameters": {
    "type": "object",
    "properties": {
      "student_id": {
        "type": "string",
        "description": "The student's unique identifier"
      },
      "subject_id": {
        "type": "string",
        "description": "Optional subject filter"
      }
    },
    "required": ["student_id"]
  }
}`}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;
