import React from 'react';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';

import dashboardStyle from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import MenuItem from "@material-ui/core/MenuItem";
import Button from "../../components/CustomButtons/Button";
import {
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import {generateMatch, Goal, Match, MatchType, Stage} from "./seedGenerator";

interface Props {
  classes: any;
}

interface State {
  matchType: MatchType;
  seed: string;
  goals: Goal[];
  currentSeed: string;
  currentMatchType: MatchType;
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      matchType: MatchType.FREE_FOR_ALL,
      seed: "Snap",
      goals: [],
      currentSeed: "",
      currentMatchType: MatchType.FREE_FOR_ALL
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (event: any, matchType: MatchType, seed: string, goals: Goal[]) => {
    this.setState({ matchType: matchType, seed: seed, goals: goals, currentSeed: seed, currentMatchType: matchType });
  };

  handleButtonClick = (event: any) => {
    let match: Match = generateMatch(this.state.seed, this.state.matchType);
    this.setState({ matchType: this.state.matchType, seed: this.state.seed, goals: match.goals, currentSeed: this.state.seed, currentMatchType: this.state.matchType });
  };

  handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let seed: string = event.target.value as string;
    this.setState({ matchType: this.state.matchType, seed: seed, goals: this.state.goals, currentSeed: this.state.currentSeed, currentMatchType: this.state.currentMatchType});
  };

  handleDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let matchTypeValue: string = event.target.value as string;
    let matchType: MatchType = MatchType[matchTypeValue as keyof typeof MatchType];
    this.setState({ matchType: matchType, seed: this.state.seed, goals: this.state.goals, currentSeed: this.state.currentSeed, currentMatchType: this.state.currentMatchType});
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
          <GridItem xs={4} sm={2} md={1}>
            <TextField
              id="standard-basic"
              label="Seed"
              value={this.state.seed}
              onChange={this.handleInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.handleButtonClick(e)
                }
              }}
            />
          </GridItem>
          <GridItem xs={6} sm={4} md={2}>
            Current Mode:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}>{MatchType[this.state.currentMatchType]}</InputLabel>
          </GridItem>
          <GridItem xs={6} sm={4} md={2}>
            Current Seed:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}> {this.state.currentSeed}</InputLabel>
          </GridItem>
          <GridItem xs={12} sm={6} md={2}>
            <Button
              fullWidth={false}
              color="primary"
              onClick={this.handleButtonClick}
              >
              Generate
            </Button>
          </GridItem>
        </GridContainer>
        <Table>
          <TableHead style={{backgroundColor: "green"}}>
            <TableCell align="right">Stage</TableCell>
            <TableCell align="center">Pokémon</TableCell>
            <TableCell align="left">Score</TableCell>
          </TableHead>
          <TableBody>
            {this.state.goals.map((goal: Goal) => {
              return <TableRow hover={true}>
                <TableCell align="right">{Stage[goal.stage]}</TableCell>
                <TableCell align="center">{goal.pokemon.name}</TableCell>
                <TableCell align="left">{goal.score}</TableCell>
              </TableRow>;
            })}
          </TableBody>

        </Table>
      </div>
    );
  }
}

// Dashboard.propTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withStyles(dashboardStyle)(Dashboard);
