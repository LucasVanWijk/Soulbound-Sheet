export interface ParsedArchetype {
  id: string; name: string; faction: string; page: number | null; summary: string;
  species: string; subfaction: string | null;
  attributes: { body: number; mind: number; soul: number };
  skillXp: number; anySkill: boolean; skills: string[];
  coreSkill: string | null; coreSkillChoices: string[];
  coreTalents: string[]; coreTalentChoices: string[];
  talentPicks: number; talentOptions: { name: string; requirement: boolean }[]; miracleGod: string | null;
  equipment: { options: string[] }[]; drops: number;
}
export function parseArchetypes(kbDir: string, data: { skills: { name: string }[] }): ParsedArchetype[];
