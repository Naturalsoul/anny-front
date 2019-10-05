import gql from 'graphql-tag';
//import { graphql } from 'react-apollo';

export const DOLOGIN = gql`
    query doLogin($email: String!, $name: String!, $avatar: String!, $googleId: String!) {
        doLogin(email: $email, name: $name, avatar: $avatar, googleId: $googleId)
    }
`;