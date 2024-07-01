import React from "react";
import { Tile } from "../types";
import { TILE_SIZE } from "../constants";
import styles from "../styles/Game.module.css";

interface MapProps {
  data: Tile[][];
}

const Map: React.FC<MapProps> = ({ data }) => {
  return (
    <div className={styles.map}>
      {data.map((row, y) =>
        row.map((tile, x) => (
          <div
            key={`${x}-${y}`}
            className={`${styles.tile} ${
              tile === 0
                ? styles.floor
                : tile === 1
                ? styles.wall
                : styles.transition
            }`}
            style={{
              left: x * TILE_SIZE,
              top: y * TILE_SIZE,
            }}
          />
        ))
      )}
    </div>
  );
};

export default Map;
