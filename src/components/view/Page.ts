export interface Page {
  renderHTML(): Promise<void>;

  afterRender(): Promise<void>;

  run(): Promise<void>;
}
