import * as React from 'react';
import DataTable, { TableBody, TableCell, TableHead, TableRow } from '../../../../components/DataTable';
import Skeleton from '../../../../components/Skeleton/Skeleton';
import { Goalie } from '../../../../types';

interface GoalieTableProps {
    loading: boolean;
    pageSize: number;
    players: Goalie[];
}

const headers = [
    { header: 'Player', key: 'player' },
    { header: 'Team', key: 'team', align: 'center' },
    { header: 'GP', key: 'gp', align: 'center' },
    { header: 'GS', key: 'gs', align: 'center' },
    { header: 'W', key: 'w', align: 'center' },
    { header: 'L', key: 'l', align: 'center' },
    { header: 'OTL', key: 'otl', align: 'center' },
    { header: 'SA', key: 'sa', align: 'center' },
    { header: 'SV', key: 'sv', align: 'center' },
    { header: 'GA', key: 'ga', align: 'center' },
    { header: 'SV%', key: 'sv%', align: 'center' },
    { header: 'GAA', key: 'gaa', align: 'center' },
    { header: 'SO', key: 'so', align: 'center' },
];

function GoalieTable({ loading, pageSize, players }: GoalieTableProps): JSX.Element {
    return (
        <DataTable>
            <TableHead>
                <TableRow>
                    {headers.map((header) => (
                        <TableCell key={header.key} align={header.align}>
                            {header.header}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    <>
                        {[...Array(pageSize).keys()].map((page) => (
                            <TableRow key={page}>
                                <TableCell>
                                    <Skeleton size="h-4 w-36" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <Skeleton size="h-4 w-8" />
                                    </div>
                                </TableCell>
                                {[...Array(headers.length - 2).keys()].map((col) => (
                                    <TableCell key={col}>
                                        <div className="flex justify-center">
                                            <Skeleton size="h-4 w-6" />
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </>
                ) : players.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={headers.length}>
                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                No results found. Try adjusting your search.
                            </p>
                        </TableCell>
                    </TableRow>
                ) : (
                    <>
                        {players.map((row: Goalie) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <span className="whitespace-nowrap">
                                        {row.name.first} {row.name.last}
                                    </span>
                                </TableCell>
                                <TableCell align="center">{row.currentTeam.abbreviation}</TableCell>
                                <TableCell align="center">{row.stats.games}</TableCell>
                                <TableCell align="center">{row.stats.gamesStarted}</TableCell>
                                <TableCell align="center">{row.stats.wins}</TableCell>
                                <TableCell align="center">{row.stats.losses}</TableCell>
                                <TableCell align="center">{row.stats.otLosses}</TableCell>
                                <TableCell align="center">{row.stats.saves + row.stats.goalsAgainst}</TableCell>
                                <TableCell align="center">{row.stats.saves}</TableCell>
                                <TableCell align="center">{row.stats.goalsAgainst}</TableCell>
                                <TableCell align="center">.{Math.trunc(row.stats.savePercentage * 1000)}</TableCell>
                                <TableCell align="center">{row.stats.goalsAgainstAverage.toFixed(2)}</TableCell>
                                <TableCell align="center">{row.stats.shutouts}</TableCell>
                            </TableRow>
                        ))}
                    </>
                )}
            </TableBody>
        </DataTable>
    );
}

export default GoalieTable;
