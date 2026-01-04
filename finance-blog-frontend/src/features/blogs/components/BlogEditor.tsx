import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import styles from './BlogEditor.module.css';

// Create lowlight instance
const lowlight = createLowlight();

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const BlogEditor = ({ content, onChange, placeholder }: BlogEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content ? JSON.parse(content || '{"type":"doc","content":[]}') : undefined,
    onUpdate: ({ editor }) => {
      // Output JSON instead of HTML
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editor}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('bold') ? styles.active : ''
            }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('italic') ? styles.active : ''
            }`}
            title="Italic"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('highlight') ? styles.active : ''
            }`}
            title="Highlight"
          >
            <span className={styles.highlightIcon}>H</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('code') ? styles.active : ''
            }`}
            title="Inline Code"
          >
            {'<>'}
          </button>
        </div>

        <div className={styles.toolbarDivider}></div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('heading', { level: 2 }) ? styles.active : ''
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('heading', { level: 3 }) ? styles.active : ''
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className={styles.toolbarDivider}></div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('codeBlock') ? styles.active : ''
            }`}
            title="Code Block"
          >
            {'{ }'}
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('blockquote') ? styles.active : ''
            }`}
            title="Quote"
          >
            "
          </button>
        </div>

        <div className={styles.toolbarDivider}></div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('bulletList') ? styles.active : ''
            }`}
            title="Bullet List"
          >
            •
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive('orderedList') ? styles.active : ''
            }`}
            title="Numbered List"
          >
            1.
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default BlogEditor;