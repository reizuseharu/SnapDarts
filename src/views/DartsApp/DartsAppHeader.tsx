import React from 'react';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Table from '../../components/Table/Table';

import dashboardStyle from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import MenuItem from "@material-ui/core/MenuItem";
import Button from "../../components/CustomButtons/Button";
import {FormControl, InputLabel, Select, TextField} from "@material-ui/core";
import {generateMatch, Goal, Match, MatchType, Stage} from "./seedGenerator";

interface Props {
  classes: any;
}

interface State {
  matchType: MatchType;
  seed: string;
  goals: Goal[];
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      matchType: MatchType.FREE_FOR_ALL,
      seed: "Snap",
      goals: []
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (event: any, matchType: MatchType, seed: string, goals: Goal[]) => {
    this.setState({ matchType: matchType, seed: seed, goals: goals });
  };

  handleButtonClick = (event: any) => {
    let match: Match = generateMatch(this.state.seed, this.state.matchType);
    this.setState({ matchType: this.state.matchType, seed: this.state.seed, goals: match.goals });
  };

  handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let seed: string = event.target.value as string;
    this.setState({ matchType: this.state.matchType, seed: seed, goals: this.state.goals });
  };

  handleDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let matchTypeValue: string = event.target.value as string;
    let matchType: MatchType = MatchType[matchTypeValue as keyof typeof MatchType];
    this.setState({ matchType: matchType, seed: this.state.seed, goals: this.state.goals });
  };

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={4}>
            <FormControl
              fullWidth={true}
            >
              <InputLabel id="demo-simple-select-label">Game Mode</InputLabel>
              <Select
                id="demo-simple-select"
                value={MatchType[this.state.matchType]}
                onChange={this.handleDropdownChange}
              >
                <MenuItem value={MatchType[MatchType.STAGE]}>Stage</MenuItem>
                <MenuItem value={MatchType[MatchType.FREE_FOR_ALL]}>Free For All</MenuItem>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <TextField
              id="standard-basic"
              label="Seed"
              value={this.state.seed}
              onChange={this.handleInputChange}/>
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Button
              fullWidth={true}
              color="primary"
              onClick={this.handleButtonClick}
              >
              Generate
            </Button>
          </GridItem>
        </GridContainer>
        <Table
          tableHeaderColor="warning"
          tableHead={["Stage", "Pokémon", "Score"]}
          tableData={this.state.goals.map(function (goal: Goal) { return [Stage[goal.stage], goal.pokemon.name, goal.score]; })}
        />
      </div>
    );
  }
}

// Dashboard.propTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withStyles(dashboardStyle)(Dashboard);
