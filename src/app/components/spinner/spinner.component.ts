import { Component } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  constructor(private taskService: TaskService) {}

  public get loading() {
    return this.taskService.loading;
  }
}
