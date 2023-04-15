import { Component } from '@angular/core';

import { map, catchError, of, finalize } from 'rxjs';
import { TaskHttpService } from 'src/app/http/task.http.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  task: Task | null = null;
  title = '';

  constructor(
    private taskService: TaskService,
    private taskHttpService: TaskHttpService
  ) {
    this.taskService.task.subscribe(task => {
      this.task = task;
      this.title = task ? task.title : this.title;
    });
  }

  handleSubmit() {
    if (this.title === '') {
      alert('Please enter title of your task');
      return;
    }

    this.taskService.setLoading(true);

    if (!this.task) {
      const newTask: Task = {
        _id: uuid(),
        title: this.title,
      };

      this.taskHttpService
        .add(newTask)
        .pipe(
          map(task => {
            this.taskService.tasks.push(task);
            this.title = '';
          }),
          catchError(error => of(this.taskService.setError(error.message))),
          finalize(() => this.taskService.setLoading(false))
        )
        .subscribe();
    } else {
      this.task.title = this.title;

      this.taskHttpService
        .update(this.task._id, this.task)
        .pipe(
          map(task => {
            const index = this.taskService.tasks.findIndex(i => i._id === task._id);
            this.taskService.tasks[index] = task;

            this.taskService.task.next(null);
            this.title = '';
          }),
          catchError(error => of(this.taskService.setError(error.message))),
          finalize(() => this.taskService.setLoading(false))
        )
        .subscribe();
    }
  }
}
