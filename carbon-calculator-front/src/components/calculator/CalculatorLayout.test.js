// CalculatorLayout.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CalculatorLayout from './CalculatorLayout';

describe('CalculatorLayout Tests', () => {    

    test('renders CalculatorLayout and navigates correctly', () => {
        render(
            <BrowserRouter>
                <CalculatorLayout>
                    <div>Test Child</div>
                </CalculatorLayout>
            </BrowserRouter>
        );

        // Check that the navigation links are present
        expect(screen.getByText('Home Energy')).toBeInTheDocument();
        expect(screen.getByText('Transportation')).toBeInTheDocument();
        expect(screen.getByText('Waste')).toBeInTheDocument();
        expect(screen.getByText('Calculate')).toBeInTheDocument();

        // Click on the links and check that the URL changes correctly
        fireEvent.click(screen.getByText('Home Energy'));
        expect(window.location.pathname).toBe('/calculator/home-energy');

        fireEvent.click(screen.getByText('Transportation'));
        expect(window.location.pathname).toBe('/calculator/transportation');

        fireEvent.click(screen.getByText('Waste'));
        expect(window.location.pathname).toBe('/calculator/waste');

        fireEvent.click(screen.getByText('Calculate'));
        expect(window.location.pathname).toBe('/calculator/report');
    });
});