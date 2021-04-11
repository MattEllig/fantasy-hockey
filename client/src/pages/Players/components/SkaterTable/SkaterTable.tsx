import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from '../../../../components/DataTable';
import Skeleton from '../../../../components/Skeleton/Skeleton';
import { Skater } from '../../../../types';

interface SkaterTableProps {
    loading: boolean;
    pageSize: number;
    players: Skater[] | undefined;
}

function SkaterTable({ loading, pageSize, players }: SkaterTableProps): JSX.Element {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell align="center">Team</TableCell>
                    <TableCell align="center">Pos</TableCell>
                    <TableCell align="center">GP</TableCell>
                    <TableCell align="center">ATOI</TableCell>
                    <TableCell align="center">G</TableCell>
                    <TableCell align="center">A</TableCell>
                    <TableCell align="center">P</TableCell>
                    <TableCell align="center">+/-</TableCell>
                    <TableCell align="center">PIM</TableCell>
                    <TableCell align="center">PPG</TableCell>
                    <TableCell align="center">PPP</TableCell>
                    <TableCell align="center">SHG</TableCell>
                    <TableCell align="center">SHP</TableCell>
                    <TableCell align="center">GWG</TableCell>
                    <TableCell align="center">FOW%</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading || !players ? (
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
                                {[...Array(14).keys()].map((col) => (
                                    <TableCell key={col}>
                                        <div className="flex justify-center">
                                            <Skeleton size="h-4 w-6" />
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </>
                ) : (
                    <>
                        {players.map((player: Skater) => (
                            <TableRow key={player._id}>
                                <TableCell>{player.name.first} {player.name.last}</TableCell>
                                <TableCell align="center">{player.currentTeam.abbreviation}</TableCell>
                                <TableCell align="center">{player.positions.join('/')}</TableCell>
                                <TableCell align="center">{player.stats.games}</TableCell>
                                <TableCell align="center">{player.stats.timeOnIcePerGame}</TableCell>
                                <TableCell align="center">{player.stats.goals}</TableCell>
                                <TableCell align="center">{player.stats.assists}</TableCell>
                                <TableCell align="center">{player.stats.points}</TableCell>
                                <TableCell align="center">{player.stats.plusMinus > 0 ? `+${player.stats.plusMinus}` : player.stats.plusMinus}</TableCell>
                                <TableCell align="center">{player.stats.penaltyMinutes}</TableCell>
                                <TableCell align="center">{player.stats.powerPlayGoals}</TableCell>
                                <TableCell align="center">{player.stats.powerPlayPoints}</TableCell>
                                <TableCell align="center">{player.stats.shortHandedGoals}</TableCell>
                                <TableCell align="center">{player.stats.shortHandedPoints}</TableCell>
                                <TableCell align="center">{player.stats.gameWinningGoals}</TableCell>
                                <TableCell align="center">{player.stats.faceOffPct.toFixed(1)}</TableCell>
                            </TableRow>
                        ))}
                    </>
                )}
            </TableBody>
        </Table>
    );
}

export default SkaterTable;
