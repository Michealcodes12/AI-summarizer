import { useState } from "react";
import Button from "./Button";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <Button
      onclick={handleCopy}
      disabled={!text || isCopied}
      Text={isCopied ? " Copied!" : "Copy Summary"}
      customStyle={"bg-green-500 hover:bg-green-700"}
    />
  );
}
