import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks: Task[] = [];
  task = new BehaviorSubject<Task | null>(null);
  loading = false;
  error: string | null = null;

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }
}
