"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Send } from "lucide-react";
import Link from "next/link";

interface InterviewStep {
  id: string;
  question: string;
  type: "text" | "select" | "textarea" | "multiselect";
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

const interviewSteps: InterviewStep[] = [
  {
    id: "topic",
    question: "What is your book about?",
    type: "textarea",
    placeholder: "Describe the main topic, theme, or story of your book...",
    helpText: "Be as specific as possible. The more detail you provide, the better we can help.",
  },
  {
    id: "audience",
    question: "Who is your target reader?",
    type: "textarea",
    placeholder: "Describe your ideal reader: their age, interests, pain points, what they hope to learn or experience...",
    helpText: "Understanding your audience helps us match the right tone and complexity.",
  },
  {
    id: "type",
    question: "What type of book is this?",
    type: "select",
    options: [
      "Non-fiction (educational, self-help, business)",
      "Fiction (novel, short stories)",
      "Guide or How-To",
      "Memoir or Biography",
      "Academic or Research",
      "Children's Book",
      "Other",
    ],
  },
  {
    id: "transformation",
    question: "What transformation will readers experience?",
    type: "textarea",
    placeholder: "What should readers think, feel, or be able to do after reading your book that they couldn't before?",
    helpText: "This helps us focus the content on delivering real value.",
  },
  {
    id: "length",
    question: "What's your target length?",
    type: "select",
    options: [
      "Quick Guide (5,000-15,000 words)",
      "Standard Book (30,000-50,000 words)",
      "Comprehensive (75,000-100,000 words)",
      "Epic (100,000+ words)",
    ],
  },
  {
    id: "tone",
    question: "What tone and style do you want?",
    type: "multiselect",
    options: [
      "Formal & Professional",
      "Casual & Conversational",
      "Academic & Research-Based",
      "Inspirational & Motivational",
      "Humorous & Light",
      "Serious & Thoughtful",
      "Direct & Actionable",
    ],
  },
  {
    id: "existing_content",
    question: "Do you have existing content to incorporate?",
    type: "textarea",
    placeholder: "Describe any blogs, videos, notes, or other content you'd like to include...",
    helpText: "We can help repurpose your existing content into book format.",
  },
  {
    id: "visual_style",
    question: "How visual should your book be?",
    type: "select",
    options: [
      "Minimal (text-focused)",
      "Moderate (occasional images and diagrams)",
      "Rich (many images, charts, infographics)",
      "Highly Visual (image-heavy, coffee table style)",
    ],
  },
  {
    id: "publication",
    question: "Where do you plan to publish?",
    type: "multiselect",
    options: [
      "Amazon Kindle (ePub/mobi)",
      "Apple Books",
      "Print-on-Demand (Amazon KDP, IngramSpark)",
      "Audiobook (Audible/ACX)",
      "Personal Website",
      "Not Sure Yet",
    ],
  },
  {
    id: "unique_perspective",
    question: "What's your unique perspective or approach?",
    type: "textarea",
    placeholder: "What makes your take on this topic different from what's already out there?",
    helpText: "This helps us highlight what makes your book special.",
  },
];

export default function InterviewPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const step = interviewSteps[currentStep];
  const progress = ((currentStep + 1) / interviewSteps.length) * 100;

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < interviewSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    // TODO: Call AI to generate blueprint based on answers
    console.log("Generating blueprint with answers:", answers);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // TODO: Navigate to blueprint review page
  };

  const currentAnswer = answers[step.id];
  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : !!currentAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            CRAV eBook Studio
          </Link>
          <div className="text-sm text-muted-foreground">
            Question {currentStep + 1} of {interviewSteps.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-background rounded-2xl shadow-lg border p-8">
          {/* Question */}
          <h1 className="text-2xl font-bold mb-2">{step.question}</h1>
          {step.helpText && (
            <p className="text-muted-foreground mb-6">{step.helpText}</p>
          )}

          {/* Input */}
          <div className="mb-8">
            {step.type === "textarea" && (
              <textarea
                className="w-full min-h-[150px] p-4 rounded-lg border bg-background resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder={step.placeholder}
                value={(currentAnswer as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {step.type === "select" && step.options && (
              <div className="space-y-3">
                {step.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      currentAnswer === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {step.type === "multiselect" && step.options && (
              <div className="space-y-3">
                {step.options.map((option) => {
                  const selected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        const current = (currentAnswer as string[]) || [];
                        if (selected) {
                          handleAnswer(current.filter((o) => o !== option));
                        } else {
                          handleAnswer([...current, option]);
                        }
                      }}
                      className={`w-full p-4 rounded-lg border text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selected ? "border-primary bg-primary text-white" : "border-muted-foreground"
                          }`}
                        >
                          {selected && "✓"}
                        </span>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {currentStep < interviewSteps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerateBlueprint}
                disabled={!hasAnswer || isGenerating}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Generating Blueprint...
                  </>
                ) : (
                  <>
                    Generate Blueprint
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Skip this question
          </button>
        </div>
      </main>
    </div>
  );
}
