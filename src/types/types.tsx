//lint ignore-file
//Return from https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1025

export interface PokemonList {
  count: number;
  next: string;
  previous: null;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

//Return from https://pokeapi.co/api/v2/pokemon/ id
export interface Pokemon {
  abilities: Ability[];
  base_experience: number;
  cries: Cries;
  forms: Species[];
  game_indices: GameIndex[];
  height: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  species: Species;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

export interface Ability {
  ability: Species;
  is_hidden: boolean;
  slot: number;
}

export interface Species {
  name: string;
  url: string;
}

export interface Cries {
  latest: string;
  legacy: string;
}

export interface GameIndex {
  game_index: number;
  version: Species;
}

export interface Move {
  move: Species;
  version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: Species;
  order: number | null;
  version_group: Species;
}

export interface GenerationV {
  "black-white": Sprites;
}

export interface GenerationIv {
  "diamond-pearl": Sprites;
  "heartgold-soulsilver": Sprites;
  platinum: Sprites;
}

export interface Versions {
  "generation-i": GenerationI;
  "generation-ii": GenerationIi;
  "generation-iii": GenerationIii;
  "generation-iv": GenerationIv;
  "generation-v": GenerationV;
  "generation-vii": GenerationVii;
  "generation-viii": GenerationViii;
}

export interface Other {
  dream_world: DreamWorld;
  home: Home;
  "official-artwork": OfficialArtwork;
  showdown: Sprites;
}

export interface Sprites {
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
  other?: Other;
  versions?: Versions;
  animated?: Sprites;
}

export interface GenerationI {
  "red-blue": RedBlue;
  yellow: RedBlue;
}

export interface RedBlue {
  back_default: string;
  back_gray: string;
  back_transparent: string;
  front_default: string;
  front_gray: string;
  front_transparent: string;
}

export interface GenerationIi {
  crystal: Crystal;
  gold: Gold;
  silver: Gold;
}

export interface Crystal {
  back_default: string;
  back_shiny: string;
  back_shiny_transparent: string;
  back_transparent: string;
  front_default: string;
  front_shiny: string;
  front_shiny_transparent: string;
  front_transparent: string;
}

export interface Gold {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
  front_transparent?: string;
}

export interface GenerationIii {
  emerald: OfficialArtwork;
  "firered-leafgreen": Gold;
  "ruby-sapphire": Gold;
}

export interface OfficialArtwork {
  front_default: string;
  front_shiny: string;
}

export interface Home {
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
}

export interface GenerationVii {
  icons: DreamWorld;
  "ultra-sun-ultra-moon": Home;
}

export interface DreamWorld {
  front_default: string;
  front_female: null;
}

export interface GenerationViii {
  icons: DreamWorld;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Species;
}

export interface Type {
  slot: number;
  type: Species;
}

//Return from https://pokeapi.co/api/v2/pokemon-species/ id
export interface PokemonSpecies {
  base_happiness: number;
  capture_rate: number;
  color: Color;
  egg_groups: Color[];
  evolution_chain: EvolutionChain;
  evolves_from_species: Color;
  flavor_text_entries: FlavorTextEntry[];
  forms_switchable: boolean;
  gender_rate: number;
  genera: Genus[];
  generation: Color;
  growth_rate: Color;
  habitat: Color;
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: Name[];
  order: number;
  pal_park_encounters: PalParkEncounter[];
  pokedex_numbers: PokedexNumber[];
  shape: Color;
  varieties: Variety[];
}

export interface Color {
  name: string;
  url: string;
}

//Return from https://pokeapi.co/api/v2/evolution-chain/ id

export interface EvolutionChain {
  url: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: Color;
  version: Color;
}

export interface Genus {
  genus: string;
  language: Color;
}

export interface Name {
  language: Color;
  name: string;
}

export interface PalParkEncounter {
  area: Color;
  base_score: number;
  rate: number;
}

export interface PokedexNumber {
  entry_number: number;
  pokedex: Color;
}

export interface Variety {
  is_default: boolean;
  pokemon: Color;
}
export interface SpeciesEvolutionChain {
  baby_trigger_item: Species | null;
  chain: Chain;
  id: number;
}

export interface Chain {
  evolution_details: EvolutionDetail[];
  evolves_to: Chain[];
  is_baby: boolean;
  species: Species;
}

export interface EvolutionDetail {
  gender: number | null;
  held_item: Species;
  item: Species | null;
  known_move: Species | null;
  known_move_type: Species | null;
  location: Species | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  time_of_day: string;
  trade_species: Species | null;
  trigger: Species;
  turn_upside_down: boolean;
}

//Return from https://pokeapi.co/api/v2/move/ id
export interface MoveInfo {
  accuracy: number;
  contest_effect: ContestEffect;
  contest_type: ContestType;
  damage_class: ContestType;
  effect_chance: number;
  // effect_changes: any[];
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  generation: ContestType;
  id: number;
  learned_by_pokemon: ContestType[];
  machines: Machine[];
  meta: Meta;
  name: string;
  names: Name[];
  past_values: PastValue[];
  power: number;
  pp: number;
  priority: number;
  stat_changes: StatChange[];
  super_contest_effect: ContestEffect;
  target: ContestType;
  type: ContestType;
}

export interface ContestEffect {
  url: string;
}

export interface ContestType {
  name: string;
  url: string;
}

export interface EffectEntry {
  effect: string;
  language: ContestType;
  short_effect: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: ContestType;
  version_group: ContestType;
}

export interface Machine {
  machine: ContestEffect;
  version_group: ContestType;
}

export interface Meta {
  ailment: ContestType;
  ailment_chance: number;
  category: ContestType;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  max_hits: null;
  max_turns: null;
  min_hits: null;
  min_turns: null;
  stat_chance: number;
}

export interface Name {
  language: ContestType;
  name: string;
}

export interface PastValue {
  accuracy: number;
  effect_chance: null;
  effect_entries: EffectEntry[];
  power: null;
  pp: null;
  type: null;
  version_group: ContestType;
}

export interface StatChange {
  change: number;
  stat: ContestType;
}
// return from https://pokeapi.co/api/v2/item-category/?offset=0&limit=54
export interface ItemCategory {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

//return from /item/ id
export interface ItemInfo {
  attributes: Category[];
  baby_trigger_for: null;
  category: Category;
  cost: number;
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  fling_effect: null;
  fling_power: null;
  game_indices: GameIndex[];
  held_by_pokemon: Pokemon[];
  id: number;
  machines: MachineElement[];
  name: string;
  names: Name[];
  sprites: Sprites;
}

export interface Category {
  name: string;
  url: string;
}

export interface EffectEntry {
  effect: string;
  language: Category;
  short_effect: string;
}

export interface FlavorTextEntry {
  language: Category;
  text: string;
  version_group: Category;
}

export interface GameIndex {
  game_index: number;
  generation: Category;
}

export interface Name {
  language: Category;
  name: string;
}

export interface Sprites {
  default: string;
}
export interface MachineElement {
  machine: MachineMachine;
  version_group: Category;
}

export interface MachineMachine {
  url: string;
}

//return from move-category

export interface MoveCategory {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

//return from move-category/ id
export interface IndependantMoveCategory {
  descriptions: Description[];
  id: number;
  moves: Move[];
  name: string;
}

export interface Description {
  description: string;
  language: Move;
}

export interface Move {
  name: string;
  url: string;
}

//return from move
export interface MoveInfo {
  accuracy: number;
  contest_combos: null;
  contest_effect: ContestEffect;
  contest_type: ContestType;
  damage_class: ContestType;
  effect_chance: number;
  // effect_changes: any[];
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  generation: ContestType;
  id: number;
  learned_by_pokemon: ContestType[];
  machines: Machine[];
  meta: Meta;
  name: string;
  names: Name[];
  // past_values:          any[];
  power: number;
  pp: number;
  priority: number;
  stat_changes: StatChange[];
  super_contest_effect: ContestEffect;
  target: ContestType;
  pokemonType: Type;
}

export interface ContestEffect {
  url: string;
}

export interface ContestType {
  name: string;
  url: string;
}

export interface EffectEntry {
  effect: string;
  language: ContestType;
  short_effect: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: ContestType;
  version_group: ContestType;
}

export interface Machine {
  machine: ContestEffect;
  version_group: ContestType;
}

export interface Meta {
  ailment: ContestType;
  ailment_chance: number;
  category: ContestType;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  max_hits: null;
  max_turns: null;
  min_hits: null;
  min_turns: null;
  stat_chance: number;
}

export interface Name {
  language: ContestType;
  name: string;
}

export interface StatChange {
  change: number;
  stat: ContestType;
}

//return from ability
export interface Ability {
  count: number;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

///return from ability/ id
export interface AbilityInfo {
  // effect_changes: any[];
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  generation: Generation;
  id: number;
  is_main_series: boolean;
  name: string;
  names: Name[];
  pokemon: PokemonAbility[];
}

export interface EffectEntry {
  effect: string;
  language: Generation;
  short_effect: string;
}

export interface Generation {
  name: string;
  url: string;
}

export interface Name {
  language: Generation;
  name: string;
}

export interface PokemonAbility {
  is_hidden: boolean;
  pokemon: Generation;
  slot: number;
}

//All machines
export interface AllMachines {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  url: string;
}

//machine item
export interface MachineItemInfo {
  // attributes:          any[];
  // baby_trigger_for:    null;
  category: Category;
  cost: number;
  // effect_entries:      any[];
  flavor_text_entries: FlavorTextEntry[];
  fling_effect: null;
  fling_power: number;
  game_indices: GameIndex[];
  // held_by_pokemon:     any[];
  id: number;
  machines: MachineElement[];
  name: string;
  names: Name[];
  sprites: Sprites;
}

export interface Category {
  name: string;
  url: string;
}

export interface FlavorTextEntry {
  language: Category;
  text: string;
  version_group: Category;
}

export interface GameIndex {
  game_index: number;
  generation: Category;
}

export interface MachineElement {
  machine: MachineMachine;
  version_group: Category;
}

export interface MachineMachine {
  url: string;
}

export interface Name {
  language: Category;
  name: string;
}

//machine info
export interface MachineInfo {
  id: number;
  item: Item;
  move: Item;
  version_group: Item;
}

export interface Item {
  name: string;
  url: string;
}
