function clamp(num: number, min: number, max: number): number {
  return num <= min ? min : num >= max ? max : num;
}

function randomHex(): string {
  return (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0")
}

declare interface String {
  hashCode() : number
}

String.prototype.hashCode = function() {
  let hash: number = 0;

  // Convert to 32bit integer
  for (var i = 0; i < this.length; i++) {
      let character: number = this.charCodeAt(i)
      hash = ((hash << 5) - hash) + character
      hash = hash & hash
  }

  return hash
}

function convertSeedToHashCode(inputSeed: string | null): [number, string] {
  let STATIC_SALT: string = "Pokémon Snap"

  let hashCode: number
  let seed: string

  if (inputSeed !== null) {
    seed = inputSeed
  } else {
    seed = randomHex()
  }

  let unhashedSeed: string = `${seed}-${STATIC_SALT}`
  hashCode = Math.abs(unhashedSeed.hashCode())

  return [hashCode, seed]
}

enum MatchType {
  STAGE,
  FREE_FOR_ALL
}

interface Match {
  seed: string;
  type: MatchType;
  goals: Array<Goal>;
}

enum Stage {
  BEACH,
  TUNNEL,
  VOLCANO,
  RIVER,
  CAVE,
  VALLEY,
  RAINBOW_CLOUD
}

interface Pokemon {
  name: string;
  points: number;
}

interface Goal {
  stage: Stage;
  pokemon: Pokemon;
  score: number;
}

function seededEnum<T>(anEnum: T, hashCode: number): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]

  const seededIndex = hashCode % enumValues.length
  const seededEnumValue = enumValues[seededIndex]

  return seededEnumValue
}

function generateMatch(inputSeed: string | null, inputMatchType: MatchType | null): Match {
  let [hashCode, seed]: [number, string] = convertSeedToHashCode(inputSeed)

  // ! How to deal with RainbowCloud
  // Each stage has a unique min and max value

  let matchType: MatchType
  if (inputMatchType !== null) {
    matchType = inputMatchType
  } else {
    matchType = seededEnum(MatchType, hashCode)
  }

  let goals: Array<Goal> = Array()
  let pokemonAmount = clamp(hashCode % 11, 3, 7)

  if (matchType === MatchType.FREE_FOR_ALL) {
    while (pokemonAmount > 0) {
      let stage: Stage = seededEnum(Stage, hashCode + pokemonAmount)
      // ! Get Pokémon array per stage
      let stagePokemon: Array<Pokemon> = [ { name: 'Pidgey', points: 5650 },
      { name: 'Doduo', points: 4600 },
      { name: 'Pikachu', points: 6000 },
      { name: 'Butterfree', points: 4780 },
      { name: 'Lapras', points: 3510 },
      { name: 'Meowth', points: 4510 },
      { name: 'Kangaskhan', points: 4100 },
      { name: 'Eevee', points: 4500 },
      { name: 'Snorlax', points: 4060 },
      { name: 'Scyther', points: 4480 },
      { name: 'Chansey', points: 4400 },
      { name: 'Magikarp', points: 500 } ]

      let amount = stagePokemon.length
      let pokemon: Pokemon = stagePokemon[(hashCode + pokemonAmount) % amount]
      let score: number = (hashCode * pokemonAmount) % pokemon.points

      let goal: Goal = {
        stage: stage,
        pokemon: pokemon,
        score: Math.round(score / 10) * 10
      }

      goals.push(goal)

      pokemonAmount -= 1
    }

  } else if (matchType === MatchType.STAGE) {
    let stage: Stage = seededEnum(Stage, hashCode)
    // ! Get Pokémon array per stage
    let stagePokemon: Array<Pokemon> = [ { name: 'Pidgey', points: 5650 },
      { name: 'Doduo', points: 4600 },
      { name: 'Pikachu', points: 6000 },
      { name: 'Butterfree', points: 4780 },
      { name: 'Lapras', points: 3510 },
      { name: 'Meowth', points: 4510 },
      { name: 'Kangaskhan', points: 4100 },
      { name: 'Eevee', points: 4500 },
      { name: 'Snorlax', points: 4060 },
      { name: 'Scyther', points: 4480 },
      { name: 'Chansey', points: 4400 },
      { name: 'Magikarp', points: 500 } ]

    while (pokemonAmount > 0) {
      let amount = stagePokemon.length
      let pokemon: Pokemon = stagePokemon[(hashCode + pokemonAmount) % amount]
      let score: number = (hashCode * pokemonAmount) % pokemon.points

      let goal: Goal = {
        stage: stage,
        pokemon: pokemon,
        score: Math.round(score / 10) * 10
      }

      goals.push(goal)

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
let match = generateMatch(null, null)

console.dir(match)
console.log(match.goals)
