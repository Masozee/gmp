"use client";

import { PublicationEditor } from "@/components/PublicationEditor";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function CreatePublicationPage() {
  const { toast } = useToast();
  const [savedContent, setSavedContent] = useState<{
    title: string;
    content: string;
    files: File[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const handleSave = async (content: { title: string; content: string; files: File[] }) => {
    setIsSubmitting(true);
    setSavedContent(content);
    setSubmitResult(null);
    
    try {
      // Create a FormData object to send the files
      const formData = new FormData();
      formData.append("title", content.title);
      formData.append("content", content.content);
      
      // Add each file to the FormData
      content.files.forEach(file => {
        formData.append("files", file);
      });
      
      // Send the data to the API
      const response = await fetch("/api/publications/save", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      setSubmitResult(result);
      
      if (result.success) {
        toast({
          title: "Publication saved",
          description: "Your publication has been saved successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error saving publication",
          description: result.message || "There was an error saving your publication.",
        });
      }
    } catch (error) {
      console.error("Error saving publication:", error);
      setSubmitResult({
        success: false,
        message: "There was an error saving your publication.",
      });
      
      toast({
        variant: "destructive",
        title: "Error saving publication",
        description: "There was an error saving your publication.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-heading mb-8 text-gray-900 dark:text-white">
        Create New Publication
      </h1>
      
      {submitResult && (
        <Alert className={`mb-6 ${submitResult.success ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800'}`}>
          {submitResult.success ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          <AlertTitle className={submitResult.success ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}>
            {submitResult.success ? 'Publication Saved' : 'Error'}
          </AlertTitle>
          <AlertDescription className={submitResult.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}>
            {submitResult.message}
          </AlertDescription>
        </Alert>
      )}
      
      <PublicationEditor onSave={handleSave} />
      
      {savedContent && !isSubmitting && (
        <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold font-heading mb-4 text-gray-900 dark:text-white">Preview</h2>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Title</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{savedContent.title}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Content</h3>
            <div 
              className="prose prose-emerald dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
              dangerouslySetInnerHTML={{ __html: savedContent.content }}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Files</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {savedContent.files.map((file, index) => (
                <li key={index}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 