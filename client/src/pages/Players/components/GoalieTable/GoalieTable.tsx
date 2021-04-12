import * as React from 'react';
import DataTable, { TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '../../../../components/DataTable';
import Pagination, { PageChangeHandler, PageSizeChangeHandler } from '../../../../components/Pagination/Pagination';
import Skeleton from '../../../../components/Skeleton/Skeleton';
import { Goalie } from '../../../../types';
import usePlayerListFetching from '../../hooks/usePlayerListFetching/usePlayerListFetching';
import { PlayerFilters } from '../../Players';

interface GoalieTableProps {
    filters: PlayerFilters;
    onChangePage: PageChangeHandler;
    onChangePageSize: PageSizeChangeHandler;
    onSort: (newSortProperty: string) => void;
}

const headers = [
    { header: 'Player', key: 'name.last' },
    { header: 'Team', key: 'currentTeam.abbreviation' },
    { header: 'GP', key: 'states.games', numeric: true },
    { header: 'GS', key: 'stats.gamesStarted', numeric: true },
    { header: 'W', key: 'stats.wins', numeric: true },
    { header: 'L', key: 'stats.losses', numeric: true },
    { header: 'OTL', key: 'stats.otLosses', numeric: true },
    { header: 'SA', key: 'shotsAgainst', numeric: true, ignoreSort: true },
    { header: 'SV', key: 'stats.saves', numeric: true },
    { header: 'GA', key: 'stats.goalsAgainst', numeric: true },
    { header: 'SV%', key: 'stats.savePercentage', numeric: true },
    { header: 'GAA', key: 'stats.goalsAgainstAverage', numeric: true },
    { header: 'SO', key: 'stats.shutouts', numeric: true },
];

function GoalieTable({ filters, onChangePage, onChangePageSize, onSort }: GoalieTableProps): JSX.Element {
    const { loading, players } = usePlayerListFetching<Goalie>('api/goalie', filters);

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
                {[...Array(headers.length - 2).keys()].map((col) => (
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
            <DataTable>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHeader
                                key={header.key}
                                active={filters.sort.property === header.key}
                                direction={filters.sort.ascending ? 'ascending' : 'descending'}
                                numeric={header.numeric}
                                onSort={onSort}
                                sortId={header.key}
                            >
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
                            <TableCell colSpan={headers.length}>
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                    No results found. Try adjusting your search.
                                </p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {players.results.map((row: Goalie) => (
                                <TableRow key={row._id}>
                                    <TableCell>
                                        <span className="whitespace-nowrap">
                                            {row.name.first} {row.name.last}
                                        </span>
                                    </TableCell>
                                    <TableCell>{row.currentTeam.abbreviation}</TableCell>
                                    <TableCell numeric>{row.stats.games}</TableCell>
                                    <TableCell numeric>{row.stats.gamesStarted}</TableCell>
                                    <TableCell numeric>{row.stats.wins}</TableCell>
                                    <TableCell numeric>{row.stats.losses}</TableCell>
                                    <TableCell numeric>{row.stats.otLosses}</TableCell>
                                    <TableCell numeric>{row.stats.saves + row.stats.goalsAgainst}</TableCell>
                                    <TableCell numeric>{row.stats.saves}</TableCell>
                                    <TableCell numeric>{row.stats.goalsAgainst}</TableCell>
                                    <TableCell numeric>{row.stats.savePercentage.toFixed(3)}</TableCell>
                                    <TableCell numeric>{row.stats.goalsAgainstAverage.toFixed(2)}</TableCell>
                                    <TableCell numeric>{row.stats.shutouts}</TableCell>
                                </TableRow>
                            ))}
                        </>
                    )}
                </TableBody>
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

export default GoalieTable;
