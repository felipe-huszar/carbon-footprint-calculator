import { gql } from '@apollo/client';

export const GET_AVERAGE_WASTE = gql`
    query GetAverageWaste($numberOfPersons: Int!) {
        getAverageWaste(numberOfPersons: $numberOfPersons)
    }
`;
