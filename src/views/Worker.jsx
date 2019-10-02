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

class Workers extends React.PureComponent {
    render() {
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
                                            <Input type='select' name='company' id='company' placeholder='Seleccione una Empresa'>
                                                <option value='' disabled selected>Seleccione una Empresa</option>
                                                <option value='11.111.111-1'>Empresa de Prueba - 11.111.111-1</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='workerName' className='mr-sm-2' hidden>
                                                Nombre
                                            </Label>
                                            <Input type='text' name='workerName' id='workerName' placeholder='Nombre' />
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='workerRut' className='mr-sm-2' hidden>
                                                Rut
                                            </Label>
                                            <Input type='text' name='workerRut' id='workerRut' placeholder='Rut' />
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Input type='date' name='workerFromDate' id='workerFromDate' placeholder='Desde' />
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
                                                    <Input type='select' name='company2' id='company2' placeholder='Seleccione una Empresa'>
                                                        <option value='' disabled selected>Seleccione una Empresa</option>
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
                                            <Table hover>
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