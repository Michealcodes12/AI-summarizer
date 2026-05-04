interface ButtonProps {
  disabled?: boolean;
  customStyle: string;
  onclick: () => void;
  Text: string;
}

export default function Button({
  customStyle,
  Text,
  onclick,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onclick}
      disabled={disabled}
      className={`text-white font-semibold py-2 px-4 cursor-pointer  rounded transition-colors mb-4 ${customStyle}`}
    >
      {Text}
    </button>
  );
}
