import * as React from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import Players from './pages/Players/Players';

function App(): JSX.Element {
    return (
        <Layout>
            <Players />
        </Layout>
    );
}

export default App;
