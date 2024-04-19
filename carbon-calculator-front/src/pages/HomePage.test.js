// HomePage.test.js

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { CONFIGURE_INITIAL_PARAMETERS } from '../graphql/mutations';
import { CalculatorContext } from '../components/contexts/CalculatorContext'; 

/* Here we have just a test example to showcase how important is to create testing for the frontend as well, 
but due to time contraints I will not be implementing the remaining tests */

const mocks = [
    {
        request: {
            query: CONFIGURE_INITIAL_PARAMETERS,
            variables: {
                input: {
                    numberOfPeoplehousehold: 2,
                    zipCode: '12345',
                },
            },
        },
        result: {
            data: {
                configureInitialParameters: {
                    carbonFootprintSummary: {
                        currentTotalEmission: 100,
                        currentTotalEmissionAfterPlannedActions: 80,
                        usAverage: 120,
                    },
                },
            },
        },
    },
];

const mockNavigate = jest.fn();
const mockSetError = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    setError: () => mockSetError,
}));

describe('HomePage Tests', () => {    
    

    beforeAll(() => {
        mockNavigate.mockReset();
        mockSetError.mockReset();
    });

    test('renders HomePage and submits data', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                    <CalculatorContext.Provider value={{ 
                        numPeopleHousehold: 2, 
                        setNumPeopleHousehold: jest.fn(),
                        carbonFootprintSummary: null,
                        setCarbonFootprintSummary: jest.fn(),
                        setError: mockSetError
                    }}>
                        <HomePage />
                    </CalculatorContext.Provider>
                </BrowserRouter>
            </MockedProvider>
        );
  
        fireEvent.change(screen.getByLabelText(/number of people in your household/i), {
            target: { value: '2' },
        });
  
        fireEvent.change(screen.getByLabelText(/ZIP Code/i), {
            target: { value: '12345' },
        });
  
        fireEvent.click(screen.getByText(/Get Started/i));
  
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/calculator/home-energy'));

    });
});