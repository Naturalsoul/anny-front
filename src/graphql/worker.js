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

export const UPDATEWORKER = gql`
    mutation updateWorker($token: String!, $_id: String!, $name: String!, $rut: String!, $from_date: Date!, $to_date: Date) {
        updateWorker(token: $token, _id: $_id, name: $name, rut: $rut, from_date: $from_date, to_date: $to_date)
    }
`;