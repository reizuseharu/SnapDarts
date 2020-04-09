import * as fs from "fs";
import * as yaml from "js-yaml";


function clamp(num: number, min: number, max: number): number {
  return num <= min ? min : num >= max ? max : num;
}

function randomHex(): string {
  return (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0")
}

String.prototype.hashCode = function() {
  let hash: number = 0;

  // Convert to 32bit integer
  for (let i = 0; i < this.length; i++) {
      let character: number = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash = hash & hash
  }

  return hash
};

function convertSeedToHashCode(inputSeed: string | null): [number, string] {
  let STATIC_SALT: string = "Pokémon Snap";

  let hashCode: number;
  let seed: string;

  if (inputSeed !== null) {
    seed = inputSeed
  } else {
    seed = randomHex()
  }

  let unhashedSeed: string = `${seed}-${STATIC_SALT}`;
  hashCode = Math.abs(unhashedSeed.hashCode());

  return [hashCode, seed]
}

function parseStage(stage: Stage): Pokemon[] {
  let stageFile: string = `${Stage[stage].toLowerCase().replace("_", "-")}.yml`;
  let stagePath: string = `data/${stageFile}`;

  let stagePokemon: Pokemon[] = yaml.safeLoad(fs.readFileSync(stagePath, "utf8"));

  return stagePokemon;
}

export enum MatchType {
  STAGE,
  FREE_FOR_ALL
}

export interface Match {
  seed: string;
  type: MatchType;
  goals: Goal[];
}

export enum Stage {
  BEACH,
  TUNNEL,
  VOLCANO,
  RIVER,
  CAVE,
  VALLEY,
  RAINBOW_CLOUD
}

export interface Pokemon {
  name: string;
  points: number;
}

export interface Goal {
  stage: Stage;
  pokemon: Pokemon;
  score: number;
}

function seededEnum<T>(anEnum: T, hashCode: number): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];

  const seededIndex = hashCode % enumValues.length;
  const seededEnumValue = enumValues[seededIndex];

  return seededEnumValue
}

// ! Look into caching method
export function generateMatch(inputSeed: string | null, inputMatchType: MatchType | null): Match {
  let [hashCode, seed]: [number, string] = convertSeedToHashCode(inputSeed);

  // Each stage has a unique min and max value

  let matchType: MatchType
  if (inputMatchType !== null) {
    matchType = inputMatchType
  } else {
    matchType = seededEnum(MatchType, hashCode)
  }

  let goals: Goal[] = [];
  let selectedPokemon: Set<Pokemon> = new Set();
  let selectedStages: Map<Stage, Pokemon[]> = new Map();

  let pokemonAmount = clamp(hashCode % 11, 3, 7);

  if (matchType === MatchType.FREE_FOR_ALL) {

    while (pokemonAmount > 0) {
      // ? Need some way to prevent one Pokémon from each stage instead of possible dupes
      let stage: Stage = seededEnum(Stage, hashCode + hashCode ** pokemonAmount);

      let stagePokemon: Pokemon[];
      if (!selectedStages.has(stage)) {
        stagePokemon = parseStage(stage);
        selectedStages.set(stage, stagePokemon);
      } else {
        let stgPkmn: Pokemon[] | undefined = selectedStages.get(stage);
        if (stgPkmn === undefined) {
          throw new Error("Invalid Stage")
        }
        stagePokemon = stgPkmn;
      }

      let amount = stagePokemon.length;
      let pokemon: Pokemon = stagePokemon[(hashCode + pokemonAmount) % amount];

      if (selectedPokemon.has(pokemon)) {
        continue;
      }

      let score: number = (hashCode * pokemonAmount) % pokemon.points;

      let goal: Goal = {
        stage: stage,
        pokemon: pokemon,
        score: Math.round(score / 10) * 10
      };

      goals.push(goal);
      selectedPokemon.add(pokemon);

      pokemonAmount -= 1
    }

  } else if (matchType === MatchType.STAGE) {
    let stage: Stage = seededEnum(Stage, hashCode + hashCode ** pokemonAmount)
    let stagePokemon: Pokemon[] = parseStage(stage);

    if (stagePokemon.length < pokemonAmount) {
      pokemonAmount = stagePokemon.length;
    }

    while (pokemonAmount > 0) {
      let amount = stagePokemon.length;
      let pokemon: Pokemon = stagePokemon[(hashCode + pokemonAmount) % amount];

      if (selectedPokemon.has(pokemon)) {
        continue;
      }

      let score: number = (hashCode * pokemonAmount) % pokemon.points;

      let goal: Goal = {
        stage: stage,
        pokemon: pokemon,
        score: Math.round(score / 10) * 10
      };

      goals.push(goal);
      selectedPokemon.add(pokemon);

      pokemonAmount -= 1
    }

  } else {
    throw new Error("Invalid Match Type")
  }

  return {
    seed: seed,
    type: matchType,
    goals: goals
  }
}

// let match = generateMatch("BRUH", MatchType.STAGE)
// let match = generateMatch(null, null);

// console.dir(match);
// console.log(match.goals);
