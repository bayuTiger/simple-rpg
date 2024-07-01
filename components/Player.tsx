import React from "react";
import { Position } from "../types";
import { TILE_SIZE } from "../constants";
import styles from "../styles/Game.module.css";

interface PlayerProps {
  position: Position;
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div
      className={styles.player}
      style={{
        left: position.x * TILE_SIZE,
        top: position.y * TILE_SIZE,
      }}
    >
      🧝
    </div>
  );
};

export default Player;
