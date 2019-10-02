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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Company extends React.PureComponent {
    state = {
        addCompany: {
            name: '',
            rut: '',
        },
        editCompany: {
            name: '',
            rut: '',
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
        modalDelete: false,
    };

    constructor(props) {
        super(props);

        this.state = { ...this.state };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    };

    handleChange(e) {
        this.setState(e);
    };

    handleSubmit(e) {
        e.preventDefault();

        const { companiesList } = this.state;
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
                            name: companyName.value,
                            rut: companyRut.value,
                        },
                    ],
                    filteredCompaniesList: [
                        ...prevState.companiesList,
                        {
                            name: companyName.value,
                            rut: companyRut.value,
                        },
                    ],
                    filterTable: '',
                    error: '',
                })
            );
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

    render() {
        const { addCompany, editCompany, filteredCompaniesList, filterTable, modalEdit, modalDelete, error } = this.state;

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
                                            <Table hover>
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
                                                            e => (
                                                                <tr key={e.rut}>
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
                                                                                                name: e.name,
                                                                                                rut: e.rut,
                                                                                            },
                                                                                            modalEdit: !prevState.modalEdit,
                                                                                        })
                                                                                    )
                                                                                }
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
                                                                                            () => this.handleChange(
                                                                                                prevState => ({
                                                                                                    ...prevState,
                                                                                                    companiesList: prevState.companiesList.map(
                                                                                                        e => {
                                                                                                            if (e.rut === editCompany.rut) {
                                                                                                                e.name = editCompany.name;
                                                                                                            }

                                                                                                            return e;
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
                                                                                            modalDelete: true,
                                                                                        })
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FontAwesomeIcon className='text-danger' size='lg' icon='trash-alt' />
                                                                            </Button>
                                                                            <Modal
                                                                                isOpen={modalDelete}
                                                                                toggle={
                                                                                    () => this.handleChange(
                                                                                        prevState => ({
                                                                                            modalDelete: !prevState.modalDelete,
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
                                                                                    Eliminar Empresa
                                                                                </ModalHeader>
                                                                                <ModalBody>
                                                                                    <Row>
                                                                                        <Col>
                                                                                            <p>
                                                                                                ¿Está seguro de <b className='text-danger'>ELIMINAR</b> esta empresa? Esto también <b>eliminará a todos los trabajadores asociados a esta empresa y el historial de trabajo</b>.
                                                                                            </p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </ModalBody>
                                                                                <ModalFooter>
                                                                                    <Button
                                                                                        color='danger'
                                                                                        onClick={
                                                                                            () => this.handleChange(
                                                                                                prevState => ({
                                                                                                    ...prevState,
                                                                                                    companiesList: prevState.companiesList.filter(x => x.rut !== e.rut),
                                                                                                    filteredCompaniesList: prevState.filteredCompaniesList.filter(x => x.rut !== e.rut),
                                                                                                    modalDelete: false,
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Eliminar
                                                                                    </Button> {' '}
                                                                                    <Button
                                                                                        color='link'
                                                                                        onClick={
                                                                                            () => this.handleChange(
                                                                                                prevState => ({
                                                                                                    modalDelete: !prevState.modalDelete,
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Cancelar
                                                                                    </Button>
                                                                                </ModalFooter>
                                                                            </Modal>
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

export default Company;