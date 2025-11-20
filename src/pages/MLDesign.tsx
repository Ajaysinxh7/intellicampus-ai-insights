import SectionHeader from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, Sparkles, Database } from "lucide-react";

const MLDesign = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeader
          title="ML & LLM Design"
          subtitle="Machine learning models and AI integration architecture"
          centered
        />

        {/* ML Models Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-gradient-primary p-2">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Machine Learning Models</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 border-border/40 backdrop-blur">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Attendance Prediction</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Models Used:</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                      <li>Linear Regression (baseline)</li>
                      <li>Decision Tree Classifier</li>
                      <li>Random Forest (ensemble)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Features:</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                      <li>Historical attendance percentage</li>
                      <li>Day of week patterns</li>
                      <li>Subject difficulty rating</li>
                      <li>Time of day (morning/afternoon)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Accuracy:</p>
                    <p className="text-sm text-muted-foreground">~82% on test set</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-border/40 backdrop-blur">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <h3 className="text-xl font-semibold">Marks Prediction</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Models Used:</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                      <li>Random Forest Regressor</li>
                      <li>Gradient Boosting</li>
                      <li>XGBoost (best performer)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Features:</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                      <li>Previous exam scores</li>
                      <li>Attendance percentage</li>
                      <li>Study hours logged</li>
                      <li>Subject complexity score</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Accuracy:</p>
                    <p className="text-sm text-muted-foreground">~87% R² score</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Attendance Formula */}
        <div className="mb-16">
          <SectionHeader title="Attendance Calculation Formula" />
          <Card className="p-8 bg-gradient-primary/10 border-primary/20">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Attendance Percentage:</h4>
                <code className="block bg-card/50 p-4 rounded-lg text-center text-lg">
                  percentage = (present_classes / total_classes) × 100
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Classes Needed to Reach Target:</h4>
                <code className="block bg-card/50 p-4 rounded-lg text-center text-lg">
                  classes_needed = ⌈(target% × total - present) / (target% - 1)⌉
                </code>
              </div>
              <div className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground">
                  <strong>Example:</strong> If you have attended 50 out of 80 classes (62.5%) and want to reach 75%:
                </p>
                <code className="block bg-card/50 p-3 rounded-lg text-sm mt-2">
                  classes_needed = ⌈(0.75 × 80 - 50) / (0.75 - 1)⌉ = ⌈(60 - 50) / (-0.25)⌉ = ⌈-40⌉ = 40 classes
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  You would need to attend 40 consecutive classes to reach 75% attendance.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* RAG Pipeline */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-gradient-primary p-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">RAG Pipeline</h2>
          </div>

          <Card className="p-8 bg-card/50 border-border/40 backdrop-blur">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Retrieval-Augmented Generation (RAG) enhances LLM responses with relevant, up-to-date student data.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Data Embedding</h4>
                    <p className="text-sm text-muted-foreground">
                      Student data (attendance, marks, profiles) is converted into vector embeddings using OpenAI's text-embedding-ada-002 model
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Vector Storage</h4>
                    <p className="text-sm text-muted-foreground">
                      Embeddings are stored in a vector database (Pinecone/Chroma) with metadata for efficient retrieval
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Query Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      User's query is embedded and similarity search retrieves the most relevant context (top-k results)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Context Injection</h4>
                    <p className="text-sm text-muted-foreground">
                      Retrieved context is injected into the LLM prompt along with the user's question
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/20 text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">5</div>
                  <div>
                    <h4 className="font-semibold mb-1">Response Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      LLM generates accurate, contextual response based on retrieved data and decides if function calling is needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Prompt Strategy */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-gradient-primary p-2">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Prompt Engineering</h2>
          </div>

          <Card className="p-6 bg-card/50 border-border/40 backdrop-blur">
            <h3 className="font-semibold mb-4">System Prompt Template:</h3>
            <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
{`You are IntelliCampus AI Assistant, an expert at helping students track 
and improve their academic performance.

You have access to the following functions:
- get_attendance(student_id, subject_id?)
- get_marks(student_id, subject_id?, exam_type?)
- predict_attendance(student_id, weeks_ahead)
- predict_marks(student_id, subject_id, exam_type)
- calculate_classes_needed(current_attendance, target_percentage)

Context from student records:
{retrieved_context}

User's question: {user_question}

Provide accurate, helpful responses. If you need data, use function calling.
Calculate attendance requirements when asked. Give actionable study advice.`}
            </pre>
          </Card>
        </div>

        {/* Function Schema */}
        <div>
          <SectionHeader title="Sample Function Schema" />
          <Card className="p-6 bg-card/50 border-border/40 backdrop-blur">
            <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
{`{
  "name": "get_attendance",
  "description": "Retrieves attendance records for a student",
  "parameters": {
    "type": "object",
    "properties": {
      "student_id": {
        "type": "string",
        "description": "Unique student identifier"
      },
      "subject_id": {
        "type": "string",
        "description": "Optional subject filter. If not provided, returns all subjects."
      }
    },
    "required": ["student_id"]
  }
}

{
  "name": "calculate_classes_needed",
  "description": "Calculates how many classes needed to reach target attendance%",
  "parameters": {
    "type": "object",
    "properties": {
      "current_percentage": {
        "type": "number",
        "description": "Current attendance percentage (0-100)"
      },
      "target_percentage": {
        "type": "number",
        "description": "Target attendance percentage (typically 75)"
      },
      "total_classes": {
        "type": "number",
        "description": "Total classes conducted so far"
      }
    },
    "required": ["current_percentage", "target_percentage", "total_classes"]
  }
}`}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MLDesign;
