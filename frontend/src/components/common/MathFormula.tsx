import React, { useMemo } from 'react';
import katex from 'katex';

interface MathProps {
  math?: string;
  children?: string;
  displayMode?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathProps> = ({
  math,
  children,
  displayMode = true,
  className = '',
}) => {
  const formula = (math || children || '').trim();

  const html = useMemo(() => {
    if (!formula) return '';
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return formula;
    }
  }, [formula, displayMode]);

  if (!formula) return null;

  return (
    <span
      className={`math-rendered select-text ${displayMode ? 'block my-1 text-center overflow-x-auto' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const MathInline: React.FC<Omit<MathProps, 'displayMode'>> = (props) => {
  return <MathFormula {...props} displayMode={false} />;
};

export const renderMathText = (text: string): React.ReactNode => {
  if (!text || !text.includes('$')) return text;
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1);
      return <MathInline key={index} math={formula} />;
    }
    return part;
  });
};

export const MathText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return <span className={className}>{renderMathText(text)}</span>;
};
