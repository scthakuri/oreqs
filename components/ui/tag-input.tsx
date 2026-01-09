import React, {useState, useRef} from 'react';
import {X} from 'lucide-react';

interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(({
    className = '',
    value = [],
    onChange,
    placeholder = 'Add tags...',
    ...props
}, ref) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange?.([...value, inputValue.trim()]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange?.(value.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange?.(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div
            className={`flex flex-wrap gap-2 min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            onClick={() => inputRef.current?.focus()}
        >
            {value.map((tag, index) => (
                <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-sm"
                >
          {tag}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTag(index);
                        }}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5 transition-colors"
                    >
            <X className="h-3 w-3"/>
          </button>
        </span>
            ))}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder={value.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground"
                {...props}
            />
        </div>
    );
});

TagInput.displayName = 'TagInput';
export default TagInput;