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
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withCookies } from 'react-cookie';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { GETCOMPANIES } from '../graphql/company';
import { GETWORKERS, SAVEWORKER, UPDATEWORKER } from '../graphql/worker';

import "react-datepicker/dist/react-datepicker.css";
import Alerts from 'components/Alerts/Alerts';

class Workers extends React.PureComponent {
    state = {
        token: '',
        addWorker: {
            name: '',
            rut: '',
            from_date: new Date(),
        },
        editWorker: {
            _id: '',
            rut: '',
            name: '',
            company: '',
            from_date: new Date(),
            to_date: '',
        },
        filteredCompany: '',
        filterTable: '',
        companiesList: [],
        workersList: [],
        filteredWorkersList: [],
        modalEdit: false,
        loadingWorkers: false,
    };

    constructor(props) {
        super(props);

        const { cookies } = props;

        this.state = { ...this.state, token: cookies.get('token') || '', };
        this.handleChange = this.handleChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleGetWorkers = this.handleGetWorkers.bind(this);
        this.handleSaveWorker = this.handleSaveWorker.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    };

    async handleUpdate() {
        const {
            token,
            editWorker: { _id, name, rut, from_date, to_date },
            filteredCompany,
        } = this.state;
        const { client } = this.props;

        if (!name) Alerts({ type: 'error', title: 'Error al Actualizar', description: 'Debe ingresar un Nombre' });
        else if (!from_date) Alerts({ type: 'error', title: 'Error al Actualizar', description: 'Debe ingresar una "Fecha Desde".' });
        else {
            const { errors } = await client.mutate({
                mutation: UPDATEWORKER,
                variables: { token, _id, name, rut, from_date, to_date },
                errorPolicy: 'all',
            });

            if (errors) Alerts({ type: 'error', title: 'Error al actualizar el trabajador', error: errors[0].message });
            else {
                try {
                    const data = await client.readQuery({
                        query: GETWORKERS,
                        variables: { token, _id: filteredCompany.value.toString() }
                    })

                    data.getWorkers = data.getWorkers.map(
                        e => {
                            if (e._id === _id) {
                                e = {
                                    ...e,
                                    name,
                                    from_date,
                                    to_date,
                                }
                            }

                            return e;
                        }
                    );

                    client.writeQuery({
                        query: GETWORKERS,
                        variables: { token, _id: filteredCompany.value.toString() },
                        data,
                    });
                } catch (e) {
                    console.log('error updating worker: ', e);
                    Alerts({ type: 'Error', title: 'Error al actualizar el trabajador', error: e });
                }

                this.setState(
                    prevState => ({
                        modalEdit: false,
                        editWorker: {
                            _id: '',
                            rut: '',
                            name: '',
                            company: '',
                            from_date: new Date(),
                            to_date: '',
                        },
                        workersList: prevState.workersList.map(
                            e => {
                                if (e._id === _id) {
                                    e = {
                                        ...e,
                                        name,
                                        from_date,
                                        to_date,
                                    };
                                }

                                return e;
                            }
                        ),
                        filteredWorkersList: prevState.filteredWorkersList.map(
                            e => {
                                if (e._id === _id) {
                                    e = {
                                        ...e,
                                        name,
                                        from_date,
                                        to_date,
                                    };
                                }

                                return e;
                            }
                        ),
                    })
                );

                Alerts({ type: 'success', title: 'Se actualizó el trabajador', description: '' });
            }
        }
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
        const { token, filteredWorkersList, filteredCompany, companiesList, } = this.state;
        const { workerName, workerRut, workerFromDate } = e.target;
        const fromDateArr = workerFromDate.value.toString().split('-');
        const fromDate = new Date(fromDateArr[2], +fromDateArr[1] - 1, fromDateArr[0]);
        const company = companiesList.filter(e => e._id === filteredCompany.value.toString())[0];

        if (filteredWorkersList.filter(e => workerRut.value.toString() === e.rut).length) {
            Alerts({
                type: 'error',
                title: 'RUT duplicado',
                description: `El RUT ${workerRut.value} ya se encuentra registrado por otro trabajador.`,
            });
        } else {
            const { data: { saveWorker }, errors } = await client.mutate({
                mutation: SAVEWORKER,
                variables: {
                    token,
                    company: filteredCompany.value.toString(),
                    name: workerName.value.toString(),
                    rut: workerRut.value.toString(),
                    from_date: fromDate,
                },
                errorPolicy: 'all',
            });

            if (errors) Alerts({ type: 'error', title: 'Error al registrar al trabajador.', error: errors[0].message });
            else {
                try {
                    const data = await client.readQuery({
                        query: GETWORKERS,
                        variables: {
                            token,
                            _id: filteredCompany.value.toString(),
                        }
                    });

                    data.getWorkers.push({
                        _id: saveWorker,
                        company: {
                            name: company.name,
                            rut: company.rut,
                            __typename: 'Company'
                        },
                        name: workerName.value.toString(),
                        rut: workerRut.value.toString(),
                        from_date: fromDate,
                        to_date: null,
                        __typename: 'Worker',
                    });

                    client.writeQuery({
                        query: GETWORKERS,
                        variables: { token, _id: filteredCompany.value.toString() },
                        data
                    });
                } catch (e) {
                    console.log('error saving worker: ', e);
                    Alerts({ type: 'error', title: 'Error al registrar el trabajador', error: e });
                }

                this.setState(
                    prevState => ({
                        addWorker: {
                            name: '',
                            rut: '',
                            from_date: new Date(),
                        },
                        workersList: [
                            ...prevState.workersList,
                            {
                                _id: saveWorker,
                                company: `${company.name} - ${company.rut}`,
                                name: workerName.value.toString(),
                                rut: workerRut.value.toString(),
                                from_date: fromDate,
                                to_date: null,
                                __typename: 'Worker',
                            }
                        ],
                        filteredWorkersList: [
                            ...prevState.filteredWorkersList,
                            {
                                _id: saveWorker,
                                company: `${company.name} - ${company.rut}`,
                                name: workerName.value.toString(),
                                rut: workerRut.value.toString(),
                                from_date: fromDate,
                                to_date: null,
                                __typename: 'Worker',
                            }
                        ]
                    })
                );

                Alerts({ type: 'success', title: 'Trabajador registrado', description: '', });
            }
        }
    };

