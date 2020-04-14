import React from 'react';
// @material-ui/core
import queryString from 'query-string';

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
import {generateMatch, Goal, Match, MatchType, parseStage, Pokemon, Stage} from "./seedGenerator";

interface Props {
  location: any;
  history: any;
}

interface State {
  matchType: MatchType;
  seed: string;
  goals: Goal[];
  currentSeed: string;
  currentMatchType: MatchType;
  currentScore: number;
  pokemonScore: Map<Goal, number>,
  selectedStages: Map<Stage, Pokemon[]>,
  hasLoaded: boolean
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const values = queryString.parse(this.props.location.search);
    const randomSeed: string = `${Math.floor(Math.random() * 999999) + 1}`;
    const seed: string = values.seed !== undefined && values.seed !== null ? values.seed as string : randomSeed;
    // @ts-ignore
    const matchType: MatchType = values.matchType !== undefined && values.matchType !== null ? MatchType[values.matchType as string] : MatchType.FREE_FOR_ALL;

    this.state = {
      matchType: matchType,
      seed: seed,
      goals: [],
      currentSeed: seed,
      currentMatchType: matchType,
      currentScore: 0,
      pokemonScore: new Map(),
      selectedStages: new Map(),
      hasLoaded: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event: any, matchType: MatchType, seed: string, goals: Goal[], currentScore: number, pokemonScore: Map<Goal, number>, selectedStages: Map<Stage, Pokemon[]>, hasLoaded: boolean) => {
    this.setState({
      matchType: matchType,
      seed: seed,
      goals: goals,
      currentSeed: seed,
      currentMatchType: matchType,
      currentScore: currentScore,
      pokemonScore: pokemonScore,
      selectedStages: selectedStages,
      hasLoaded: hasLoaded
    });
  };

  handleGameGenerate = async () => {
    this.state.pokemonScore.clear();
    let match: Match = await generateMatch(this.state.selectedStages, this.state.seed, this.state.matchType);
    this.setState({
      matchType: this.state.matchType,
      seed: "",
      goals: match.goals,
      currentSeed: this.state.seed,
      currentMatchType: this.state.matchType,
      currentScore: 0,
      pokemonScore: this.state.pokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    });
    this.props.history.push({
      pathname: '',
      search: `?seed=${this.state.currentSeed}&matchType=${MatchType[this.state.matchType]}`
    })
  };

  handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let seed: string = event.target.value as string;
    this.setState({
      matchType: this.state.matchType,
      seed: seed,
      goals: this.state.goals,
      currentSeed: this.state.currentSeed,
      currentMatchType: this.state.currentMatchType,
      currentScore: this.state.currentScore,
      pokemonScore: this.state.pokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    });
  };

  handleDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let matchTypeValue: string = event.target.value as string;
    let matchType: MatchType = MatchType[matchTypeValue as keyof typeof MatchType];
    this.setState({
      matchType: matchType,
      seed: this.state.seed,
      goals: this.state.goals,
      currentSeed: this.state.currentSeed,
      currentMatchType: this.state.currentMatchType,
      currentScore: this.state.currentScore,
      pokemonScore: this.state.pokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    });
  };

  handleScoreChange = (event: React.ChangeEvent<{ value: unknown }>, goal: Goal) => {
    let specificPokemonScore = event.target.value as number;
    let newPokemonScore: Map<Goal, number> = this.state.pokemonScore;
    newPokemonScore.set(goal, specificPokemonScore);
    this.setState({
      matchType: this.state.matchType,
      seed: this.state.seed,
      goals: this.state.goals,
      currentSeed: this.state.currentSeed,
      currentMatchType: this.state.currentMatchType,
      currentScore: this.state.currentScore,
      pokemonScore: newPokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    });
  };

  handleScoreCalculation = (event: React.ChangeEvent<{ value: unknown }>) => {
    // ! Create score calculation
    let currentScore = 0;
    this.state.pokemonScore.forEach((specificScore: number, specificGoal: Goal) => {
      currentScore += Math.floor(Math.abs(specificGoal.pokemon.points - Math.abs(specificGoal.score - specificScore)) / 100);
    });
    this.setState({
      matchType: this.state.matchType,
      seed: this.state.seed,
      goals: this.state.goals,
      currentSeed: this.state.currentSeed,
      currentMatchType: this.state.currentMatchType,
      currentScore: currentScore,
      pokemonScore: this.state.pokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    });
  };

  async componentWillMount() {
    if (!this.state.hasLoaded) {
      let selectedStages: Map<Stage, Pokemon[]> = new Map();
      let stages: Stage[] = [Stage.BEACH, Stage.TUNNEL, Stage.VOLCANO, Stage.RIVER, Stage.CAVE, Stage.VALLEY, Stage.RAINBOW_CLOUD];
      for (let stage of stages) {
        selectedStages.set(stage, await parseStage(stage));
      }


      this.setState({
        matchType: this.state.matchType,
        seed: this.state.seed,
        goals: this.state.goals,
        currentSeed: this.state.currentSeed,
        currentMatchType: this.state.currentMatchType,
        currentScore: this.state.currentScore,
        pokemonScore: this.state.pokemonScore,
        selectedStages: selectedStages,
        hasLoaded: true
      });

      await this.handleGameGenerate();
    }
    return Promise.resolve();
  }

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={6} sm={3} md={2}>
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
                  this.handleGameGenerate()
                }
              }}
            />
          </GridItem>
          <GridItem xs={6} sm={4} md={2}>
            Current Mode:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}>{MatchType[this.state.currentMatchType]}</InputLabel>
          </GridItem>
          <GridItem xs={6} sm={4} md={2}>
            Current Seed:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}>{this.state.currentSeed}</InputLabel>
          </GridItem>
          <GridItem xs={3} sm={2} md={1}>
            <Button
              fullWidth={true}
              color="success"
              onClick={this.handleGameGenerate}
              >
              Generate
            </Button>
          </GridItem>
          <GridItem xs={6} sm={4} md={2}>
            Current Score:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}>{this.state.currentScore}</InputLabel>
          </GridItem>
          <GridItem xs={3} sm={2} md={1}>
            <Button
              fullWidth={true}
              color="rose"
              onClick={this.handleScoreCalculation}
            >
              Calculate
            </Button>
          </GridItem>
        </GridContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead style={{backgroundColor: "#ADD8E6"}}>
            <TableCell align="center">Stage</TableCell>
            <TableCell align="center">Pokémon</TableCell>
            <TableCell align="center">Point Goal</TableCell>
            <TableCell align="center">Player Points</TableCell>
          </TableHead>
          <TableBody>
            {this.state.goals.map((goal: Goal, index: number) => {
              return <TableRow hover={true} style={(() => { if (index % 2 === 0) return {backgroundColor: "#FFCCCB"}})()}>
                <TableCell align="center">{Stage[goal.stage]}</TableCell>
                <TableCell align="center">{goal.pokemon.name}</TableCell>
                <TableCell align="center">{goal.score}</TableCell>
                <TableCell align="center">
                  <TextField
                    id="standard-basic"
                    type="number"
                    label={`${Stage[goal.stage]}-${goal.pokemon.name}`}
                    value={this.state.pokemonScore.get(goal)}
                    onChange={e => this.handleScoreChange(e, goal)}
                  />
                </TableCell>
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
