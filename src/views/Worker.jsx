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
    Row
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withCookies } from 'react-cookie';
import { withApollo } from 'react-apollo';
import DatePicker from 'react-datepicker';

import { GETCOMPANIES } from '../graphql/company';
import { GETWORKERS, SAVEWORKER } from '../graphql/worker';

import "react-datepicker/dist/react-datepicker.css";
import Alerts from 'components/Alerts/Alerts';

class Workers extends React.PureComponent {
    state = {
        token: '',
        addWorker: {
            company: '',
            name: '',
            rut: '',
            from_date: new Date(),
        },
        filteredCompany: '',
        filterTable: '',
        companiesList: [],
        workersList: [],
        filteredWorkersList: [],
    };

    constructor(props) {
        super(props);

        const { cookies } = props;

        this.state = { ...this.state, token: cookies.get('token'), };
        this.handleChange = this.handleChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleGetWorkers = this.handleGetWorkers.bind(this);
        this.handleSaveWorker = this.handleSaveWorker.bind(this);
    };

    handleChange(e) {
        this.setState(e);
    };

    handleFilter({ target }) {
        target.value = target.value.toString().toLowerCase();
        this.setState(
            prevState => ({
                ...prevState,
                filterTable: target.value,
                filteredWorkersList: prevState.workersList.filter(
                    e => e.name.toString().toLowerCase().includes(target.value) ||
                         e.rut.includes(target.value) ||
                         e.company.includes(target.value) ||
                         e.from_date.toLocaleDateString().includes(target.value) ||
                         e.date_to.toLocaleDateString().includes(target.value)
                ),
            })
        );
    };

    async handleSaveWorker(e) {
        e.preventDefault();

        const { client } = this.props;
        const { token, filteredWorkersList } = this.state;
        const { company, workerName, workerRut, workerFromDate } = e.target;

        if (filteredWorkersList.filter(e => workerRut.value.toString() === e.rut).length) {
            Alerts({
                type: 'error',
                title: 'RUT duplicado',
                description: `El RUT ${workerRut.value} ya se encuentra registrado por otro trabajador.`,
            });
        } else {
            const { errors } = await client.mutate({
                mutation: SAVEWORKER,
                variables: {
                    token,
                    name: workerName.value.toString(),
                    rut: workerRut.value.toString(),
                    from_date: workerFromDate.value,
                },
                errorPolicy: 'all',
            });

            if (errors) Alerts({ type: 'error', title: 'Error al registrar al trabajador.', error: errors });
            else {
                this.setState(
                    prevState => ({
                        filteredCompany: company,
                        addWorker: {
                            company: '',
                            name: '',
                            rut: '',
                            from_date: new Date(),
                        },
                    })
                );

                this.handleGetWorkers();
            }
        }
    };

    async handleGetWorkers() {
        const { client } = this.props;
        const { filteredCompany, token } = this.state;

        const { data: { getWorkers }, errors } = await client.query({
            query: GETWORKERS,
            variables: {
                token,
                _id: filteredCompany,
            },
            errorPolicy: 'all',
        });

        if (errors) Alerts({ type: 'error', title: 'Error al obtener los trabajadores', error: errors });
        else {
            this.setState({
                workersList: getWorkers.map(
                    e => ({
                        ...e,
                        company: `${e.company.name} - ${e.company.rut}`
                    })
                ),
                filteredWorkersList: getWorkers.map(
                    e => ({
                        ...e,
                        company: `${e.company.name} - ${e.company.rut}`
                    })
                ),
            });
        }
    };

    async componentDidMount() {
        const { client } = this.props;
        const { token } = this.state; 

        const { data: { getCompanies }, errors } = await client.query({
            query: GETCOMPANIES,
            variables: { token },
            errorPolicy: 'all',
        });

        if (errors) {
            Alerts({
                type: 'error',
                title: 'Error al obtener el listado de empresas',
                error: errors[0].message,
            });
        } else {
            this.setState({ companiesList: [ ...getCompanies ] });
        }
    };

