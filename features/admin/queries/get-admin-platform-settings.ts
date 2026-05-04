import "server-only";
import { prisma } from "@/server/db/prisma";
import { defaultPlatformSettings, platformSettingLabels, type PlatformSettingKey } from "@/features/admin/data/platform-settings";

export type PlatformSettingRow = {
  key: PlatformSettingKey;
  label: string;
  description: string;
  value: string;
  updatedAt?: Date;
};

export async function getAdminPlatformSettings() {
  const keys = Object.keys(defaultPlatformSettings) as PlatformSettingKey[];
  const records = await prisma.platformSetting.findMany({ where: { key: { in: keys } } });
  const byKey = new Map(records.map((record) => [record.key, record]));

  return keys.map((key) => {
    const record = byKey.get(key);
    return {
      key,
      label: platformSettingLabels[key].label,
      description: platformSettingLabels[key].description,
      value: record?.value ?? defaultPlatformSettings[key],
      updatedAt: record?.updatedAt
    } satisfies PlatformSettingRow;
  });
}
