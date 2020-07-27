import React from 'react'
// @material-ui/core
import queryString from 'query-string'

import MenuItem from "@material-ui/core/MenuItem"
import {
  Button,
  FormControl, Grid,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core"
import {generateMatch, Goal, Match, MatchType, parseStage, Pokemon, Stage} from "@services/seedGenerator"

interface Props {
  location: any
  history: any
}

interface State {
  matchType: MatchType
  seed: string
  goals: Goal[]
  currentSeed: string
  currentMatchType: MatchType
  currentScore: number
  pokemonScore: Map<Goal, number>,
  selectedStages: Map<Stage, Pokemon[]>,
  hasLoaded: boolean
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const values = queryString.parse(this.props.location.search)
    const randomSeed: string = `${Math.floor(Math.random() * 999999) + 1}`
    const seed: string = values.seed !== undefined && values.seed !== null ? values.seed as string : randomSeed
    // @ts-ignore
    const matchType: MatchType = values.matchType !== undefined && values.matchType !== null ? MatchType[values.matchType as string] : MatchType.FREE_FOR_ALL

    this.state = {
      matchType,
      seed,
      goals: [],
      currentSeed: seed,
      currentMatchType: matchType,
      currentScore: 0,
      pokemonScore: new Map(),
      selectedStages: new Map(),
      hasLoaded: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (event: any, matchType: MatchType, seed: string, goals: Goal[], currentScore: number, pokemonScore: Map<Goal, number>, selectedStages: Map<Stage, Pokemon[]>, hasLoaded: boolean) => {
    this.setState({
      matchType,
      seed,
      goals,
      currentSeed: seed,
      currentMatchType: matchType,
      currentScore,
      pokemonScore,
      selectedStages,
      hasLoaded
    })
  }

  handleGameGenerate = async () => {
    this.state.pokemonScore.clear()
    const match: Match = await generateMatch(this.state.selectedStages, this.state.seed, this.state.matchType)
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
    })
    this.props.history.push({
      pathname: '',
      search: `?seed=${this.state.currentSeed}&matchType=${MatchType[this.state.matchType]}`
    })
  }

  handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const seed: string = event.target.value as string
    this.setState({
      matchType: this.state.matchType,
      seed,
      goals: this.state.goals,
      currentSeed: this.state.currentSeed,
      currentMatchType: this.state.currentMatchType,
      currentScore: this.state.currentScore,
      pokemonScore: this.state.pokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    })
  }

  handleDropdownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const matchTypeValue: string = event.target.value as string
    const matchType: MatchType = MatchType[matchTypeValue as keyof typeof MatchType]
    this.setState({
      matchType,
      seed: this.state.seed,
      goals: this.state.goals,
      currentSeed: this.state.currentSeed,
      currentMatchType: this.state.currentMatchType,
      currentScore: this.state.currentScore,
      pokemonScore: this.state.pokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    })
  }

  handleScoreChange = (event: React.ChangeEvent<{ value: unknown }>, goal: Goal) => {
    const specificPokemonScore = event.target.value as number
    const newPokemonScore: Map<Goal, number> = this.state.pokemonScore
    newPokemonScore.set(goal, specificPokemonScore)
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
    })
  }

  handleScoreCalculation = () => {
    // ! Create score calculation
    let currentScore = 0
    this.state.pokemonScore.forEach((specificScore: number, specificGoal: Goal) => {
      currentScore += Math.floor(Math.abs(specificGoal.pokemon.points - Math.abs(specificGoal.score - specificScore)) / 100)
    })
    this.setState({
      matchType: this.state.matchType,
      seed: this.state.seed,
      goals: this.state.goals,
      currentSeed: this.state.currentSeed,
      currentMatchType: this.state.currentMatchType,
      currentScore,
      pokemonScore: this.state.pokemonScore,
      selectedStages: this.state.selectedStages,
      hasLoaded: this.state.hasLoaded
    })
  }

  onKeyPressGenerateGame(e: { key: string }) {
    if (e.key === "Enter") {
      this.handleGameGenerate()
    }
  }

  onChangeCalculateScore(e: React.ChangeEvent<{ value: unknown }>, goal: Goal) {
    this.handleScoreChange(e, goal)
  }

  async componentWillMount() {
    if (!this.state.hasLoaded) {
      const selectedStages: Map<Stage, Pokemon[]> = new Map()
      const stages: Stage[] = [Stage.BEACH, Stage.TUNNEL, Stage.VOLCANO, Stage.RIVER, Stage.CAVE, Stage.VALLEY, Stage.RAINBOW_CLOUD]
      for (const stage of stages) {
        selectedStages.set(stage, await parseStage(stage))
      }


      this.setState({
        matchType: this.state.matchType,
        seed: this.state.seed,
        goals: this.state.goals,
        currentSeed: this.state.currentSeed,
        currentMatchType: this.state.currentMatchType,
        currentScore: this.state.currentScore,
        pokemonScore: this.state.pokemonScore,
        selectedStages,
        hasLoaded: true
      })

      await this.handleGameGenerate()
    }
    return Promise.resolve()
  }

  render() {
    return (
      <div>
        <Grid container={true}>
          <Grid item={true} xs={6} sm={3} md={2}>
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
          </Grid>
          <Grid item={true} xs={4} sm={2} md={1}>
            <TextField
              id="standard-basic"
              label="Seed"
              value={this.state.seed}
              onChange={this.handleInputChange}
              onKeyPress={this.onKeyPressGenerateGame}
            />
          </Grid>
          <Grid item={true} xs={6} sm={4} md={2}>
            Current Mode:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}>{MatchType[this.state.currentMatchType]}</InputLabel>
          </Grid>
          <Grid item={true} xs={6} sm={4} md={2}>
            Current Seed:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}>{this.state.currentSeed}</InputLabel>
          </Grid>
          <Grid item={true} xs={3} sm={2} md={1}>
            <Button
              fullWidth={true}
              color="primary"
              onClick={this.handleGameGenerate}
              >
              Generate
            </Button>
          </Grid>
          <Grid item={true} xs={6} sm={4} md={2}>
            Current Score:<InputLabel id="demo-simple-select-label" style={{fontWeight: "bold"}}>{this.state.currentScore}</InputLabel>
          </Grid>
          <Grid item={true} xs={3} sm={2} md={1}>
            <Button
              fullWidth={true}
              color="secondary"
              onClick={this.handleScoreCalculation}
            >
              Calculate
            </Button>
          </Grid>
        </Grid>
        <Table size="small" aria-label="a dense table">
          <TableHead style={{backgroundColor: "#ADD8E6"}}>
            <TableCell align="center">Stage</TableCell>
            <TableCell align="center">Pokémon</TableCell>
            <TableCell align="center">Point Goal</TableCell>
            <TableCell align="center">Player Points</TableCell>
          </TableHead>
          <TableBody>
            {this.state.goals.map((goal: Goal, index: number) => {
              // tslint:disable-next-line:jsx-key
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
              </TableRow>
            })}
          </TableBody>

        </Table>
      </div>
    )
  }
}

export default Dashboard
