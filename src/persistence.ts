import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type {
  Roadmap,
  RoadmapRepository,
  ShareableRoadmap,
} from "./domain.js";

export class InMemoryRoadmapRepository implements RoadmapRepository {
  readonly #roadmaps = new Map<string, Roadmap>();

  public async save(roadmap: Roadmap): Promise<void> {
    this.#roadmaps.set(roadmap.id, structuredClone(roadmap));
  }

  public async load(roadmapId: string): Promise<Roadmap | undefined> {
    const roadmap = this.#roadmaps.get(roadmapId);
    return roadmap ? structuredClone(roadmap) : undefined;
  }
}

const SAFE_FILE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export class FileRoadmapRepository implements RoadmapRepository {
  readonly #directory: string;

  public constructor(directory: string) {
    this.#directory = directory;
  }

  #pathFor(roadmapId: string): string {
    if (!SAFE_FILE_ID.test(roadmapId)) {
      throw new Error(`Unsafe roadmap ID for local persistence: ${roadmapId}`);
    }
    return join(this.#directory, `${roadmapId}.json`);
  }

  public async save(roadmap: Roadmap): Promise<void> {
    await mkdir(this.#directory, { recursive: true, mode: 0o700 });
    await chmod(this.#directory, 0o700);
    const path = this.#pathFor(roadmap.id);
    await writeFile(path, `${JSON.stringify(roadmap, null, 2)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
    await chmod(path, 0o600);
  }

  public async load(roadmapId: string): Promise<Roadmap | undefined> {
    try {
      const serialized = await readFile(this.#pathFor(roadmapId), "utf8");
      const roadmap = JSON.parse(serialized) as Roadmap;
      if (roadmap.id !== roadmapId) {
        throw new Error(`Stored roadmap identity does not match ${roadmapId}.`);
      }
      return roadmap;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw error;
    }
  }
}

export function toShareableRoadmap(roadmap: Roadmap): ShareableRoadmap {
  const { answers: _answers, tasks, ...safeRoadmap } = roadmap;
  return {
    ...safeRoadmap,
    tasks: tasks.map(({ proofConfirmed: _proofConfirmed, ...task }) => task),
  };
}
