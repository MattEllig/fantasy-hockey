import * as React from 'react';
import DataTable, { TableBody, TableCell, TableHead, TableRow } from '../../../../components/DataTable';
import Skeleton from '../../../../components/Skeleton/Skeleton';
import { Skater } from '../../../../types';

interface SkaterTableProps {
    loading: boolean;
    pageSize: number;
    players: Skater[];
}

const headers = [
    { header: 'Player', key: 'player' },
    { header: 'Team', key: 'team', align: 'center' },
    { header: 'Pos', key: 'pos', align: 'center' },
    { header: 'GP', key: 'gp', align: 'center' },
    { header: 'ATOI', key: 'atoi', align: 'center' },
    { header: 'G', key: 'g', align: 'center' },
    { header: 'A', key: 'a', align: 'center' },
    { header: 'P', key: 'p', align: 'center' },
    { header: '+/-', key: '+/-', align: 'center' },
    { header: 'PIM', key: 'pim', align: 'center' },
    { header: 'PPG', key: 'ppg', align: 'center' },
    { header: 'PPP', key: 'ppp', align: 'center' },
    { header: 'SHG', key: 'shg', align: 'center' },
    { header: 'SHP', key: 'shp', align: 'center' },
    { header: 'GWG', key: 'gwg', align: 'center' },
    { header: 'FOW%', key: 'fow%', align: 'center' },
];

function SkaterTable({ loading, pageSize, players }: SkaterTableProps): JSX.Element {
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
                        {players.map((row: Skater) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <span className="whitespace-nowrap">
                                        {row.name.first} {row.name.last}
                                    </span>
                                </TableCell>
                                <TableCell align="center">{row.currentTeam.abbreviation}</TableCell>
                                <TableCell align="center">{row.positions.join('/')}</TableCell>
                                <TableCell align="center">{row.stats.games}</TableCell>
                                <TableCell align="center">{row.stats.timeOnIcePerGame}</TableCell>
                                <TableCell align="center">{row.stats.goals}</TableCell>
                                <TableCell align="center">{row.stats.assists}</TableCell>
                                <TableCell align="center">{row.stats.points}</TableCell>
                                <TableCell align="center">{row.stats.plusMinus > 0 ? `+${row.stats.plusMinus}` : row.stats.plusMinus}</TableCell>
                                <TableCell align="center">{row.stats.penaltyMinutes}</TableCell>
                                <TableCell align="center">{row.stats.powerPlayGoals}</TableCell>
                                <TableCell align="center">{row.stats.powerPlayPoints}</TableCell>
                                <TableCell align="center">{row.stats.shortHandedGoals}</TableCell>
                                <TableCell align="center">{row.stats.shortHandedPoints}</TableCell>
                                <TableCell align="center">{row.stats.gameWinningGoals}</TableCell>
                                <TableCell align="center">{row.stats.faceOffPct.toFixed(1)}</TableCell>
                            </TableRow>
                        ))}
                    </>
                )}
            </TableBody>
        </DataTable>
    );
}

export default SkaterTable;
