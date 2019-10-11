import gql from 'graphql-tag';

export const GETWORKERS = gql`
    query getWorkers($token: String!, $_id: String!) {
        getWorkers(token: $token, _id: $_id) {
            _id,
            name,
            rut,
            company {
                name,
                rut
            },
            from_date,
            to_date
        }
    }
`;

export const SAVEWORKER = gql`
    mutation saveWorker($token: String!, $company: String!, $name: String!, $rut: String!, $from_date: Date!) {
        saveWorker(token: $token, company: $company, name: $name, rut: $rut, from_date: $from_date)
    }
`;