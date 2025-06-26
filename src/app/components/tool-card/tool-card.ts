import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-card',
  imports: [],
  templateUrl: './tool-card.html',
  styleUrl: './tool-card.scss'
})
export class ToolCard {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() route: string = '';

  constructor(private router: Router) {}

  navigateToTool() {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }
}
