import { Component } from '@angular/core';
import { map, catchError, of, finalize } from 'rxjs';
import { TaskHttpService } from 'src/app/http/task.http.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-clear',
  templateUrl: './task-clear.component.html',
})
export class TaskClearComponent {
  constructor(private taskService: TaskService, private taskHttpService: TaskHttpService) {}

  get tasks() {
    return this.taskService.tasks;
  }

  get error() {
    return this.taskService.error;
  }

  handleRemoveTask() {
    if (!confirm('Are you sure you want to clear all tasks?')) {
      return;
    }

    this.taskService.setLoading(true);
    this.taskHttpService
      .removeAll(this.tasks.map(i => i._id))
      .pipe(
        map(() => (this.taskService.tasks = [])),
        catchError(error => of(this.taskService.setError(error.message))),
        finalize(() => this.taskService.setLoading(false))
      )
      .subscribe();
  }
}
