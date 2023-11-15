export class RefIdCache<TKey, T> {
  private readonly type: string;
  private readonly map = new Map<TKey, T>();

  constructor(type: string) {
    this.type = type;
  }

  public getOrAdd(key: TKey, value: T) {
    let existingValue = this.map.get(key);
    if (!existingValue) {
      existingValue = value;
      this.map.set(key, value);
      return { ...existingValue, '#id': `${this.type}-${key}` };
    }

    return { '#ref': `${this.type}-${key}` };
  }

  public get(key: TKey) {
    return this.map.get(key);
  }

  public getValues() {
    return Array.from(this.map.values());
  }
}
