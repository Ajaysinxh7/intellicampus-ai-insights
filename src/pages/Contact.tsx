import SectionHeader from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader
          title="Get In Touch"
          subtitle="Have questions about IntelliCampus? We'd love to hear from you"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8 bg-card/50 border-border/40 backdrop-blur animate-fade-in">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input 
                  placeholder="Your full name" 
                  className="bg-muted/50 border-border/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className="bg-muted/50 border-border/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input 
                  placeholder="What is this about?" 
                  className="bg-muted/50 border-border/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us more..." 
                  rows={5}
                  className="bg-muted/50 border-border/40 resize-none"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <Card className="p-6 bg-card/50 border-border/40 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-gradient-primary p-2">
                    <Mail className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">contact@intellicampus.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-gradient-primary p-2">
                    <Phone className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-gradient-primary p-2">
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-muted-foreground">
                      123 Campus Drive<br />
                      University City, ST 12345
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-border/40 backdrop-blur">
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="space-y-3">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Github className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">GitHub</p>
                    <p className="text-xs text-muted-foreground">@intellicampus</p>
                  </div>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">LinkedIn</p>
                    <p className="text-xs text-muted-foreground">IntelliCampus</p>
                  </div>
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-primary/10 border-primary/20">
              <h3 className="text-lg font-bold mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground mb-4">
                IntelliCampus is open source. Contributions are welcome!
              </p>
              <Button variant="outline" className="w-full border-border/40" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
