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
    Col,
    Row
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Liquidaciones extends React.PureComponent {
    render() {
        return (
            <>
                <div className='content'>
                    <Row>
                        <Col>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink href='#' active>
                                        Enero
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Febrero
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Marzo
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Abril
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Mayo
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Junio
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Julio
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Agosto
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Septiembre
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Octubre
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Noviembre
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='#'>
                                        Diciembre
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                </div>
            </>
        );
    };
};

export default Liquidaciones;