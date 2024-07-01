import React from "react";
import styles from "../styles/Game.module.css";

interface InteractionPromptProps {
  onInteract: () => void;
}

const InteractionPrompt: React.FC<InteractionPromptProps> = ({
  onInteract,
}) => (
  <div className={styles.interactionPrompt} onClick={onInteract}>
    Zキーで会話
  </div>
);

export default InteractionPrompt;
