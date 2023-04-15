import { Component, OnInit } from '@angular/core';
import { map, catchError, of, finalize } from 'rxjs';
import { TaskHttpService } from 'src/app/http/task.http.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private taskHttpService: TaskHttpService
  ) {}

  get tasks() {
    return this.taskService.tasks;
  }

  ngOnInit(): void {
    this.taskService.setLoading(true);
    this.taskHttpService
      .getAll()
      .pipe(
        map(res => (this.taskService.tasks = res)),
        catchError(error => of(this.taskService.setError(error.message))),
        finalize(() => this.taskService.setLoading(false))
      )
      .subscribe();
  }
}
