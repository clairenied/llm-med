import { prisma } from "@/lib/prisma";

export type GradingMode = "HUMAN" | "AI";

export async function getGradingMode(): Promise<GradingMode> {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "GRADING_MODE" },
  });
  return (setting?.value as GradingMode) || "HUMAN";
}

export async function setGradingMode(mode: GradingMode): Promise<void> {
  await prisma.systemSetting.upsert({
    where: { key: "GRADING_MODE" },
    update: { value: mode },
    create: { key: "GRADING_MODE", value: mode },
  });
}
