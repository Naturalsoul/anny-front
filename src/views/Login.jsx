import React from 'react';

import {
    Row,
    Col,
    Button
} from 'reactstrap';

import { withApollo } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleLogin } from 'react-google-login';
import { Redirect } from 'react-router';

import { DOLOGIN } from '../graphql/login';

import '../assets/css/anny.css';

class Login extends React.PureComponent {
    state = {
        token: '',
        redirect: false,
    };

    constructor(props) {
        super(props);

        this.state = { ...this.state };

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    };

    async handleGoogleLogin({ error, profileObj: { name, imageUrl, email }, googleId }) {
        if (error) {
            console.log('error google login:', error);
            throw error;
        } else {
            const { client } = this.props;

            const { data: { doLogin }, errors } = await client.query({
                query: DOLOGIN,
                variables: {
                    email,
                    name,
                    avatar: imageUrl,
                    googleId,
                },
                errorPolicy: 'all',
            });

            if (errors) {
                console.log(errors);
                throw errors;
            } else {
                
                this.setState({
                    token: doLogin,
                    redirect: true,
                });
            }
        }
    };

    render() {
        const { redirect, token } = this.state;

        if (redirect && token) {
            return <Redirect to={{ pathname: '/admin/empresas', state: { token } }} />;
        } else {
            return (
                <div className='blur-background'>
                    <div className='center-box'>
                        <Row>
                            <Col>
                                <h1 className='text-center text-uppercase text-white'>
                                    Anny
                                </h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <GoogleLogin
                                    clientId='952083819906-s3sut4bghs9f1op2lq9u40tni2me4gca.apps.googleusercontent.com'
                                    buttonText='Iniciar Sesión con Google'
                                    onSuccess={this.handleGoogleLogin}
                                    onFailure={this.handleGoogleLogin}
                                    render={
                                        props => (
                                            <Button
                                                onClick={props.onClick}
                                                outline
                                                color='info'
                                            >
                                                <FontAwesomeIcon icon='envelope' size='lg' /> Ingresar con Google
                                            </Button>
                                        )
                                    }
                                //cookiePolicy='single_host_origin'
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
    };
};

export default withApollo(Login);