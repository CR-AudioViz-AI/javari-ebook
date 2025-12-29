"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ChevronLeft,
  Check,
  Edit2,
  Plus,
  Trash2,
  GripVertical,
  BookOpen,
  Target,
  Users,
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { BookBlueprint, ChapterOutline } from "@/types";

function BlueprintContent() {
  const router = useRouter();
  
  const [blueprint, setBlueprint] = useState<BookBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState(0);

  useEffect(() => {
    const storedBlueprint = sessionStorage.getItem("bookBlueprint");
    if (storedBlueprint) {
      setBlueprint(JSON.parse(storedBlueprint));
    }
    setIsLoading(false);
  }, []);

  const handleCreateBook = async () => {
    if (!blueprint) return;
    
    setIsCreating(true);
    
    try {
      const bookResponse = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blueprint.title,
          subtitle: blueprint.subtitle_options[selectedSubtitle],
          description: blueprint.description,
          book_type: blueprint.book_type,
          target_audience: blueprint.target_audience,
          target_word_count: blueprint.target_word_count,
          blueprint: blueprint,
        }),
      });

      if (!bookResponse.ok) throw new Error("Failed to create book");
      const { data: book } = await bookResponse.json();

      const chaptersResponse = await fetch("/api/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: book.id, chapters: blueprint.chapters }),
      });

      if (!chaptersResponse.ok) throw new Error("Failed to create chapters");

      sessionStorage.removeItem("bookBlueprint");
      router.push(`/books/${book.id}`);
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Failed to create book. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateChapter = (index: number, updates: Partial<ChapterOutline>) => {
    if (!blueprint) return;
    const newChapters = [...blueprint.chapters];
    newChapters[index] = { ...newChapters[index], ...updates };
    setBlueprint({ ...blueprint, chapters: newChapters });
  };

  const removeChapter = (index: number) => {
    if (!blueprint) return;
    const newChapters = blueprint.chapters.filter((_, i) => i !== index);
    setBlueprint({ ...blueprint, chapters: newChapters });
  };

  const addChapter = () => {
    if (!blueprint) return;
    const newChapter: ChapterOutline = {
      title: "New Chapter",
      summary: "Chapter summary goes here...",
      target_word_count: 5000,
      sections: [],
    };
    setBlueprint({ ...blueprint, chapters: [...blueprint.chapters, newChapter] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Blueprint Found</h2>
          <p className="text-muted-foreground mb-4">
            Please complete the interview to generate a book blueprint.
          </p>
          <Link href="/interview" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Start Interview
          </Link>
        </div>
      </div>
    );
  }

  const totalWords = blueprint.chapters.reduce((sum, ch) => sum + ch.target_word_count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/interview" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Back to Interview
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Blueprint Review</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-background rounded-2xl border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{blueprint.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {blueprint.subtitle_options.map((subtitle, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubtitle(index)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSubtitle === index ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {subtitle}
                  </button>
                ))}
              </div>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {blueprint.book_type}
            </span>
          </div>

          <p className="text-muted-foreground mb-6">{blueprint.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<FileText className="h-4 w-4" />} label="Chapters" value={blueprint.chapters.length.toString()} />
            <StatCard icon={<Target className="h-4 w-4" />} label="Target Words" value={totalWords.toLocaleString()} />
            <StatCard icon={<Users className="h-4 w-4" />} label="Audience" value={blueprint.target_audience.split(" ").slice(0, 3).join(" ") + "..."} />
            <StatCard icon={<Sparkles className="h-4 w-4" />} label="Est. Credits" value={blueprint.estimated_credits.toString()} />
          </div>
        </div>

        <div className="bg-background rounded-2xl border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Chapter Outline</h2>
            <button onClick={addChapter} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted rounded-lg hover:bg-muted/80">
              <Plus className="h-4 w-4" />
              Add Chapter
            </button>
          </div>

          <div className="space-y-4">
            {blueprint.chapters.map((chapter, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-5 w-5 cursor-grab" />
                    <span className="font-mono text-sm">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    {editingChapter === index ? (
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(index, { title: e.target.value })}
                        onBlur={() => setEditingChapter(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingChapter(null)}
                        className="w-full font-semibold bg-transparent border-b border-primary outline-none"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold cursor-pointer hover:text-primary" onClick={() => setEditingChapter(index)}>
                        {chapter.title}
                      </h3>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{chapter.summary}</p>
                    
                    {chapter.sections && chapter.sections.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-muted">
                        <p className="text-xs text-muted-foreground mb-2">Sections:</p>
                        <div className="space-y-1">
                          {chapter.sections.map((section, sIndex) => (
                            <p key={sIndex} className="text-sm">{sIndex + 1}. {section.title}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{chapter.target_word_count.toLocaleString()} words</span>
                    <button onClick={() => setEditingChapter(index)} className="p-1.5 hover:bg-muted rounded">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => removeChapter(index)} className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-2xl border p-6">
            <h3 className="font-semibold mb-4">Research Needs</h3>
            <ul className="space-y-2">
              {blueprint.research_needs.map((need, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  {need}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background rounded-2xl border p-6">
            <h3 className="font-semibold mb-4">Media Requirements</h3>
            <ul className="space-y-2">
              {blueprint.media_requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/interview" className="px-4 py-2 text-muted-foreground hover:text-foreground">
            ← Restart Interview
          </Link>
          <button
            onClick={handleCreateBook}
            disabled={isCreating}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Book...
              </>
            ) : (
              <>
                Create Book & Start Writing
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-semibold truncate">{value}</p>
    </div>
  );
}

export default function BlueprintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <BlueprintContent />
    </Suspense>
  );
}
