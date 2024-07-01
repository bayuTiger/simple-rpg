import React from "react";
import { BattleState } from "../types";
import styles from "../styles/Game.module.css";

interface BattleScreenProps {
  battleState: BattleState;
  onSelectAction: (direction: "up" | "down") => void;
  onAction: () => void;
}

const BattleScreen: React.FC<BattleScreenProps> = ({
  battleState,
  onSelectAction,
  onAction,
}) => {
  const { player, enemy, turn, message, selectedAction } = battleState;

  if (!enemy) return null;

  return (
    <div className={styles.battleScreen}>
      <div className={styles.battleInfo}>
        <div>
          <h3>{player.name}</h3>
          <p>
            HP: {player.hp}/{player.maxHp}
          </p>
        </div>
        <div>
          <h3>{enemy.name}</h3>
          <p>
            HP: {enemy.hp}/{enemy.maxHp}
          </p>
        </div>
      </div>
      <div className={styles.battleMessage}>{message}</div>
      <div className={styles.battleActions}>
        <button
          className={selectedAction === "attack" ? styles.selected : ""}
          onClick={() => onSelectAction("up")}
          disabled={turn === "enemy"}
        >
          攻撃
        </button>
        <button
          className={selectedAction === "flee" ? styles.selected : ""}
          onClick={() => onSelectAction("down")}
          disabled={turn === "enemy"}
        >
          逃げる
        </button>
      </div>
      <div className={styles.battleInstructions}>←→キーで選択、Zキーで決定</div>
    </div>
  );
};

export default BattleScreen;
