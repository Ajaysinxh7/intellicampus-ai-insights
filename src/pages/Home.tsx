import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Brain, TrendingUp, MessageSquare, BarChart3, ArrowRight, Shield, Users, Zap, CheckCircle2 } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const Home = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track academic progress with detailed charts and predictive insights."
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "24/7 intelligent support for student queries and guidance."
    },
    {
      icon: Shield,
      title: "Secure Data",
      description: "Enterprise-grade security for sensitive student and faculty information."
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Instant notifications for attendance, grades, and important announcements."
    }
  ];

  const stats = [
    { label: "Active Students", value: "5,000+" },
    { label: "Institutions", value: "50+" },
    { label: "AI Insights Daily", value: "10k+" },
    { label: "Success Rate", value: "98%" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJoc2woMjM5IDg0JSA2NyUgLyAwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur border border-border/40 rounded-full px-4 py-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Campus Analytics</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Transform Your Campus with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                IntelliCampus
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Smart attendance tracking, marks analytics, and AI-powered insights to help students succeed
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NavLink to="/Login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                  Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
              <NavLink to="/features">
                <Button size="lg" variant="outline" className="bg-background/50 backdrop-blur border-primary/20 hover:bg-accent">
                  Learn More
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/40 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Quick Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features for Modern Education</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to manage your institution effectively and help students thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Highlights Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Brain className="w-4 h-4" />
                <span>Advanced Intelligence</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Data-Driven Decisions with <br />
                <span className="text-primary">Machine Learning</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Our advanced algorithms analyze student performance patterns to identify at-risk students early and suggest personalized interventions.
              </p>

              <div className="space-y-4">
                {[
                  "Predictive performance modeling",
                  "Automated attendance tracking",
                  "Personalized learning paths",
                  "Resource allocation optimization"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>

              <NavLink to="/ml-design">
                <Button className="mt-4" variant="secondary">
                  Explore AI Architecture
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </NavLink>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-2xl opacity-50" />
              <div className="relative bg-card border border-border/50 rounded-xl p-6 shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="h-2 w-20 bg-muted rounded" />
                    <div className="h-8 w-full bg-primary/10 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-20 bg-muted rounded" />
                    <div className="h-8 w-full bg-primary/10 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-48 w-full bg-accent/50 rounded-lg flex items-center justify-center border border-border/50">
                  <BarChart3 className="w-16 h-16 text-muted-foreground/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Join the future of education management with IntelliCampus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink to="/contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold">
                    Get Started Now
                  </Button>
                </NavLink>
                <NavLink to="/demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    View Demo
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
