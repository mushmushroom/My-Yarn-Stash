import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AutocompleteOption {
  label: string;
  value: string;
}

interface AutocompleteInputProps extends Omit<React.ComponentProps<typeof Input>, 'onSelect'> {
  options: AutocompleteOption[];
  onSelect: (value: string) => void;
}

export default function AutocompleteInput({ options, onSelect, onChange, value, ...props }: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(String(value ?? ''));
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (value !== undefined) setInputValue(String(value));
  }, [value]);

  const filtered = inputValue.length > 0
    ? options.filter((o) => o.label.toLowerCase().includes(inputValue.toLowerCase()))
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setOpen(e.target.value.length > 0);
    onChange?.(e);
  };

  const handleSelect = (option: AutocompleteOption) => {
    setInputValue(option.label);
    setOpen(false);
    onSelect(option.value);

    // propagate value change to react-hook-form
    const nativeInput = document.getElementById(props.id ?? '') as HTMLInputElement;
    if (nativeInput) {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
        ?.set?.call(nativeInput, option.label);
      nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="w-full">
    <Popover open={open && filtered.length > 0}>
      <PopoverAnchor asChild>
        <Input
          className="w-full"
          {...props}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => filtered.length > 0 && setOpen(true)}
          onBlur={() => {
            closeTimeout.current = setTimeout(() => setOpen(false), 150);
          }}
          autoComplete="off"
        />
      </PopoverAnchor>
      <PopoverContent
        className="p-1 w-[--radix-popover-anchor-width]"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {filtered.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              'w-full text-left px-3 py-1.5 text-sm rounded-sm',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:bg-accent focus:text-accent-foreground focus:outline-none'
            )}
            onMouseDown={() => {
              if (closeTimeout.current) clearTimeout(closeTimeout.current);
            }}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
    </div>
  );
}
