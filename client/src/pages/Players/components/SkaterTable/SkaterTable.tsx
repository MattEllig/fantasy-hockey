import * as React from 'react';
import DataTable, { TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '../../../../components/DataTable';
import Pagination, { PageChangeHandler, PageSizeChangeHandler } from '../../../../components/Pagination/Pagination';
import Skeleton from '../../../../components/Skeleton/Skeleton';
import { Skater } from '../../../../types';
import usePlayerFetching from '../../hooks/usePlayerFetching/usePlayerFetching';
import { PlayerFilters } from '../../hooks/usePlayerFiltering/usePlayerFiltering';

interface SkaterTableProps {
    filters: PlayerFilters;
    onChangePage: PageChangeHandler;
    onChangePageSize: PageSizeChangeHandler;
    onSort: (newSortProperty: string) => void;
}

const headerData = [
    { header: 'Player', key: 'name.last' },
    { header: 'Team', key: 'currentTeam.abbreviation' },
    { header: 'Pos', key: 'positions' },
    { header: 'GP', key: 'stats.games', numeric: true },
    { header: 'ATOI', key: 'stats.timeOnIcePerGame', numeric: true },
    { header: 'G', key: 'stats.goals', numeric: true },
    { header: 'A', key: 'stats.assists', numeric: true },
    { header: 'P', key: 'stats.points', numeric: true },
    { header: '+/-', key: 'stats.plusMinus', numeric: true },
    { header: 'PIM', key: 'stats.penaltyMinutes', numeric: true },
    { header: 'PPG', key: 'stats.powerPlayGoals', numeric: true },
    { header: 'PPP', key: 'stats.powerPlayPoints', numeric: true },
    { header: 'SHG', key: 'stats.shortHandedGoals', numeric: true },
    { header: 'SHP', key: 'stats.shortHandedPoints', numeric: true },
    { header: 'GWG', key: 'stats.gameWinningGoals', numeric: true },
    { header: 'FOW%', key: 'stats.faceOffPct', numeric: true },
];

function SkaterTable({
    filters,
    onChangePage,
    onChangePageSize,
    onSort
}: SkaterTableProps): JSX.Element {
    const { loading, players } = usePlayerFetching<Skater>('api/skater', filters);

    const placeholderRows = React.useMemo(() => (
        [...Array(filters.pageSize).keys()].map((page) => (
            <TableRow key={page}>
                <TableCell>
                    <Skeleton size="h-5 w-36" />
                </TableCell>
                <TableCell>
                    <div className="flex justify-center">
                        <Skeleton size="h-5 w-8" />
                    </div>
                </TableCell>
                {[...Array(headerData.length - 2).keys()].map((col) => (
                    <TableCell key={col}>
                        <div className="flex justify-center">
                            <Skeleton size="h-5 w-6" />
                        </div>
                    </TableCell>
                ))}
            </TableRow>
        ))
    ), [filters.pageSize]);

    return (
        <TableContainer>
            <DataTable
                activeSortDirection={filters.sort.ascending ? 'ascending' : 'descending'}
                activeSortKey={filters.sort.property}
                onSort={onSort}
            >
                {({ getTableHeaderProps }) => (
                    <>
                        <TableHead>
                            <TableRow>
                                {headerData.map((header) => (
                                    <TableHeader key={header.key} {...getTableHeaderProps(header)}>
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <>
                                    {placeholderRows}
                                </>
                            ) : players.results.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={headerData.length}>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                            No results found. Try adjusting your search.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {players.results.map((row: Skater) => (
                                        <TableRow key={row._id}>
                                            <TableCell>
                                                <span className="whitespace-nowrap">
                                                    {row.name.first} {row.name.last}
                                                </span>
                                            </TableCell>
                                            <TableCell>{row.currentTeam.abbreviation}</TableCell>
                                            <TableCell>{row.positions.join('/')}</TableCell>
                                            <TableCell numeric>{row.stats.games}</TableCell>
                                            <TableCell numeric>{row.stats.timeOnIcePerGame}</TableCell>
                                            <TableCell numeric>{row.stats.goals}</TableCell>
                                            <TableCell numeric>{row.stats.assists}</TableCell>
                                            <TableCell numeric>{row.stats.points}</TableCell>
                                            <TableCell numeric>{row.stats.plusMinus > 0 ? `+${row.stats.plusMinus}` : row.stats.plusMinus}</TableCell>
                                            <TableCell numeric>{row.stats.penaltyMinutes}</TableCell>
                                            <TableCell numeric>{row.stats.powerPlayGoals}</TableCell>
                                            <TableCell numeric>{row.stats.powerPlayPoints}</TableCell>
                                            <TableCell numeric>{row.stats.shortHandedGoals}</TableCell>
                                            <TableCell numeric>{row.stats.shortHandedPoints}</TableCell>
                                            <TableCell numeric>{row.stats.gameWinningGoals}</TableCell>
                                            <TableCell numeric>{row.stats.faceOffPct.toFixed(1)}</TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}
                        </TableBody>
                    </>
                )}
            </DataTable>
            <Pagination
                itemsLabel="players"
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}
                page={filters.page}
                pageSize={filters.pageSize}
                pageSizes={[10, 25, 50, 100]}
                totalItems={players.totalItems}
            />
        </TableContainer>
    );
}

export default SkaterTable;
