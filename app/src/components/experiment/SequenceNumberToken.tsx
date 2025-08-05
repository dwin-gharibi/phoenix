import { Token } from "@phoenix/components/token";

export function SequenceNumberToken({
  sequenceNumber,
  color,
}: {
  sequenceNumber: number;
  color?: string;
}) {
  return (
    <Token color={color} size="S">
      #{sequenceNumber}
    </Token>
  );
}
