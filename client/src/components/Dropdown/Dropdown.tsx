import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react';

interface DropdownItem {
    key: string;
    label: string;
}

interface DropdownProps {
    items: DropdownItem[];
    label: string;
    onChange?: (newValue: string) => void;
}

function Dropdown({ items, label, onChange }: DropdownProps): JSX.Element {
    const [selectedItem, setSelectedItem] = React.useState(items[0]);

    function handleChange(newSelectedItem: DropdownItem) {
        setSelectedItem(newSelectedItem);

        if (onChange) {
            onChange(newSelectedItem.key);
        }
    }

    return (
        <Listbox value={selectedItem} onChange={handleChange}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block mb-2 text-xs tracking-wider">
                        {label}
                    </Listbox.Label>
                    <div className="relative">
                        <Listbox.Button
                            className="relative w-full pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white rounded-none border-b border-gray-700 dark:border-gray-500 text-sm text-left focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer transition-colors"
                        >
                            {selectedItem.label}
                            <span className={`absolute right-2.5 inset-y-0 flex items-center opacity-70 transform ${open ? 'rotate-180' : undefined} transition-transform`} aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </Listbox.Button>
                        <Transition
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            className="absolute z-30 w-full min-w-max bg-gray-100 dark:bg-gray-800 shadow-lg origin-top"
                        >
                            <Listbox.Options className="max-h-72 text-sm overflow-auto divide-y divide-gray-200 dark:divide-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                {items.map((item) => (
                                    <Listbox.Option key={item.key} value={item} className="focus:outline-none">
                                        {({ active }) => (
                                            <span className={`block px-4 py-2 ${active ? 'bg-gray-200 dark:bg-gray-700' : undefined} hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white cursor-pointer transition-colors`}>
                                                {item.label}
                                            </span>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
}

export default Dropdown;
