export class BaseComponent {
  readonly componentName: string;
  readonly order?: number;

  constructor(componentName: string, order?: number) {
    this.componentName = componentName;
    this.order = order;
  }
}
