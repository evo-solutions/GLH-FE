import "@/styles/golden-lotus/index.css";
import { GoldenLotusProviders } from "@/components/providers/golden-lotus/GoldenLotusProviders";
import { GoldenLotusShell } from "@/components/layout/golden-lotus/GoldenLotusShell";

export default function GoldenLotusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoldenLotusProviders>
      <GoldenLotusShell>{children}</GoldenLotusShell>
    </GoldenLotusProviders>
  );
}
