import { forwardRef } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
    ({ value, onChange, placeholder = "Search by title or author..." }, ref) => {
        return (
            <div className="relative min-w-[180px] max-w-2xl ml-4">
                <div>
                    <input
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-2 pl-10 rounded-lg bg-border-light focus:outline-none focus-ring-primary"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 -translate-x-1 w-7 h-7 rounded-full flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <line x1="16.5" y1="16.5" x2="20" y2="20" />
                        </svg>
                    </div>
                    {value && (
                        <button
                            onClick={() => onChange('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
