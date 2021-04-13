import * as React from 'react';
import useControlledState from '../../hooks/useControlledState/useControlledState';

export interface SearchChangeHandler {
    (newValue: string): void;
}

interface SearchProps {
    id: string;
    labelText?: string;
    onChange?: SearchChangeHandler;
    placeholder?: string;
    value?: string;
}

function Search({
    id,
    labelText = 'Search',
    onChange,
    value: valueProp = '',
    ...other
}: SearchProps): JSX.Element {
    const [value, setValue] = useControlledState(valueProp);

    const inputRef = React.useRef<HTMLInputElement>(null);

    function handleClear() {
        setValue('');

        inputRef.current?.focus();

        if (onChange) {
            onChange('');
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (onChange) {
                onChange(value);
            }
        }
    }

    return (
        <>
            <label htmlFor={id} className="block mb-2 text-xs tracking-wider">
                {labelText}
            </label>
            <div className="relative">
                <div className="absolute left-0 inset-y-0 z-20 flex items-center ml-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    {...other}
                    ref={inputRef}
                    id={id}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    value={value}
                    className="relative h-10 w-full px-10 bg-gray-100 dark:bg-gray-800 rounded-none border-b border-gray-500 text-sm text-left focus:ring-2 focus:ring-blue-500 focus:outline-none focus:z-10 transition-shadow"
                />
                {value ? (
                    <button
                        onClick={handleClear}
                        className="absolute right-0 top-0 bottom-px z-20 flex items-center justify-center w-10 rounded-none hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer transition"
                        aria-label="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                ) : null}
            </div>
        </>
    );
}

export default Search;
