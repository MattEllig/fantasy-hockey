import * as React from 'react';

interface LayoutProps {
    children?: React.ReactNode;
}

const darkModeStorageKey = 'f-hockey-dm';

function Layout({ children }: LayoutProps): JSX.Element {
    const [darkMode, setDarkMode] = React.useState(!!localStorage.getItem(darkModeStorageKey));

    function toggleDarkMode() {
        const mode = !darkMode;

        if (mode) {
            localStorage.setItem(darkModeStorageKey, 'true');
        } else {
            localStorage.removeItem(darkModeStorageKey);
        }

        setDarkMode(mode);
    }

    return (
        <div className={darkMode ? 'dark' : undefined}>
            <div className="relative z-10 bg-gray-800">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <h1 className="text-lg font-bold text-gray-200 font-mono">fantasy hockey tools</h1>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={toggleDarkMode}
                                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700 text-gray-200 transform active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label={`${darkMode ? "Disable" : "Enable"} dark mode`}
                            >
                                {darkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            <a
                                href="https://github.com/mattellig/fantasy-hockey-tools"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700 text-gray-200 transform active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="View on Github"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen -mt-14 pt-14 bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <main>{children}</main>
                <footer className="pb-4 text-center text-xs text-gray-600 dark:text-gray-400">
                    NHL and the NHL Shield are registered trademarks of the National Hockey League. NHL and NHL team marks are the property of the NHL and its teams. © NHL 2021. All Rights Reserved.
                </footer>
            </div>
        </div>
    );
}

export default Layout;
