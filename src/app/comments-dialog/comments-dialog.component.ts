import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-comments-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.css']
})
export class CommentsDialogComponent {
  commentForm: FormGroup;
  
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px', // Smaller height for comments
    minHeight: '100px',
    maxHeight: '200px',
    placeholder: 'Write your comment here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      this.dialogRef.close(this.commentForm.value.comment);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
