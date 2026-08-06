import { Highlight, Text } from './HighlightedText.styles';

export interface HighlightedTextProps {
  text: string;
  searchTerm: string;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function HighlightedText({ text, searchTerm }: HighlightedTextProps) {
  const trimmedSearchTerm = searchTerm.trim();

  if (!trimmedSearchTerm) {
    return <Text>{text}</Text>;
  }

  const regex = new RegExp(`(${escapeRegExp(trimmedSearchTerm)})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === trimmedSearchTerm.toLowerCase();

        if (isMatch) {
          return (
            <Highlight key={`${part}-${index}`}>{part}</Highlight>
          );
        }

        return part;
      })}
    </Text>
  );
}

HighlightedText.displayName = 'HighlightedText';

export default HighlightedText;
