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
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

class Workers extends React.PureComponent {
    state = {
        token: '',
        addWorker: {
            company: '',
            name: '',
            rut: '',
            date_from: new Date(),
        },
    };

    constructor(props) {
        super(props);

        this.state = { ...this.state, token: props.token, };
    };

    handleChange(e) {
        this.setState(e);
    };

    render() {
        const {
            addWorker,
        } = this.state;

        console.log('addWorker', addWorker)

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
                                    <Form inline>
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
                                                <option value='11.111.111-1'>Empresa de Prueba - 11.111.111-1</option>
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
                                                selected={addWorker.date_from}
                                                className='form-control'
                                                dateFormat='dd-MM-yyyy'
                                                onChange={
                                                    date => {console.log(date);this.setState(
                                                        prevState => ({
                                                            addWorker: {
                                                                ...prevState.addWorker,
                                                                date_from: date,
                                                            },
                                                        })
                                                    )}
                                                }
                                            />
                                            <Label for='workerFromDate' className='ml-sm-2'>
                                                Desde
                                            </Label>
                                        </FormGroup>
                                        <Button color='success'>Registrar Trabajador</Button>
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
                                                        value=''
                                                    >
                                                        <option value='' disabled>Seleccione una Empresa</option>
                                                        <option value='11.111.111-1'>Empresa de Prueba - 11.111.111-1</option>
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
                                                    <tr>
                                                        <td>
                                                            16.257.368-8
                                                        </td>
                                                        <td>
                                                            Trabajador de Prueba
                                                        </td>
                                                        <td>
                                                            Empresa de Prueba - 11.111.111-1
                                                        </td>
                                                        <td>
                                                            { new Date().toLocaleDateString() }
                                                        </td>
                                                        <td>
                                                            -
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

export default Workers;