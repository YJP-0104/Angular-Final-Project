import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';


@Component({
  selector: 'app-post-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent {
  postForm: FormGroup;
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditing = !!data.post;
    this.postForm = this.fb.group({
      title: [data.post?.title || '', Validators.required],
      content: [data.post?.content || '', Validators.required],
      tags: [data.post?.tags.join(', ') || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.dialogRef.close(this.postForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
