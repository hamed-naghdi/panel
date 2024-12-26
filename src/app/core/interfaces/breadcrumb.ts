export interface IBreadcrumbContext {
  $implicit: IBreadcrumb;
  controller?: {

  }
}

export interface IBreadcrumb {
  label: string;
  url: string;
}
