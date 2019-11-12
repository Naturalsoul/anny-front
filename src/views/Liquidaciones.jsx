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
    Spinner,
    Col,
    Row
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withCookies } from 'react-cookie';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { GETCOMPANIES } from '../graphql/company';
import { GETWORKERS } from '../graphql/worker';
import Alerts from 'components/Alerts/Alerts';

class Liquidaciones extends React.PureComponent {
    state = {
        companiesList: [],
        workersList: [],
        filteredCompany: '',
        filteredWorker: '',
        loadingWorkers: false,
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

    constructor(props) {
        super(props);

        const { cookies } = props;

        this.state = { ...this.state, token: cookies.get('token') || '',  };

        this.handleGetWorkers = this.handleGetWorkers.bind(this);
        this.handleGetLiquidaciones = this.handleGetLiquidaciones.bind(this);
    };

    async componentWillMount() {
        const { client } = this.props;
        const { token } = this.state;

        const { data: { getCompanies }, errors } = await client.query({
            query: GETCOMPANIES,
            variables: { token },
            errorPolicy: 'all',
        });

        if (errors) Alerts({ type: 'error', title: 'Error al obtener el listado de empresas', error: errors[0].message, });
        else this.setState({ companiesList: [ ...getCompanies ], });

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

    async handleGetWorkers(filteredCompany) {
        const { client } = this.props;
        const { token } = this.state;

        if (!filteredCompany) this.setState({ filteredCompany: '' });
        else {
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
                        loadingWorkers: false,
                    })
                );
            }
        }
    };

    handleGetLiquidaciones({ value }) {
        console.log('handleGetLiquidaciones', value);
    }

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
        const {
            nav,
            liq,
            filteredCompany,
            filteredWorker, 
            workersList,
            companiesList,
            loadingWorkers,
            token
        } = this.state;
        const month = nav.findIndex(e => e);

        if (!token) return <Redirect to={{ pathname: '/login', state: { token } }} />;

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
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0 col-sm-4'>
                                            <Label for='company' className='mr-sm-2' hidden>
                                                Seleccione una Empresa
                                            </Label>
                                            <Select
                                                autoFocus
                                                isClearable
                                                components={makeAnimated()}
                                                value={filteredCompany}
                                                placeholder='Seleccione una Empresa...'
                                                className='col-sm-12'
                                                options={
                                                    companiesList.map(
                                                        e => ({ value: e._id, label: `${e.name} - ${e.rut}`, })
                                                    )
                                                }
                                                onChange={this.handleGetWorkers}
                                            />
                                        </FormGroup>
                                        <FormGroup className='mb-2 mr-sm-2 mb-sm-0 col-sm-4'>
                                            {
                                                loadingWorkers ?
                                                    <Spinner color='info' />
                                                :
                                                    <>
                                                        <Label for='worker' className='mr-sm-2' hidden>
                                                            Seleccione un Trabajador
                                                        </Label>
                                                        <Select
                                                            isClearable
                                                            isDisabled={!workersList.length}
                                                            components={makeAnimated()}
                                                            value={filteredWorker}
                                                            placeholder='Seleccione un Trabajador...'
                                                            className='col-sm-12'
                                                            options={
                                                                workersList.map(
                                                                    e => ({ value: e._id, label: `${e.rut} - ${e.name}` })
                                                                )
                                                            }
                                                            onChange={this.handleGetLiquidaciones}
                                                        />
                                                    </>
                                            }
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

export default withCookies(withApollo(Liquidaciones));