    render() {
        const {
            addWorker,
            filteredCompany,
            filterTable,
            filteredWorkersList,
            companiesList,
        } = this.state;

        return (
            <>
                <div className='content'>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <b>Agregar Trabajador</b>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleSaveWorker} inline>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='company' className='mr-sm-2' hidden>
                                                Empresa
                                            </Label>
                                            <Input
                                                type='select'
                                                name='company'
                                                id='company'
                                                placeholder='Seleccione una Empresa'
                                                value={addWorker.company}
                                                onChange={
                                                    ({ target }) => this.setState(
                                                        prevState => ({
                                                            ...prevState,
                                                            addWorker: {
                                                                ...prevState.addWorker,
                                                                company: target.value.toString(),
                                                            },
                                                        })
                                                    )
                                                }
                                            >
                                                <option value='' disabled>Seleccione una Empresa</option>
                                                {
                                                    companiesList.map(
                                                        e => (
                                                            <option value={e._id} key={e._id}>
                                                                { e.name } - { e.rut }
                                                            </option>
                                                        )
                                                    )
                                                }
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='workerName' className='mr-sm-2' hidden>
                                                Nombre
                                            </Label>
                                            <Input
                                                type='text'
                                                name='workerName'
                                                id='workerName'
                                                placeholder='Nombre'
                                                value={addWorker.name}
                                                onChange={
                                                    ({ target }) => this.setState(
                                                        prevState => ({
                                                            addWorker: {
                                                                ...prevState.addWorker,
                                                                name: target.value.toString(),
                                                            },
                                                        })
                                                    )
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='workerRut' className='mr-sm-2' hidden>
                                                Rut
                                            </Label>
                                            <Input
                                                type='text'
                                                name='workerRut'
                                                id='workerRut'
                                                placeholder='Rut'
                                                value={addWorker.rut}
                                                onChange={
                                                    ({ target }) => this.setState(
                                                        prevState => ({
                                                            addWorker: {
                                                                ...prevState.addWorker,
                                                                rut: target.value.toString(),
                                                            },
                                                        })
                                                    )
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <DatePicker
                                                name='workerFromDate'
                                                id='workerFromDate'
                                                placeholder='Desde'
                                                selected={addWorker.from_date}
                                                className='form-control'
                                                dateFormat='dd-MM-yyyy'
                                                onChange={
                                                    date => {console.log(date);this.setState(
                                                        prevState => ({
                                                            addWorker: {
                                                                ...prevState.addWorker,
                                                                from_date: date,
                                                            },
                                                        })
                                                    )}
                                                }
                                            />
                                            <Label for='workerFromDate' className='ml-sm-2'>
                                                Desde
                                            </Label>
                                        </FormGroup>
                                        <Button
                                            color='success'
                                        >
                                            Registrar Trabajador
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <b>
                                        Listado de Trabajadores
                                    </b>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm='8' md='6' lg='6'>
                                            <Form inline>
                                                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                    <Label for='company2' className='mr-sm-2' hidden>
                                                        Empresa
                                                    </Label>
                                                    <Input
                                                        type='select'
                                                        name='company2'
                                                        id='company2'
                                                        placeholder='Seleccione una Empresa'
                                                        value={filteredCompany}
                                                        onChange={
                                                            ({ target }) => this.handleChange({
                                                                filteredCompany: target.value.toString(),
                                                            })
                                                        }
                                                    >
                                                        <option value='' disabled>Seleccione una Empresa</option>
                                                        {
                                                            companiesList.map(
                                                                e => (
                                                                    <option value={e._id} key={e.rut}>
                                                                        { e.name } - { e.rut }
                                                                    </option>
                                                                )
                                                            )
                                                        }
                                                    </Input>
                                                </FormGroup>
                                                <Button color='info'>Buscar <FontAwesomeIcon icon='search' /></Button>
                                            </Form>
                                        </Col>
                                        <Col sm='4' md={{ offset: 2, size: 4, }}>
                                            <Input
                                                type='text'
                                                name='tableFilter'
                                                id='tableFilter'
                                                placeholder='Filtrar listado de trabajadores...'
                                                className='mt-3'
                                                value={filterTable}
                                                onChange={this.handleFilter}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Table hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th scope='row'>
                                                            Rut
                                                        </th>
                                                        <td>
                                                            Nombre
                                                        </td>
                                                        <td>
                                                            Empresa
                                                        </td>
                                                        <td>
                                                            Desde
                                                        </td>
                                                        <td>
                                                            Hasta
                                                        </td>
                                                        <td>
                                                            Acciones
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        filteredWorkersList.map(
                                                            e => (
                                                                <tr key={e._id}>
                                                                    <td>
                                                                        { e.rut }
                                                                    </td>
                                                                    <td>
                                                                        { e.name } 
                                                                    </td>
                                                                    <td>
                                                                        { e.company }
                                                                    </td>
                                                                    <td>
                                                                        { new Date(e.from_date).toLocaleDateString() }
                                                                    </td>
                                                                    <td>
                                                                        <ButtonGroup>
                                                                            <Button className='btn btn-link'>
                                                                                <FontAwesomeIcon className='text-warning' size='lg' icon='edit' />
                                                                            </Button>
                                                                            <Button className='btn btn-link'>
                                                                                <FontAwesomeIcon className='text-danger' size='lg' icon='trash-alt' />
                                                                            </Button>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    }
                                                </tbody>
                                            </Table>
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

export default withCookies(withApollo(Workers));