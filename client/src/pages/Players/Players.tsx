import * as React from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import Search from '../../components/Search/Search';
import GoalieTable from './components/GoalieTable/GoalieTable';
import SkaterTable from './components/SkaterTable/SkaterTable';
import usePlayerFiltering from './hooks/usePlayerFiltering/usePlayerFiltering';

const teams = [
    'ANA',
    'ARI',
    'BOS',
    'BUF',
    'CAR',
    'CBJ',
    'CGY',
    'CHI',
    'COL',
    'DAL',
    'DET',
    'EDM',
    'FLA',
    'LAK',
    'MIN',
    'MTL',
    'NJD',
    'NSH',
    'NYI',
    'NYR',
    'OTT',
    'PHI',
    'PIT',
    'SJS',
    'STL',
    'TBL',
    'TOR',
    'VAN',
    'VGK',
    'WPG',
    'WSH'
];

function Players(): JSX.Element {
    const {
        filters,
        changePage,
        changePageSize,
        changePosition,
        changeSearch,
        changeSort,
        changeTeam
    } = usePlayerFiltering();

    return (
        <div className="flex flex-col max-w-screen-2xl mx-auto py-6">
            <div className="px-4 md:px-6 xl:px-8">
                <h2 className="mb-6 text-4xl font-thin tracking-wide">
                    Players
                </h2>
                <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 2xl:col-span-2">
                        <Search id="search" onChange={changeSearch} placeholder="Player name" />
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 2xl:col-span-2">
                        <Dropdown
                            items={[
                                { key: 'All', label: 'All skaters' },
                                { key: 'F', label: 'All forwards' },
                                { key: 'C', label: 'Centers' },
                                { key: 'LW', label: 'Left Wings' },
                                { key: 'RW', label: 'Right Wings' },
                                { key: 'D', label: 'Defensemen' },
                                { key: 'G', label: 'Goalies' },
                            ]}
                            labelText="Position"
                            onChange={changePosition}
                        />
                    </div>
                    <div className="col-span-6 sm:col-span-3 md:col-span-2 xl:col-span-1">
                        <Dropdown
                            items={[
                                { key: '', label: 'All' },
                                ...teams.map((team) => ({ key: team, label: team }))
                            ]}
                            labelText="Team"
                            onChange={changeTeam}
                        />
                    </div>
                </div>
            </div>
            {filters.position !== 'G' ? (
                <SkaterTable
                    filters={filters}
                    onChangePage={changePage}
                    onChangePageSize={changePageSize}
                    onSort={changeSort}
                />
            ) : (
                <GoalieTable
                    filters={filters}
                    onChangePage={changePage}
                    onChangePageSize={changePageSize}
                    onSort={changeSort}
                />
            )}
        </div>
    );
}

export default Players;
