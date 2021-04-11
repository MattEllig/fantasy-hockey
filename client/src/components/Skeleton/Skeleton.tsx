import * as React from 'react';

interface SkeletonProps {
    size: string;
}

function Skeleton({ size }: SkeletonProps): JSX.Element {
    return <div className={`${size} bg-gray-200 dark:bg-gray-600 animate-pulse`} />;
}

export default Skeleton;
