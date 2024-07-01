import { useState, useEffect } from "react";
import {
  Position,
  NPC,
  GameMap,
  MapTransition,
  Character,
  BattleState,
} from "../types";
import { maps } from "../data/maps";
import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE } from "../constants";
import Map from "../components/Map";
import Player from "../components/Player";
import NPCs from "../components/NPCs";
import DialogueBox from "../components/DialogueBox";
import InteractionPrompt from "../components/InteractionPrompt";
import BattleScreen from "../components/BattleScreen";
import styles from "../styles/Game.module.css";

const ENCOUNTER_RATE = 0.1; // 10% chance of encounter per move

const initialPlayer: Character = {
  name: "勇者",
  hp: 100,
  maxHp: 100,
  attack: 20,
  defense: 10,
};

const createEnemy = (): Character => ({
  name: "モンスター",
  hp: 50,
  maxHp: 50,
  attack: 15,
  defense: 5,
});

const Game = () => {
  const [currentMap, setCurrentMap] = useState<GameMap>(maps.village);
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 5,
    y: 5,
  });
  const [currentDialogue, setCurrentDialogue] = useState<string[] | null>(null);
  const [currentDialogueLine, setCurrentDialogueLine] = useState(0);
  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null);
  const [battleState, setBattleState] = useState<BattleState>({
    inBattle: false,
    player: initialPlayer,
    enemy: null,
    turn: "player",
    message: "",
    selectedAction: "attack",
  });

  const isPositionOccupied = (x: number, y: number): boolean => {
    return currentMap.npcs.some(
      (npc) => npc.position.x === x && npc.position.y === y
    );
  };

  const checkMapTransition = (
    x: number,
    y: number
  ): MapTransition | undefined => {
    return currentMap.transitions.find((t) => t.x === x && t.y === y);
  };

  const checkRandomEncounter = () => {
    if (currentMap.id === "forest" && Math.random() < ENCOUNTER_RATE) {
      setBattleState({
        inBattle: true,
        player: battleState.player,
        enemy: createEnemy(),
        turn: "player",
        message: "モンスターが現れた！",
        selectedAction: "attack",
      });
    }
  };

  const movePlayer = (dx: number, dy: number) => {
    if (battleState.inBattle) return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (
      newX >= 0 &&
      newX < MAP_WIDTH &&
      newY >= 0 &&
      newY < MAP_HEIGHT &&
      currentMap.data[newY][newX] !== 1 &&
      !isPositionOccupied(newX, newY)
    ) {
      const transition = checkMapTransition(newX, newY);
      if (transition) {
        setCurrentMap(maps[transition.targetMap]);
        setPlayerPosition({ x: transition.targetX, y: transition.targetY });
      } else {
        setPlayerPosition({ x: newX, y: newY });
        checkRandomEncounter();
        checkNPCProximity();
      }
    }
  };

  const checkNPCProximity = () => {
    const nearby = currentMap.npcs.find(
      (npc) =>
        Math.abs(npc.position.x - playerPosition.x) <= 1 &&
        Math.abs(npc.position.y - playerPosition.y) <= 1
    );
    setNearbyNPC(nearby || null);
  };

  const handleInteraction = () => {
    if (currentDialogue) {
      if (currentDialogueLine < currentDialogue.length - 1) {
        setCurrentDialogueLine(currentDialogueLine + 1);
      } else {
        setCurrentDialogue(null);
        setCurrentDialogueLine(0);
      }
    } else if (nearbyNPC) {
      setCurrentDialogue(nearbyNPC.dialogue);
      setCurrentDialogueLine(0);
    }
  };

  const handleBattleAction = () => {
    if (
      !battleState.inBattle ||
      !battleState.enemy ||
      battleState.turn !== "player"
    )
      return;

    const action = battleState.selectedAction;

    if (action === "attack") {
      const damage = Math.max(
        battleState.player.attack - battleState.enemy.defense,
        0
      );
      const newEnemyHp = Math.max(battleState.enemy.hp - damage, 0);

      if (newEnemyHp === 0) {
        setBattleState((prevState) => ({
          ...prevState,
          inBattle: false,
          enemy: null,
          message: "モンスターを倒した！",
        }));
      } else {
        setBattleState((prevState) => ({
          ...prevState,
          enemy: { ...prevState.enemy!, hp: newEnemyHp },
          turn: "enemy",
          message: `${damage}のダメージを与えた！`,
        }));
        setTimeout(enemyTurn, 1000);
      }
    } else if (action === "flee") {
      if (Math.random() < 0.5) {
        setBattleState((prevState) => ({
          ...prevState,
          inBattle: false,
          enemy: null,
          message: "逃げ出した！",
        }));
      } else {
        setBattleState((prevState) => ({
          ...prevState,
          turn: "enemy",
          message: "逃げ出せなかった！",
        }));
        setTimeout(enemyTurn, 1000);
      }
    }
  };

  const handleBattleSelection = (direction: "up" | "down") => {
    setBattleState((prevState) => ({
      ...prevState,
      selectedAction: direction === "up" ? "attack" : "flee",
    }));
  };

  const enemyTurn = () => {
    setBattleState((prevState) => {
      if (!prevState.inBattle || !prevState.enemy) return prevState;

      const damage = Math.max(
        prevState.enemy.attack - prevState.player.defense,
        0
      );
      const newPlayerHp = Math.max(prevState.player.hp - damage, 0);

      if (newPlayerHp === 0) {
        return {
          ...prevState,
          player: { ...prevState.player, hp: newPlayerHp },
          message: "あなたは倒れた...",
        };
      } else {
        return {
          ...prevState,
          player: { ...prevState.player, hp: newPlayerHp },
          turn: "player",
          message: `${damage}のダメージを受けた！`,
        };
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (battleState.inBattle) {
        switch (e.key.toLowerCase()) {
          case "arrowup":
          case "arrowleft":
            handleBattleSelection("up");
            break;
          case "arrowdown":
          case "arrowright":
            handleBattleSelection("down");
            break;
          case "z":
            handleBattleAction();
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          case "arrowup":
            movePlayer(0, -1);
            break;
          case "arrowdown":
            movePlayer(0, 1);
            break;
          case "arrowleft":
            movePlayer(-1, 0);
            break;
          case "arrowright":
            movePlayer(1, 0);
            break;
          case "z":
            handleInteraction();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    playerPosition,
    nearbyNPC,
    currentDialogue,
    currentDialogueLine,
    currentMap,
    battleState,
  ]);

  useEffect(() => {
    checkNPCProximity();
  }, [playerPosition]);

  

  return (
    <div
      className={styles.game}
      style={{
        width: `${currentMap.data[0].length * TILE_SIZE}px`,
        height: `${currentMap.data.length * TILE_SIZE}px`,
      }}
    >
      <Map data={currentMap.data} />
      <Player position={playerPosition} />
      <NPCs npcs={currentMap.npcs} />
      {nearbyNPC && !currentDialogue && !battleState.inBattle && (
        <InteractionPrompt />
      )}
      {currentDialogue && !battleState.inBattle && (
        <DialogueBox
          dialogue={currentDialogue}
          currentLine={currentDialogueLine}
          onNext={handleInteraction}
        />
      )}
      {battleState.inBattle && (
        <BattleScreen
          battleState={battleState}
          onSelectAction={handleBattleSelection}
          onAction={handleBattleAction}
        />
      )}
    </div>
  );
};

export default Game;