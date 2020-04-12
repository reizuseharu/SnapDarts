/* eslint-disable */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
// creates a beautiful scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import routes from '../routes';

import dashboardStyle from '../assets/jss/material-dashboard-react/layouts/dashboardStyle';

import image from 'assets/img/sidebar-2.jpg';
import DartsAppHeader from "../views/DartsApp/DartsAppHeader";

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
    })}
  </Switch>
);

interface Props {
  classes: any;
  location: any;
  history: any;
}

interface State {
  image: string;
  color: string;
  hasImage: boolean;
  fixedClasses: string;
  mobileOpen: boolean;
}

class Darts extends React.Component<Props, State> {
  refs: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      image: image,
      color: 'blue',
      hasImage: true,
      fixedClasses: 'dropdown show',
      mobileOpen: false
    };
  }
  
  handleImageClick = (i: string) => {
    this.setState({ image: i });
  };

  handleColorClick = (c: string) => {
    this.setState({ color: c });
  };

  handleFixedClick = () => {
    if (this.state.fixedClasses === 'dropdown') {
      this.setState({ fixedClasses: 'dropdown show' });
    } else {
      this.setState({ fixedClasses: 'dropdown' });
    }
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute() {
    return this.props.location.pathname !== '/darts';
  }

  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener('resize', this.resizeFunction);
  }

  componentDidUpdate(e: any) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction);
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      // @ts-ignore
      <DartsAppHeader location={this.props.location} history={this.props.history}/>
    );
  }
}

export default withStyles(dashboardStyle)(Darts);
