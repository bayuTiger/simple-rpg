import React from "react";
import { NPC } from "../types";
import { TILE_SIZE } from "../constants";
import styles from "../styles/Game.module.css";

interface NPCsProps {
  npcs: NPC[];
}

const NPCs: React.FC<NPCsProps> = ({ npcs }) => {
  return (
    <>
      {npcs.map((npc) => (
        <div
          key={npc.id}
          className={styles.npc}
          style={{
            left: npc.position.x * TILE_SIZE,
            top: npc.position.y * TILE_SIZE,
          }}
        >
          {npc.sprite}
        </div>
      ))}
    </>
  );
};

export default NPCs;
