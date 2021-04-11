interface Player {
    _id: number;
    name: {
        first: string;
        last: string;
    };
    currentTeam: {
        nhlId: number;
        name: string;
        abbreviation: string;
    };
    lastUpdate: Date;
}

export interface Skater extends Player {
    positions: string[];
    stats: {
        games: number;
        goals: number;
        assists: number;
        points: number;
        shots: number;
        blocks: number;
        hits: number;
        powerPlayGoals: number;
        powerPlayPoints: number;
        shortHandedGoals: number;
        shortHandedPoints: number;
        timeOnIcePerGame: string;
        plusMinus: number;
        penaltyMinutes: number;
        gameWinningGoals: number;
        faceOffPct: number;
    }
}

export interface Goalie extends Player {
    stats: {
        games: number;
        gamesStarted: number;
        wins: number;
        losses: number;
        otLosses: number;
        shutouts: number;
        saves: number;
        savePercentage: number;
        goalsAgainst: number;
        goalsAgainstAverage: number;
    }
}
