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
    Nav,
    NavItem,
    NavLink,
    TabContent,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Col,
    Row
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Liquidaciones extends React.PureComponent {
    state = {
        nav: [true, false, false, false, false, false, false, false, false, false, false, false],
        liq: {
            0: {
                detailsRemu: [
                    {
                        detail: 'Sueldo Base',
                        value: 250000,
                    },
                ],
                descPrev: [
                    {
                        detail: 'AFP 11.45% Provida',
                        value: 77285,
                    },
                ],
                totalRemu: [
                    {
                        detail: 'Viático',
                        value: 80000,
                    },
                ],
                totalDesc: [
                    {
                        detail: 'Alcance Líquido',
                        value: 0,
                        disable: true,
                    },
                    {
                        detail: 'Anticipos',
                        value: 0,
                        disable: false,
                    },
                    {
                        detail: 'Saldo Líquido',
                        value: 0,
                        disable: true,
                    }, 
                ],
            }
        },
    };

    componentWillMount() {
        for (let i = 0; i < 12; i++) {
            this.setState(
                prevState => ({
                    liq: {
                        ...prevState.liq,
                        [i]: {
                            detailsRemu: [
                                {
                                    detail: 'Sueldo Base',
                                    value: 250000 + i,
                                },
                            ],
                            descPrev: [
                                {
                                    detail: 'AFP 11.45% Provida',
                                    value: 77285 + i,
                                },
                            ],
                            totalRemu: [
                                {
                                    detail: 'Viático',
                                    value: 80000 + i,
                                },
                            ],
                            totalDesc: [
                                {
                                    detail: 'Alcance Líquido',
                                    value: 0 + i,
                                    disable: true,
                                },
                                {
                                    detail: 'Anticipos',
                                    value: 0 + i,
                                    disable: false,
                                },
                                {
                                    detail: 'Saldo Líquido',
                                    value: 0 + i,
                                    disable: true,
                                },
                            ],
                        },
                    },
                })
            );
        };
    };

    toggle(index) {
        this.setState(
            prevState => ({
                nav: prevState.nav.map(
                    (e, i) => {
                        if (i === index) return true;
                        else return false;
                    }
                )
            })
        );
    };

    addItem(field, month) {
        this.setState(
            prevState => ({
                liq: {
                    ...prevState.liq,
                    [month]: {
                        ...prevState.liq[month],
                        [field]: [
                            ...prevState.liq[month][field],
                            {
                                detail: '',
                                value: 0,
                            },
                        ],
                    },
                },
            })
        );
    };

    render() {
        const { nav, liq } = this.state;
        const month = nav.findIndex(e => e);

        return (
            <>
                <div className='content'>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <b>Cargar Liquidaciones</b>
                                </CardHeader>
                                <CardBody>
                                    <Form inline>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                            <Label for='worker' className='mr-sm-2' hidden>
                                                Seleccione un Trabajador
                                            </Label>
                                            <Input type='select' name='company' id='company' placeholder='Seleccione un Trabajador'>
                                                <option value='' disabled selected>Seleccione un Trabajador</option>
                                                <option value='11.111.111-1'>Trabajador de Prueba - 16.257.369-8</option>
                                            </Input>
                                        </FormGroup>
                                        <Button color='info'>Cargar Liquidaciones <FontAwesomeIcon icon='search'/></Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <b>Liquidaciones</b>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Nav tabs>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[0]} onClick={() => this.toggle(0)}>
                                                        En
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[1]} onClick={() => this.toggle(1)}>
                                                        Feb
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[2]} onClick={() => this.toggle(2)}>
                                                        Mar
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[3]} onClick={() => this.toggle(3)}>
                                                        Abr
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[4]} onClick={() => this.toggle(4)}>
                                                        May
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[5]} onClick={() => this.toggle(5)}>
                                                        Jun
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[6]} onClick={() => this.toggle(6)}>
                                                        Jul
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[7]} onClick={() => this.toggle(7)}>
                                                        Ago
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[8]} onClick={() => this.toggle(8)}>
                                                        Sept
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[9]} onClick={() => this.toggle(9)}>
                                                        Oct
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[10]} onClick={() => this.toggle(10)}>
                                                        Nov
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href='#' active={nav[11]} onClick={() => this.toggle(11)}>
                                                        Dic
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col>
                                            <TabContent className='px-2'>
                                                <Row>
                                                    <Col>
                                                        <Button color='success' className='float-right'>
                                                            Guardar <FontAwesomeIcon icon='save' />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm='12' md='6'>
                                                        <Card>
                                                            <CardHeader>
                                                                <b>Detalle de Remuneración</b>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col>
                                                                        <Button
                                                                            className='float-right'
                                                                            color='info'
                                                                            onClick={() => this.addItem('detailsRemu', month)}
                                                                            title='Añadir Ítem'
                                                                        >
                                                                            <FontAwesomeIcon icon='plus' />
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm='12'>
                                                                        <Form inline>
                                                                            {
                                                                                Object.keys(liq).map(
                                                                                    x => (
                                                                                        +x === month ? liq[x].detailsRemu.map(
                                                                                            e => (
                                                                                                <Row key={x}>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Detalle
                                                                                                            </Label>
                                                                                                            <Input type='text' placeholder='Detalle' value={e.detail} />
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Valor
                                                                                                            </Label>
                                                                                                            <InputGroup>
                                                                                                                <InputGroupAddon addontType='prepend'>
                                                                                                                    <InputGroupText>$</InputGroupText>
                                                                                                                </InputGroupAddon>
                                                                                                                <Input type='number' placeholder='Valor' value={e.value} />
                                                                                                            </InputGroup>                                                                                                            
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            )
                                                                                        ) : null
                                                                                    )
                                                                                )
                                                                            }
                                                                        </Form>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm='12' md={{ offset: 6, size: 6 }}>
                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                            <b>
                                                                                SubTotal: $ {
                                                                                    Object.keys(liq).map(
                                                                                        x => (
                                                                                            +x === month ? liq[x].detailsRemu.map(e => e.value).reduce(
                                                                                                (sum, current) => sum + current
                                                                                            ) : null
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </b>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col sm='12' md='6'>
                                                        <Card>
                                                            <CardHeader>
                                                                <b>Descuentos Previsionales</b>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col>
                                                                        <Button
                                                                            className='float-right'
                                                                            color='info'
                                                                            onClick={() => this.addItem('descPrev', month)}
                                                                            title='Añadir Ítem'
                                                                        >
                                                                            <FontAwesomeIcon icon='plus' />
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <Form inline>
                                                                            {
                                                                                Object.keys(liq).map(
                                                                                    x => (
                                                                                        +x === month ? liq[x].descPrev.map(
                                                                                            e => (
                                                                                                <Row key={x}>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Detalle
                                                                                                            </Label>
                                                                                                            <Input type='text' placeholder='Detalle' value={e.detail} />
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Valor
                                                                                                            </Label>
                                                                                                            <InputGroup>
                                                                                                                <InputGroupAddon addontType='prepend'>
                                                                                                                    <InputGroupText>$</InputGroupText>
                                                                                                                </InputGroupAddon>
                                                                                                                <Input type='number' placeholder='Valor' value={e.value} />
                                                                                                            </InputGroup>
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            )
                                                                                        ) : null
                                                                                    )
                                                                                )
                                                                            }
                                                                        </Form>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm='12' md={{ offset: 6, size: 6 }}>
                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                            <b>
                                                                                SubTotal: $ {
                                                                                    Object.keys(liq).map(
                                                                                        x => (
                                                                                            +x === month ? liq[x].descPrev.map(e => e.value).reduce(
                                                                                                (sum, current) => sum + current
                                                                                            ) : null
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </b>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm='12' md='6'>
                                                        <Card>
                                                            <CardHeader>
                                                                <b>Total Remuneración Imponible</b>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col>
                                                                        <Button
                                                                            className='float-right'
                                                                            color='info'
                                                                            onClick={() => this.addItem('totalRemu', month)}
                                                                            title='Añadir Ítem'
                                                                        >
                                                                            <FontAwesomeIcon icon='plus' />
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <Form inline>
                                                                            {
                                                                                Object.keys(liq).map(
                                                                                    x => (
                                                                                        +x === month ? liq[x].totalRemu.map(
                                                                                            e => (
                                                                                                <Row key={x}>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Detalle
                                                                                                            </Label>
                                                                                                            <Input type='text' placeholder='Detalle' value={e.detail} />
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Valor
                                                                                                            </Label>
                                                                                                            <InputGroup>
                                                                                                                <InputGroupAddon addontType='prepend'>
                                                                                                                    <InputGroupText>$</InputGroupText>
                                                                                                                </InputGroupAddon>
                                                                                                                <Input type='number' placeholder='Valor' value={e.value} />
                                                                                                            </InputGroup>
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            )
                                                                                        ) : null
                                                                                    )
                                                                                )
                                                                            }
                                                                        </Form>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm='12' md={{ offset: 6, size: 6 }}>
                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                            <b>
                                                                                SubTotal: $ {
                                                                                    Object.keys(liq).map(
                                                                                        x => (
                                                                                            +x === month ? liq[x].totalRemu.map(e => e.value).reduce(
                                                                                                (sum, current) => sum + current
                                                                                            ) : null
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </b>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col sm='12' md='6'>
                                                        <Card>
                                                            <CardHeader>
                                                                <b>Total Descuentos</b>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col>
                                                                        <Button
                                                                            className='float-right'
                                                                            color='info'
                                                                            onClick={() => this.addItem('totalDesc', month)}
                                                                            title='Añadir Ítem'
                                                                        >
                                                                            <FontAwesomeIcon icon='plus' />
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <Form inline>
                                                                            {
                                                                                Object.keys(liq).map(
                                                                                    x => (
                                                                                        +x === month ? liq[x].totalDesc.map(
                                                                                            e => (
                                                                                                <Row key={x}>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Detalle
                                                                                                            </Label>
                                                                                                            <Input
                                                                                                                type='text'
                                                                                                                placeholder='Detalle'
                                                                                                                value={e.detail}
                                                                                                                disabled={e.disable}
                                                                                                            />
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                                                            <Label for='' className='mr-sm-2' hidden>
                                                                                                                Valor
                                                                                                            </Label>
                                                                                                            <InputGroup>
                                                                                                                <InputGroupAddon addontType='prepend'>
                                                                                                                    <InputGroupText>$</InputGroupText>
                                                                                                                </InputGroupAddon>
                                                                                                                <Input
                                                                                                                    type='number'
                                                                                                                    placeholder='Valor'
                                                                                                                    value={e.value}
                                                                                                                />
                                                                                                            </InputGroup>
                                                                                                        </FormGroup>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            )
                                                                                        ) : null
                                                                                    )
                                                                                )
                                                                            }
                                                                        </Form>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm='12' md={{ offset: 6, size: 6 }}>
                                                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                                                                            <b>
                                                                                SubTotal: $ {
                                                                                    Object.keys(liq).map(
                                                                                        x => (
                                                                                            +x === month ? liq[x].totalDesc.map(e => e.value).reduce(
                                                                                                (sum, current) => sum + current
                                                                                            ) : null
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </b>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </TabContent>
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

export default Liquidaciones;