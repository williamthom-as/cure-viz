import {inject, computedFrom} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';
import {combo} from 'aurelia-combo';
import {Router} from 'aurelia-router';

@inject(Router, DialogController)
export class QuickMenuDialog {

  active = 0;

  constructor(router, controller) {
    this.router = router;
    this.controller = controller;
  }

  activate(model) {
    this.model = model;

    const currentRoute = this.router.currentInstruction.config.name;
    this.active = this.router.navigation.findIndex(
      (elem) => {
        return elem.config.name === currentRoute
      }
    );
  }

  @combo('up')
  up() {
    if (this.active > 0) {
      this.active -= 1;
    }
  }

  @combo('down')
  down() {
    if (this.active < (this.router.navigation.length - 1)) {
      this.active += 1;
    }
  }

  @combo('enter')
  navigateOnEnter() {
    if (this.active == null) {
      return
    }

    const route = this.router.navigation[this.active];
    this.navigateMenu(route.href);
  }

  navigateMenu(routeHref) {
    this.controller.cancel();
    this.router.navigate(routeHref, {});
  }

}