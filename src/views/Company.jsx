import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    ButtonGroup,
    Table,
    Col,
    Row,
    Alert,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

import { withApollo } from 'react-apollo';
import { withCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alerts from '../components/Alerts/Alerts';

import { GETCOMPANIES, SAVECOMPANY, UPDATECOMPANY, CHANGESTATUSCOMPANY } from '../graphql/company';

class Company extends React.PureComponent {
    state = {
        addCompany: {
            name: '',
            rut: '',
        },
        editCompany: {
            _id: '',
            name: '',
            rut: '',
        },
        activateCompany: {
            _id: '',
            rut: '',
            active: true,
        },
        companiesList: [
            {
                rut: '11111111-1',
                name: 'Empresa de Prueba',
            }
        ],
        filteredCompaniesList: [
            {
                rut: '11111111-1',
                name: 'Empresa de Prueba',
            }
        ],
        filterTable: '',
        error: '',
        modalEdit: false,
        modalDeactivate: false,
        token: '',
    };

    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = { ...this.state, token: cookies.get('token') || '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    };

    handleChange(e) {
        this.setState(e);
    };

    async handleUpdate(e) {
        const { client } = this.props;
        const { editCompany: { _id, name, rut }, token } = this.state;

        const { errors } = await client.mutate({
            mutation: UPDATECOMPANY,
            variables: {
                _id,
                name,
                rut,
                token
            },
            errorPolicy: 'all',
        });

        if (errors) {
            console.log(errors);
            
            Alerts({
                type:'error',
                title: 'Error al actualizar empresa',
                error: errors,
            });
        } else {
            this.setState(e);

            Alerts({
                type: 'success',
                title: 'Empresa actualizada',
                description: '',
            });
        }
    };

    async handleSubmit(e) {
        e.preventDefault();

        const { client } = this.props;
        const { companiesList, token } = this.state;
        const { companyName, companyRut } = e.target;

        if (companiesList.filter(e => e.rut === companyRut.value).length) {
            this.setState(
                prevState => ({
                    ...prevState,
                    error: `El RUT ingresado ya se encuentra registrado para otra empresa.`,
                })
            );
        } else if (companiesList.filter(e => e.name.toString().toLowerCase() === companyName.value.toString().toLowerCase()).length) {
            this.setState(
                prevState => ({
                    ...prevState,
                    error: `El Nombre ingresado ya se encuentra registrado para otra empresa.`,
                })
            );
        } else {
            const { data: { saveCompany }, errors } = await client.mutate({
                mutation: SAVECOMPANY,
                variables: {
                    name: companyName.value.toString(),
                    rut: companyRut.value.toString(),
                    token,
                },
                errorPolicy: 'all',
            });

            if (errors) {
                console.log(errors);
                
                Alerts({
                    type: 'error',
                    title: 'Error al registrar empresa',
                    error: errors,
                });
            } else {
                try {
                    const data = client.readQuery({
                        query: GETCOMPANIES,
                        variables: { token }
                    });

                    data.getCompanies.push({
                        _id: saveCompany,
                        name: companyName.value.toString(),
                        rut: companyRut.value.toString(),
                    });

                    client.writeQuery({
                        query: GETCOMPANIES,
                        variables: { token },
                        data,
                    });
                } catch (e) {
                    console.log(e);
                    
                    Alerts({
                        type: 'error',
                        title: 'Error al registrar empresa',
                        error: e,
                    });
                }
            }

            this.setState(
                prevState => ({
                    ...prevState,
                    addCompany: {
                        name: '',
                        rut: '',
                    },
                    companiesList: [
                        ...prevState.companiesList,
                        {
                            _id: saveCompany,
                            name: companyName.value,
                            rut: companyRut.value,
                            active: true,
                        },
                    ], 
                    filteredCompaniesList: [
                        ...prevState.companiesList,
                        {
                            _id: saveCompany,
                            name: companyName.value,
                            rut: companyRut.value,
                            active: true,
                        },
                    ],
                    filterTable: '',
                    error: '',
                })
            );

            Alerts({
                type: 'success',
                title: 'Empresa registrada',
                description: '',
            });
        }
    };

    async handleActivation(setState, _id, rut, active) {
        const { client } = this.props;
        const { token } = this.state;

        console.log({ _id, rut, active })

        const { errors } = await client.mutate({
            mutation: CHANGESTATUSCOMPANY,
            variables: {
                token,
                _id,
                rut,
                active,
            },
            errorPolicy: 'all',
        });

        if (errors) {
            console.log(errors);
            
            Alerts({
                type: 'error',
                title: 'Error al activar/desactivar empresa',
                error: errors,
            });
        } else {
            this.setState(setState);

            Alerts({
                type: 'success',
                title: active ? 'Empresa activada' : 'Empresa desactivada',
                description: '',
            });
        }
    };

    handleFilter({ target }) {
        target.value = target.value.toString().toLowerCase();
        this.setState(
            prevState => ({
                ...prevState,
                filterTable: target.value,
                filteredCompaniesList: prevState.companiesList.filter(
                    e => e.name.toString().toLowerCase().includes(target.value) || e.rut.includes(target.value)
                ),
            })
        );
    };

    async componentWillMount() {
        const { client } = this.props;
        const { token } = this.state;

        const { data: { getCompanies }, errors } = await client.query({
            query: GETCOMPANIES,
            variables: { token },
            errorPolicy: 'all',
        });

        if (errors) {
            console.log(errors);
            
            Alerts({
                type: 'error',
                title: 'Error al obtener listado de empresas',
                error: errors,
            });
        } else {
            this.setState(
                prevState => ({
                    ...prevState,
                    companiesList: [ ...getCompanies ],
                    filteredCompaniesList: [ ...getCompanies ],
                })
            );
        }
    };

    render() {
        const {
            addCompany,
            editCompany,
            activateCompany,
            filteredCompaniesList,
            filterTable,
            modalEdit,
            modalDeactivate,
            error
        } = this.state;

        return (
            <>
                <div className='content'>
                    <Row>
                        <Col lg='8' md='8' sm='12'>
                            <Card>
                                <CardHeader>
                                    <b>Agregar Empresa</b>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Form inline onSubmit={this.handleSubmit}>
                                                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                    <Label for='companyName' className='mr-sm-2' hidden>
                                                        Nombre
                                                    </Label>
                                                    <Input
                                                        value={addCompany.name}
                                                        type='text'
                                                        name='companyName'
                                                        id='companyName'
                                                        placeholder='Nombre de Empresa'
                                                        required
                                                        onChange={
                                                            ({ target }) => this.handleChange(
                                                                prevState => ({
                                                                    addCompany: {
                                                                        ...prevState.addCompany,
                                                                        name: target.value,
                                                                    },
                                                                })
                                                            )
                                                        }
                                                    />
                                                </FormGroup>
                                                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                    <Label for='companyRut' className='mr-sm-2' hidden>
                                                        RUT
                                                    </Label>
                                                    <Input
                                                        value={addCompany.rut}
                                                        type='text'
                                                        name='companyRut'
                                                        id='companyRut'
                                                        placeholder='RUT de Empresa'
                                                        pattern='(\d){7,8}[-](\d)'
                                                        title='Ingrese RUT sin puntos, con guión y digito verificador'
                                                        required
                                                        onChange={
                                                            ({ target }) => this.handleChange(
                                                                prevState => ({
                                                                    addCompany: {
                                                                        ...prevState.addCompany,
                                                                        rut: target.value,
                                                                    },
                                                                })
                                                            )
                                                        }
                                                    />
                                                </FormGroup>
                                                <Button
                                                    type='submit'
                                                    color='success'
                                                >
                                                    Registrar Empresa
                                                </Button>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {
                                                error ?
                                                    <Alert
                                                        color='danger'
                                                        isOpen={error}
                                                        toggle={
                                                            () => this.handleChange(
                                                                prevState => ({
                                                                    ...prevState,
                                                                    error: '',
                                                                })
                                                            )
                                                        }
                                                    >
                                                        <b>{error}</b>
                                                    </Alert>
                                                :
                                                    null
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <b>
                                        Listado de Empresas
                                    </b>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md={{ offset: 8, size: 4, }}>
                                            <Input
                                                type='text'
                                                value={filterTable}
                                                placeholder='Filtrar listado de empresas...'
                                                name='filterTable'
                                                className='mb-2'
                                                onChange={this.handleFilter}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Table hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Rut
                                                        </th>
                                                        <td>
                                                            Nombre
                                                        </td>
                                                        <td>
                                                            Acciones
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        filteredCompaniesList.map(
                                                            (e, i) => (
                                                                <tr
                                                                    key={i}
                                                                    className={
                                                                        e.active ? '' : 'not-active'
                                                                    }
                                                                >
                                                                    <th>
                                                                        {e.rut}
                                                                    </th>
                                                                    <td>
                                                                        {e.name}
                                                                    </td>
                                                                    <td>
                                                                        <ButtonGroup>
                                                                            <Button
                                                                                className='btn btn-link'
                                                                                onClick={
                                                                                    () => this.handleChange(
                                                                                        prevState => ({
                                                                                            ...prevState,
                                                                                            editCompany: {
                                                                                                _id: e._id,
                                                                                                name: e.name,
                                                                                                rut: e.rut,
                                                                                            },
                                                                                            modalEdit: !prevState.modalEdit,
                                                                                        })
                                                                                    )
                                                                                }
                                                                                title='Actualizar Empresa'
                                                                            >
                                                                                <FontAwesomeIcon className='text-warning' size='lg' icon='edit' />
                                                                            </Button>
                                                                            <Modal
                                                                                isOpen={modalEdit}
                                                                                toggle={
                                                                                    () => this.handleChange(
                                                                                        prevState => ({
                                                                                            modalEdit: !prevState.modalEdit,
                                                                                        })
                                                                                    )
                                                                                }
                                                                            >
                                                                                <ModalHeader
                                                                                    toggle={
                                                                                        () => this.handleChange(
                                                                                            prevState => ({
                                                                                                modalEdit: !prevState.modalEdit,
                                                                                            })
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Actualizar Empresa
                                                                                </ModalHeader>
                                                                                <ModalBody>
                                                                                    <Form inline>
                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                            <Label for='companyNameEdit' className='mr-sm-2' hidden>
                                                                                                Nombre
                                                                                            </Label>
                                                                                            <Input
                                                                                                value={editCompany.name}
                                                                                                type='text'
                                                                                                name='companyNameEdit'
                                                                                                id='companyNameEdit'
                                                                                                placeholder='Nombre de Empresa'
                                                                                                onChange={
                                                                                                    ({ target }) => this.handleChange(
                                                                                                        prevState => ({
                                                                                                            editCompany: {
                                                                                                                ...prevState.editCompany,
                                                                                                                name: target.value,
                                                                                                            },
                                                                                                        })
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </FormGroup>
                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                            <Label for='companyRutEdit' className='mr-sm-2' hidden>
                                                                                                Rut
                                                                                            </Label>
                                                                                            <Input
                                                                                                value={editCompany.rut}
                                                                                                type='text'
                                                                                                name='companyRutEdit'
                                                                                                id='companyRutEdit'
                                                                                                placeholder='Rut de Empresa'
                                                                                                disabled
                                                                                                onChange={
                                                                                                    ({ target }) => this.handleChange(
                                                                                                        prevState => ({
                                                                                                            editCompany: {
                                                                                                                ...prevState.editCompany,
                                                                                                                rut: target.value,
                                                                                                            },
                                                                                                        })
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </FormGroup>
                                                                                    </Form>
                                                                                </ModalBody>
                                                                                <ModalFooter>
                                                                                    <Button
                                                                                        color='primary'
                                                                                        onClick={
                                                                                            () => this.handleUpdate(
                                                                                                prevState => ({
                                                                                                    ...prevState,
                                                                                                    companiesList: prevState.companiesList.map(
                                                                                                        y => {
                                                                                                            if (y.rut === editCompany.rut) {
                                                                                                                y.name = editCompany.name;
                                                                                                            }

                                                                                                            return y;
                                                                                                        }
                                                                                                    ),
                                                                                                    modalEdit: false,
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Actualizar
                                                                                    </Button> {' '}
                                                                                    <Button
                                                                                        color='link'
                                                                                        onClick={
                                                                                            () => this.handleChange(
                                                                                                prevState => ({
                                                                                                    modalEdit: !prevState.modalEdit,
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Cancelar
                                                                                    </Button>
                                                                                </ModalFooter>
                                                                            </Modal>
                                                                            <Button
                                                                                className='btn btn-link'
                                                                                onClick={
                                                                                    () => this.handleChange(
                                                                                        prevState => ({
                                                                                            ...prevState,
                                                                                            activateCompany: {
                                                                                                _id: e._id,
                                                                                                rut: e.rut,
                                                                                                active: e.active,
                                                                                            },
                                                                                            modalDeactivate: true,
                                                                                        })
                                                                                    )
                                                                                }
                                                                                title={
                                                                                    e.active ? 'Desactivar Empresa' : 'Activar Empresa'
                                                                                }
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    className={
                                                                                        e.active ? 'text-danger' : 'text-success'
                                                                                    }
                                                                                    size='lg'
                                                                                    icon={
                                                                                        e.active ? 'minus-circle' : 'plus-circle'
                                                                                    }
                                                                                />
                                                                            </Button>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                        
                                                    }
                                                </tbody>
                                            </Table>
                                            <Modal
                                                isOpen={modalDeactivate}
                                                toggle={
                                                    () => this.handleChange(
                                                        prevState => ({
                                                            modalDeactivate: !prevState.modalDeactivate,
                                                        })
                                                    )
                                                }
                                            >
                                                <ModalHeader
                                                    toggle={
                                                        () => this.handleChangeñ(
                                                            prevState => ({
                                                                modalEdit: !prevState.modalEdit,
                                                            })
                                                        )
                                                    }
                                                >
                                                    {
                                                        activateCompany.active ?
                                                            'Desactivar Empresa'
                                                        :
                                                            'Activar Empresa'
                                                    }
                                                </ModalHeader>
                                                <ModalBody>
                                                    <Row>
                                                        <Col>
                                                            <p>
                                                                {
                                                                    activateCompany.active ?
                                                                        (
                                                                            <>
                                                                                ¿Está seguro de <b className='text-danger'>DESACTIVAR</b> esta empresa? Esto <b>también desactivará a todos los trabajadores asociados a esta empresa</b>.
                                                                            </>
                                                                        )
                                                                    :
                                                                        (
                                                                            <>
                                                                                ¿Está seguro de <b className='text-success'>ACTIVAR</b> esta empresa? Esto <b>también activará a todos los trabajadores asociados a esta empresa</b>.
                                                                            </>
                                                                        )
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </ModalBody>
                                                <ModalFooter>
                                                    {
                                                        activateCompany.active ?
                                                        (
                                                            <Button
                                                                color='danger'
                                                                onClick={
                                                                    () => this.handleActivation(
                                                                        prevState => ({
                                                                            ...prevState,
                                                                            activateCompany: {
                                                                                _id: '',
                                                                                rut: '',
                                                                                active: true,
                                                                            },
                                                                            companiesList: prevState.companiesList.map(x => {
                                                                                if (x._id === activateCompany._id) x.active = false;
                                                                                return x;
                                                                            }),
                                                                            filteredCompaniesList: prevState.filteredCompaniesList.map(x => {
                                                                                if (x._id === activateCompany._id) x.active = false;
                                                                                return x;
                                                                            }),
                                                                            modalDeactivate: false,
                                                                        }),
                                                                        activateCompany._id,
                                                                        activateCompany.rut,
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                Desactivar
                                                            </Button>
                                                        )
                                                        :
                                                        (
                                                            <Button
                                                                color='success'
                                                                onClick={
                                                                    () => this.handleActivation(
                                                                        prevState => ({
                                                                            ...prevState,
                                                                            companiesList: prevState.companiesList.map(x => {
                                                                                if (x._id === activateCompany._id) x.active = true;
                                                                                return x;
                                                                            }),
                                                                            filteredCompaniesList: prevState.filteredCompaniesList.map(x => {
                                                                                if (x._id === activateCompany._id) x.active = true;
                                                                                return x;
                                                                            }),
                                                                            modalDeactivate: false,
                                                                        }),
                                                                        activateCompany._id,
                                                                        activateCompany.rut,
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                Activar
                                                            </Button>
                                                        )
                                                    }
                                                    {' '}
                                                    <Button
                                                        color='link'
                                                        onClick={
                                                            () => this.handleChange(
                                                                prevState => ({
                                                                    modalDeactivate: !prevState.modalDeactivate,
                                                                })
                                                            )
                                                        }
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    };
};

export default withCookies(withApollo(Company));