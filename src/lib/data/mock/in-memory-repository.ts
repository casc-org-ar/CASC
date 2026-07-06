import type {
  ContentRepository,
  CreateInput,
  UpdateInput,
} from "@/lib/data/repositories";
import type { BaseEntity } from "@/lib/types/domain";

/**
 * Generic in-memory repository. Backs every content entity for the
 * prototype. Data lives in the array passed in, which is a module-level
 * singleton — so writes made by the admin persist for the whole demo
 * session (until a full reload).
 */
export class InMemoryContentRepository<T extends BaseEntity>
  implements ContentRepository<T>
{
  constructor(private readonly store: T[]) {}

  async list(): Promise<T[]> {
    // Return copies so callers can't mutate the store by reference.
    return this.store.map((item) => ({ ...item }));
  }

  async getById(id: string): Promise<T | null> {
    const found = this.store.find((item) => item.id === id);
    return found ? { ...found } : null;
  }

  async create(input: CreateInput<T>): Promise<T> {
    const now = new Date().toISOString();
    const entity = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as T;
    this.store.unshift(entity);
    return { ...entity };
  }

  async update(id: string, input: UpdateInput<T>): Promise<T> {
    const index = this.store.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Entity with id "${id}" not found`);
    }
    const updated = {
      ...this.store[index],
      ...input,
      updatedAt: new Date().toISOString(),
    } as T;
    this.store[index] = updated;
    return { ...updated };
  }

  async remove(id: string): Promise<void> {
    const index = this.store.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Entity with id "${id}" not found`);
    }
    this.store.splice(index, 1);
  }
}
