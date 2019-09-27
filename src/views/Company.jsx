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

class Company extends React.PureComponent {
    render() {
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
                                    <Form inline>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='companyName' className='mr-sm-2' hidden>
                                                Nombre
                                            </Label>
                                            <Input type='text' name='companyName' id='companyName' placeholder='Nombre de Empresa' />
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='companyRut' className='mr-sm-2' hidden>
                                                Rut
                                            </Label>
                                            <Input type='text' name='companyRut' id='companyRut' placeholder='Rut de Empresa' />
                                        </FormGroup>
                                        <Button color='success'>Registrar Empresa</Button>
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
                                        Listado de Empresas
                                    </b>
                                </CardHeader>
                                <CardBody>
                                    <Table hover >
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
                                            <tr>
                                                <td>
                                                    11.111.111-1
                                                </td>
                                                <td>
                                                    Empresa de Prueba
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