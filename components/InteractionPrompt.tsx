import React from "react";
import styles from "../styles/Game.module.css";

const InteractionPrompt: React.FC<{ onInteract: () => void }> = ({
  onInteract,
}) => (
  <div className={styles.interactionPrompt} onClick={onInteract}>
    Zキーで会話
  </div>
);

export default InteractionPrompt;
