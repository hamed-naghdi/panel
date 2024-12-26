import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {IBreadcrumb, IBreadcrumbContext} from '../interfaces/breadcrumb';

@Directive({
  selector: '[hamiBreadcrumb]'
})
export class BreadcrumbDirective implements OnInit{

  context: IBreadcrumbContext | null = null;

  @Input('hamiBreadcrumbFrom') items: IBreadcrumb[] = [];

  constructor(private templateRef: TemplateRef<IBreadcrumbContext>,
              private viewContainerRef: ViewContainerRef,
              private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.context = {
      $implicit: this.items[0]
    }

    // generate view (create embedded view)
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
  }

}
