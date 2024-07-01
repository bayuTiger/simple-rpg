export type Position = {
  x: number;
  y: number;
};

export type NPC = {
  id: string;
  position: Position;
  sprite: string;
  dialogue: string[];
};

export type Tile = 0 | 1 | 2; // 0: 通行可能, 1: 通行不可, 2: 遷移ポイント

export type MapTransition = {
  x: number;
  y: number;
  targetMap: string;
  targetX: number;
  targetY: number;
};

export type GameMap = {
  id: string;
  data: Tile[][];
  npcs: NPC[];
  transitions: MapTransition[];
};


export type Character = {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
};

export type BattleState = {
  inBattle: boolean;
  player: Character;
  enemy: Character | null;
  turn: "player" | "enemy";
  message: string;
  selectedAction: "attack" | "flee";
};