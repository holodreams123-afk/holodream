import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../角色名片/card-catalog.json"), "utf8"),
);

const compact = catalog.map((r) => ({
  no: r.no,
  m: r.member,
  c: r.card,
  t: r.stats.total,
  p: r.stats.performance,
  tk: r.stats.technique,
  s: r.stats.sense,
  sp: r.skills.sp,
  a: r.skills.active,
  ps: r.skills.passive,
  cs: r.costumeSkill,
  note: r.note ?? "",
}));

const out = path.join(
  process.env.USERPROFILE ?? "",
  ".cursor/projects/c-holodream/canvases/character-card-catalog.canvas.tsx",
);

const canvas = `import { useMemo, useState } from "react";
import {
  H1,
  H2,
  Text,
  TextInput,
  Table,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "cursor/canvas";

const DATA = ${JSON.stringify(compact, null, 2)} as const;

export default function CharacterCardCatalog() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [...DATA];
    return DATA.filter(
      (r) =>
        r.no.includes(s) ||
        r.m.toLowerCase().includes(s) ||
        r.c.toLowerCase().includes(s) ||
        r.sp.includes(s) ||
        r.a.includes(s) ||
        r.ps.includes(s) ||
        r.cs.includes(s),
    );
  }, [q]);

  return (
    <Stack gap={16} style={{ padding: 16, maxWidth: 1200 }}>
      <H1>角色名片完整資料表</H1>
      <Text tone="secondary">
        來源：角色名片截圖 · 共 {DATA.length} 張 ★5 卡 · 三圍為滿級最大值
      </Text>
      <TextInput
        label="搜尋成員、卡名或技能關鍵字"
        value={q}
        onChange={setQ}
        placeholder="例：快樂類型、26082、Energetic"
      />
      <Table
        headers={["#", "成員", "卡名", "總計", "表現力", "技巧", "品味"]}
        rows={filtered.map((r) => [
          r.no,
          r.m,
          r.c,
          String(r.t),
          String(r.p),
          String(r.tk),
          String(r.s),
        ])}
        columnAlign={["center", "left", "left", "right", "right", "right", "right"]}
        striped
        stickyHeader
      />
      <Divider />
      <H2>技能與衣裝（{filtered.length} 張）</H2>
      <Stack gap={12}>
        {filtered.map((r) => (
          <Card key={r.no + r.c} variant="outline">
            <CardHeader>
              {r.no} {r.m} — {r.c}
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text weight="semibold">SP</Text>
                <Text>{r.sp}</Text>
                <Text weight="semibold">Active</Text>
                <Text>{r.a}</Text>
                <Text weight="semibold">Passive</Text>
                <Text>{r.ps}</Text>
                <Text weight="semibold">衣裝技能</Text>
                <Text>{r.cs}</Text>
                {r.note ? <Text tone="tertiary">{r.note}</Text> : null}
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
`;

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, canvas, "utf8");
console.log("Wrote canvas:", out);
