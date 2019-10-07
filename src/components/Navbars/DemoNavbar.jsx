/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  Button
} from "reactstrap";

import { withApollo } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import routes from "routes.js";
import { GoogleLogout } from "react-google-login";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: "transparent",
      //token: props.location.state.token,
      token: props.location.state ? props.location.state.token : 'dev', // dev value
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogoutError = this.handleLogoutError.bind(this);
    this.sidebarToggle = React.createRef();
  }
  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent"
      });
    } else {
      this.setState({
        color: "dark"
      });
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  getBrand() {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  updateColor() {
    if (window.innerWidth < 993 && this.state.isOpen) {
      this.setState({
        color: "dark"
      });
    } else {
      this.setState({
        color: "transparent"
      });
    }
  }

  handleLogout() {
    this.setState({
      token: null,
    });
  };

  handleLogoutError({ error }) {
    console.log('google logout error:', error);
    throw error;
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateColor.bind(this));
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      this.sidebarToggle.current.classList.toggle("toggled");
    }
  }
  render() {
    const { token } = this.state;

    return (
      // add or remove classes depending if we are on full-screen-maps page or not
      <>
        {
          token ?
            <Navbar
              color={
                this.props.location.pathname.indexOf("full-screen-maps") !== -1
                  ? "dark"
                  : this.state.color
              }
              expand="lg"
              className={
                this.props.location.pathname.indexOf("full-screen-maps") !== -1
                  ? "navbar-absolute fixed-top"
                  : "navbar-absolute fixed-top " +
                  (this.state.color === "transparent" ? "navbar-transparent " : "")
              }
            >
              <Container fluid>
                <div className="navbar-wrapper">
                  <div className="navbar-toggle">
                    <button
                      type="button"
                      ref={this.sidebarToggle}
                      className="navbar-toggler"
                      onClick={() => this.openSidebar()}
                    >
                      <span className="navbar-toggler-bar bar1" />
                      <span className="navbar-toggler-bar bar2" />
                      <span className="navbar-toggler-bar bar3" />
                    </button>
                  </div>
                  <NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
                </div>
                <NavbarToggler onClick={this.toggle}>
                  <span className="navbar-toggler-bar navbar-kebab" />
                  <span className="navbar-toggler-bar navbar-kebab" />
                  <span className="navbar-toggler-bar navbar-kebab" />
                </NavbarToggler>
                <Collapse
                  isOpen={this.state.isOpen}
                  navbar
                  className="justify-content-end"
                >
                  <form>
                    <InputGroup className="no-border">
                      <Input placeholder="Search..." />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="nc-icon nc-zoom-split" />
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </form>
                  <Nav navbar>
                    {/* <NavItem>
                <Link to="#" className="nav-link btn-magnify">
                  <i className="nc-icon nc-layout-11" />
                  <p>
                    <span className="d-lg-none d-md-block">Stats</span>
                  </p>
                </Link>
              </NavItem>
              <Dropdown
                nav
                isOpen={this.state.dropdownOpen}
                toggle={e => this.dropdownToggle(e)}
              >
                <DropdownToggle caret nav>
                  <i className="nc-icon nc-bell-55" />
                  <p>
                    <span className="d-lg-none d-md-block">Some Actions</span>
                  </p>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag="a">Action</DropdownItem>
                  <DropdownItem tag="a">Another Action</DropdownItem>
                  <DropdownItem tag="a">Something else here</DropdownItem>
                </DropdownMenu>
              </Dropdown> */}
                    {/* <NavItem>
                <Link to="#pablo" className="nav-link btn-rotate">
                  <i className="nc-icon nc-settings-gear-65" />
                  <p>
                    <span className="d-lg-none d-md-block">Account</span>
                  </p>
                </Link>
              </NavItem> */}
                    <Dropdown
                      nav
                      isOpen={this.state.dropdownOpen}
                      toggle={e => this.dropdownToggle(e)}
                    >
                      <DropdownToggle caret nav>
                        <FontAwesomeIcon icon='cog' size='lg' />
                        {/* <i className="nc-icon nc-bell-55" /> */}
                        <p>
                          <span className="d-lg-none d-md-block">{' '} Opciones</span>
                        </p>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <GoogleLogout
                          className="nav-link btn-magnify"
                          clientId='952083819906-s3sut4bghs9f1op2lq9u40tni2me4gca.apps.googleusercontent.com'
                          buttonText='Cerrar Sesión'
                          onLogoutSuccess={this.handleLogout}
                          onFailure={this.handleLogoutError}
                          render={
                            (props) => (
                              <>
                                <DropdownItem
                                  tag='a'
                                  style={{ cursor: 'pointer' }}
                                  onClick={props.onClick}
                                >
                                  <FontAwesomeIcon icon='sign-out-alt' size='lg' /> Cerrar Sesión
                                </DropdownItem>
                              </>
                            )
                          }
                        />
                      </DropdownMenu>
                    </Dropdown>
                  </Nav>
                </Collapse>
              </Container>
            </Navbar>
          :
            <Redirect to='/login' />
        }
      </>
    );
  }
}

export default withApollo(Header);
