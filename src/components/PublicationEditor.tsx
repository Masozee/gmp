"use client";

import { useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";
import TextAlign from "@tiptap/extension-text-align";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo
} from "lucide-react";

interface PublicationEditorProps {
  onSave: (content: { title: string; content: string; files: File[] }) => void;
}

export function PublicationEditor({ onSave }: PublicationEditorProps) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      Document,
      StarterKit.configure({
        document: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-emerald-600 hover:text-emerald-700 underline',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full mx-auto my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      Placeholder.configure({
        placeholder: 'Write your publication content here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: 'prose prose-emerald dark:prose-invert prose-img:rounded-md prose-headings:font-heading prose-p:font-body max-w-none focus:outline-none min-h-[300px] p-4 border border-gray-300 dark:border-gray-700 rounded-md',
      },
    },
  });

  const addImage = useCallback(() => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  }, []);

  const addFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const imageUrl = readerEvent.target?.result as string;
          editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
        };
        reader.readAsDataURL(file);
        
        // Add to files array
        setFiles(prev => [...prev, file]);
      }
    }
  }, [editor]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      if (file && editor) {
        // Create a file link in the editor
        editor
          .chain()
          .focus()
          .setLink({ 
            href: '#file-link',
            target: '_blank',
          })
          .insertContent(`📎 ${file.name}`)
          .run();
        
        // Add to files array
        setFiles(prev => [...prev, file]);
      }
    }
  }, [editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editor && title.trim()) {
      setIsSaving(true);
      
      // Get the HTML content from the editor
      const content = editor.getHTML();
      
      onSave({
        title,
        content,
        files,
      });
      
      // Reset form after submission
      setIsSaving(false);
      setTitle("");
      editor.commands.clearContent();
      setFiles([]);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-heading"
          >
            Publication Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md font-heading text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Enter publication title"
            required
          />
        </div>
        
        <div className="mb-6">
          <label 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-heading"
          >
            Content
          </label>
          
          <div className="border border-gray-300 dark:border-gray-700 rounded-md mb-2">
            <div className="flex flex-wrap items-center px-3 py-2 border-b border-gray-300 dark:border-gray-700 gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </button>
              <div className="h-6 border-r border-gray-300 dark:border-gray-700 mx-1"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <div className="h-6 border-r border-gray-300 dark:border-gray-700 mx-1"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Align left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Align center"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Align right"
              >
                <AlignRight className="h-4 w-4" />
              </button>
              <div className="h-6 border-r border-gray-300 dark:border-gray-700 mx-1"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Bullet list"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Numbered list"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <div className="h-6 border-r border-gray-300 dark:border-gray-700 mx-1"></div>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter the URL');
                  if (url) {
                    editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
                  }
                }}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title="Insert link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Insert image"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={addFile}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Attach file"
              >
                <FileText className="h-4 w-4" />
              </button>
              <div className="h-6 border-r border-gray-300 dark:border-gray-700 mx-1"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </button>
            </div>
            
            <EditorContent editor={editor} />
          </div>
          
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        
        {/* Attached files preview */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="font-heading text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attached Files ({files.length})
            </h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
              {files.map((file, index) => (
                <li key={index} className="p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="h-5 w-5 text-emerald-500 mr-2" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!title.trim() || isSaving}
            className="font-heading bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Publication'}
          </button>
        </div>
      </form>
    </div>
  );
} 