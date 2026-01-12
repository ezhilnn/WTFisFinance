// src/features/learn/components/LessonContent.tsx

import type { JSX } from 'react';
import type { Lesson } from '../types/learn.types';
import styles from './LessonContent.module.css';

interface LessonContentProps {
  lesson: Lesson;
}

// Reuse your existing BlogReader component logic
// This renders TipTap JSON the same way as blog posts
const LessonContent = ({ lesson }: LessonContentProps) => {
  const renderContent = (content: any[]): React.ReactNode => {
    return content.map((node, index) => {
      switch (node.type) {
        case 'paragraph':
          return (
            <p key={index} className={styles.paragraph}>
              {node.content ? renderInlineContent(node.content) : null}
            </p>
          );

        case 'heading':
          const HeadingTag = `h${node.attrs?.level || 2}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag key={index} className={styles[`heading${node.attrs?.level || 2}`]}>
              {node.content ? renderInlineContent(node.content) : null}
            </HeadingTag>
          );

        case 'bulletList':
          return (
            <ul key={index} className={styles.bulletList}>
              {node.content?.map((item: any, i: number) => (
                <li key={i}>{renderContent(item.content || [])}</li>
              ))}
            </ul>
          );

        case 'orderedList':
          return (
            <ol key={index} className={styles.orderedList}>
              {node.content?.map((item: any, i: number) => (
                <li key={i}>{renderContent(item.content || [])}</li>
              ))}
            </ol>
          );

        case 'codeBlock':
          return (
            <pre key={index} className={styles.codeBlock}>
              <code>{node.content?.[0]?.text || ''}</code>
            </pre>
          );

        case 'blockquote':
          return (
            <blockquote key={index} className={styles.blockquote}>
              {node.content ? renderContent(node.content) : null}
            </blockquote>
          );

        case 'horizontalRule':
          return <hr key={index} className={styles.horizontalRule} />;

        default:
          return null;
      }
    });
  };

  const renderInlineContent = (content: any[]): React.ReactNode => {
    return content.map((node, index) => {
      if (node.type === 'text') {
        let text: React.ReactNode = node.text;

        // Apply marks
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            if (mark.type === 'bold') {
              text = <strong key={`bold-${index}`}>{text}</strong>;
            } else if (mark.type === 'italic') {
              text = <em key={`italic-${index}`}>{text}</em>;
            } else if (mark.type === 'code') {
              text = <code key={`code-${index}`} className={styles.inlineCode}>{text}</code>;
            } else if (mark.type === 'link') {
              text = (
                <a
                  key={`link-${index}`}
                  href={mark.attrs?.href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {text}
                </a>
              );
            } else if (mark.type === 'highlight') {
              text = <mark key={`highlight-${index}`} className={styles.highlight}>{text}</mark>;
            }
          });
        }

        return <span key={index}>{text}</span>;
      }

      return null;
    });
  };

  return (
    <article className={styles.lessonCard}>
      <h3 className={styles.lessonTitle}>{lesson.title}</h3>
      <div className={styles.lessonContent}>
        {renderContent(lesson.contentJSON)}
      </div>
    </article>
  );
};

export default LessonContent;