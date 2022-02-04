export interface Page {
  renderHTML(): Promise<void | string>;

  afterRender(): Promise<void | string>;
}
