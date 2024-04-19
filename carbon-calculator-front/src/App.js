import React from 'react'; 

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import HomePage from './pages/HomePage';
import HomeEnergySection from './components/calculator/HomeEnergySection';
import TransportationSection from './components/calculator/TransportationSection';
import WasteSection from './components/calculator/WasteSection';
import EmissionsReportPage from './components/summary/EmissionsReportPage';
import { CalculatorProvider } from './components/contexts/CalculatorContext';

const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql', // replace with your GraphQL server URI
    cache: new InMemoryCache(),
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <CalculatorProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />                     
                        <Route path="/calculator/home-energy" element={<HomeEnergySection />} /> 
                        <Route path="/calculator/transportation" element={<TransportationSection />} /> 
                        <Route path="/calculator/waste" element={<WasteSection />} />                     
                        <Route path="/calculator/report" element={<EmissionsReportPage />} />   
                    </Routes>
                </Router>
            </CalculatorProvider>
        </ApolloProvider>
    );
};

export default App;