    async handleGetWorkers(filteredCompany) {
        const { client } = this.props;
        const { token } = this.state;

        if (filteredCompany) {
            this.setState({ loadingWorkers: true, });

            const { data: { getWorkers }, errors } = await client.query({
                query: GETWORKERS,
                variables: {
                    token,
                    _id: filteredCompany.value.toString(),
                },
                errorPolicy: 'all',
            });

            if (errors) {
                Alerts({ type: 'error', title: 'Error al obtener los trabajadores', error: errors[0].message });
                this.setState({ loadingWorkers: false, });
            } else {
                this.setState(
                    prevState => ({
                        ...prevState,
                        filteredCompany: filteredCompany,
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
                        loadingWorkers: false,
                    })
                );
            }
        } else {
            this.setState({ filteredCompany: '' })
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
            this.setState({ companiesList: [...getCompanies] });
        }
    };

    render() {
        const {
            addWorker,
            filteredCompany,
            filterTable,
            filteredWorkersList,
            companiesList,
            modalEdit,
            editWorker,
            loadingWorkers,
            token,
        } = this.state;

        return (
            <>
                <div className='content'>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <b>Seleccionar Empresa</b>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm='6'>
                                            <Select
                                                autoFocus
                                                isClearable
                                                components={makeAnimated()}
                                                value={filteredCompany}
                                                placeholder='Seleccione una Empresa...'
                                                options={
                                                    companiesList.map(
                                                        e => ({ value: e._id, label: `${e.name} - ${e.rut}`, })
                                                    )
                                                }
                                                onChange={this.handleGetWorkers}
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {
                        filteredCompany ?
                            <>
                                <Row>
                                    <Col>
                                        <Card>
                                            <CardHeader>
                                                <b>Agregar Trabajador</b>
                                            </CardHeader>
                                            <CardBody>
                                                <Form onSubmit={this.handleSaveWorker} inline>
                                                    <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                        <Label for='workerName' className='mr-sm-2' hidden>
                                                            Nombre
                                                        </Label>
                                                        <Input
                                                            required
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
                                                            required
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
                                                            required
                                                            name='workerFromDate'
                                                            id='workerFromDate'
                                                            placeholder='Desde'
                                                            selected={addWorker.from_date}
                                                            className='form-control'
                                                            dateFormat='dd-MM-yyyy'
                                                            onChange={
                                                                date => {
                                                                    console.log(date); this.setState(
                                                                        prevState => ({
                                                                            addWorker: {
                                                                                ...prevState.addWorker,
                                                                                from_date: date,
                                                                            },
                                                                        })
                                                                    )
                                                                }
                                                            }
                                                        />
                                                        <Label for='workerFromDate' className='ml-sm-2'>
                                                            Desde
                                                        </Label>
                                                    </FormGroup>
                                                    <Row>
                                                        <Col>
                                                            <Button
                                                                color='success'
                                                            >
                                                                Registrar Trabajador
                                                            </Button>
                                                        </Col>
                                                    </Row>
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
                                                <Row className='pb-2'>
                                                    <Col sm='4' md={{ offset: 8, size: 4, }}>
                                                        <Input
                                                            type='text'
                                                            name='tableFilter'
                                                            id='tableFilter'
                                                            placeholder='Filtrar listado de trabajadores...'
                                                            className='mt-3 form-control'
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
                                                                            <tr key={e._id} className={
                                                                                e.to_date ?
                                                                                    new Date(e.from_date) > new Date(e.to_date) ?
                                                                                        'not-active'
                                                                                    :
                                                                                        ''
                                                                                :
                                                                                    ''
                                                                            }>
                                                                                <td>
                                                                                    {e.rut}
                                                                                </td>
                                                                                <td>
                                                                                    {e.name}
                                                                                </td>
                                                                                <td>
                                                                                    {e.company}
                                                                                </td>
                                                                                <td>
                                                                                    {moment(e.from_date).format('DD-MM-YYYY')}
                                                                                </td>
                                                                                <td>
                                                                                    {e.to_date ? moment(e.to_date).format('DD-MM-YYYY') : '-' }
                                                                                </td>
                                                                                <td>
                                                                                    <ButtonGroup>
                                                                                        <Button
                                                                                            title='Actualizar Trabajador'
                                                                                            className='btn btn-link'
                                                                                            onClick={
                                                                                                () => this.handleChange(
                                                                                                    prevState => ({
                                                                                                        ...prevState,
                                                                                                        editWorker: {
                                                                                                            _id: e._id,
                                                                                                            name: e.name,
                                                                                                            rut: e.rut,
                                                                                                            company: e.company,
                                                                                                            from_date: new Date(e.from_date),
                                                                                                            to_date: e.to_date ? new Date(e.to_date) : '',
                                                                                                        },
                                                                                                        modalEdit: !prevState.modalEdit,
                                                                                                    })
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <FontAwesomeIcon className='text-warning' size='lg' icon='edit' />
                                                                                        </Button>
                                                                                        {/* <Button className='btn btn-link'>
                                                                                            <FontAwesomeIcon className='text-danger' size='lg' icon='trash-alt' />
                                                                                        </Button> */}
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
                                        Actualizar Trabajador
                                    </ModalHeader>
                                    <ModalBody>
                                        <Form>
                                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                <Label for='workerNameEdit' className='mb-0'>
                                                    Nombre
                                                </Label>
                                                <Input
                                                    required
                                                    value={editWorker.name}
                                                    className='mb-2'
                                                    type='text'
                                                    name='workerNameEdit'
                                                    id='workerNameEdit'
                                                    placeholder='Nombre del Trabajador'
                                                    onChange={
                                                        ({ target }) => this.handleChange(
                                                            prevState => ({
                                                                editWorker: {
                                                                    ...prevState.editWorker,
                                                                    name: target.value,
                                                                },
                                                            })
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                <Label for='workerRutEdit' className='mb-0'>
                                                    Rut
                                                </Label>
                                                <Input
                                                    value={editWorker.rut}
                                                    className='mb-2'
                                                    type='text'
                                                    name='workerRutEdit'
                                                    id='workerRutEdit'
                                                    placeholder='Rut del Trabajador'
                                                    disabled
                                                />
                                            </FormGroup>
                                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                <Label for='workerCompanyEdit' className='mb-0'>
                                                    Empresa
                                                </Label>
                                                <Input
                                                    value={editWorker.company}
                                                    className='mb-2'
                                                    type='text'
                                                    name='workerCompanyEdit'
                                                    id='workerCompanyEdit'
                                                    placeholder='Empresa'
                                                    disabled
                                                />
                                            </FormGroup>
                                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0 full-date-input'>
                                                <Label for='workerFromDateEdit' className='mb-0'>
                                                    Desde
                                                </Label>
                                                <br />
                                                <DatePicker
                                                    required
                                                    maxDate={ editWorker.to_date ? new Date(editWorker.to_date) : null }
                                                    name='workerFromDateEdit'
                                                    id='workerFromDateEdit'
                                                    placeholderText='Desde'
                                                    selected={editWorker.from_date}
                                                    className='form-control mb-2'
                                                    dateFormat='dd-MM-yyyy'
                                                    onChange={
                                                        date => this.handleChange(
                                                            prevState => ({
                                                                editWorker: {
                                                                    ...prevState.editWorker,
                                                                    from_date: date,
                                                                },
                                                            })
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0 full-date-input'>
                                                <Label for='workerToDateEdit' className='mb-0'>
                                                    Hasta
                                                </Label>
                                                <br />
                                                <DatePicker
                                                    required
                                                    minDate={ editWorker.from_date ? new Date(editWorker.from_date) : null }
                                                    name='workerToDateEdit'
                                                    id='workerToDateEdit'
                                                    placeholderText='Fecha de término del trabajador'
                                                    selected={editWorker.to_date}
                                                    className='form-control mb-2'
                                                    dateFormat='dd-MM-yyyy'
                                                    onChange={
                                                        date => this.handleChange(
                                                            prevState => ({
                                                                editWorker: {
                                                                    ...prevState.editWorker,
                                                                    to_date: date,
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
                                            onClick={this.handleUpdate}
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
                            </>
                        :
                            loadingWorkers ? <Spinner color='info' /> : null
                    }
                </div>
            </>
        );
    };
};

export default withCookies(withApollo(Workers));