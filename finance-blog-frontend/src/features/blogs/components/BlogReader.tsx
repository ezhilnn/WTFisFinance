import { EditorContent } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import styles from './BlogReader.module.css';

const lowlight = createLowlight();

interface BlogReaderProps {
  content: string;
}

const BlogReader = ({ content }: BlogReaderProps) => {
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
    content,
    editable: false,
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