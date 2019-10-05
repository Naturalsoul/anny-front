import gql from 'graphql-tag';

export const GETCOMPANIES = gql`
    query getCompanies($token: String!) {
        getCompanies(token: $token) {
            _id,
            rut,
            name
        }
    }
`;