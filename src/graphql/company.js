import gql from 'graphql-tag';

export const GETCOMPANIES = gql`
    query getCompanies($token: String!) {
        getCompanies(token: $token) {
            _id,
            rut,
            name,
            active
        }
    }
`;

export const SAVECOMPANY = gql `
    mutation saveCompany($token: String!, $name: String!, $rut: String!) {
        saveCompany(token: $token, name: $name, rut: $rut)
    }
`;

export const UPDATECOMPANY = gql`
    mutation updateCompany($token: String!, $_id: String!, $name: String!, $rut: String!) {
        updateCompany(token: $token, _id: $_id, name: $name, rut: $rut)
    }
`;

export const CHANGESTATUSCOMPANY = gql`
    mutation changeStatusCompany($token: String!, $_id: String!, $rut: String!, $active: Boolean!) {
        changeStatusCompany(token: $token, _id: $_id, rut: $rut, active: $active)
    }
`;