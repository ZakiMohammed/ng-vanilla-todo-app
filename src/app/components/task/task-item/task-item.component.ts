import { Component, Input } from '@angular/core';
import { map, catchError, of, finalize } from 'rxjs';
import { TaskHttpService } from 'src/app/http/task.http.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  @Input() task!: Task;

  constructor(
    private taskService: TaskService,
    private taskHttpService: TaskHttpService
  ) {}

  handleEditTask() {
    this.taskService.task.next(this.task);
  }

  handleRemoveTask() {
    this.taskService.setLoading(true);
    this.taskHttpService
      .remove(this.task._id)
      .pipe(
        map(() => {
          const index = this.taskService.tasks.findIndex(i => i._id === this.task._id);
          this.taskService.tasks.splice(index, 1);
        }),
        catchError(error => of(this.taskService.setError(error.message))),
        finalize(() => this.taskService.setLoading(false))
      )
      .subscribe();
  }
}
