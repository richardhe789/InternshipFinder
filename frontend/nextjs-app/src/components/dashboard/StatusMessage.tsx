type StatusMessageProps = {
  text: string;
};

export default function StatusMessage({ text }: StatusMessageProps) {
  return (
    <p className="mt-3 text-[0.8rem] text-legacy-ink-500">
      {text}
    </p>
  );
}