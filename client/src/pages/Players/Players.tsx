import * as React from 'react';
import axios from 'axios';
import { Skater } from '../../types';
import SkaterTable from './components/SkaterTable/SkaterTable';
import Pagination from '../../components/Pagination/Pagination';

interface PlayerQueryResult {
    results: Skater[];
    totalItems: number;
}

function Players(): JSX.Element {
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(50);
    const [players, setPlayers] = React.useState<PlayerQueryResult>();

    React.useEffect(() => {
        const source = axios.CancelToken.source();

        let isMounted = true;

        async function getPlayers() {
            setLoading(true);

            try {
                const response = await axios.get('/api/player', {
                    cancelToken: source.token,
                    params: { page, pageSize }
                });

                setPlayers(response.data);
            } catch (error) {
                if (!isMounted || axios.isCancel(error)) return;

                console.error('Error fetching players:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        getPlayers();

        return () => {
            isMounted = false;
            source.cancel();
        };
    }, [page, pageSize]);

    return (
        <div className="flex flex-col max-w-screen-2xl mx-auto py-6 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-4xl font-thin tracking-wide">
                Players
            </h2>
            <SkaterTable loading={loading} pageSize={pageSize} players={players?.results} />
            <Pagination
                itemsLabel="players"
                onChangePage={setPage}
                onChangePageSize={setPageSize}
                page={page}
                pageSize={50}
                pageSizes={[10, 25, 50, 100]}
                totalItems={players?.totalItems || 0}
            />
        </div>
    );
}

export default Players;
