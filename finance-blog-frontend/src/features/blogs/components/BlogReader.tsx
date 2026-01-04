import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import styles from './BlogReader.module.css';

const lowlight = createLowlight();

interface BlogReaderProps {
  content: string | any[];
}

const BlogReader = ({ content }: BlogReaderProps) => {
  // Parse content if it's a string
  let parsedContent;
  try {
    if (typeof content === 'string') {
      parsedContent = JSON.parse(content);
    } else if (Array.isArray(content)) {
      // If it's already an array, wrap it in TipTap's document structure
      parsedContent = {
        type: 'doc',
        content: content
      };
    } else {
      parsedContent = content;
    }
  } catch (error) {
    console.error('Failed to parse content:', error);
    parsedContent = {
      type: 'doc',
      content: []
    };
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: parsedContent,
    editable: false, // Read-only mode
    editorProps: {
      attributes: {
        class: styles.content,
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.reader}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default BlogReader;