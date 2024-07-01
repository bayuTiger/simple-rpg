import React from "react";
import styles from "../styles/Game.module.css";

interface DialogueBoxProps {
  dialogue: string[];
  currentLine: number;
  onNext: () => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  currentLine,
  onNext,
}) => {
  return (
    <div className={styles.dialogueBox}>
      <p>{dialogue[currentLine]}</p>
      <p className={styles.dialoguePrompt}>
        {currentLine < dialogue.length - 1 ? "Zキーで次へ" : "Zキーで閉じる"}
      </p>
    </div>
  );
};

export default DialogueBox;
