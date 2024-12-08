import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SharedModule } from '../shared/shared.module';


@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css'],
  imports: [SharedModule],
  standalone: true,
})
export class PostDialogComponent {
  postForm: FormGroup;
  isEditing: boolean;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '400px',
    minHeight: '300px',
    maxHeight: '600px',
    placeholder: 'Enter text here...',
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarPosition: 'top',
    // Add font-awesome for better symbols
    toolbarHiddenButtons: [],
    sanitize: false, // Important for bullet symbols
    outline: true,
  
  };


  
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
