import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DocumentService, DocumentUploadRequest } from '../../services/document.service';
import { DocumentItem, DocumentStatus } from '../../model/document-model';
import { DOCUMENT_TYPES } from '../../model/document-type.config';
import { Dialog } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, TagModule, Dialog, Tooltip],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent implements OnChanges {

  private readonly documentService = inject(DocumentService);

  @Input({ required: true }) patientId!: number;
  @Input({ required: true }) uploadedBy!: number;
  @Input() visitId: number | null = null;
  @Input() admissionId: number | null = null;
  @Input() documents: DocumentItem[] = [];

  @Output() documentsChange = new EventEmitter<DocumentItem[]>();
  @Output() uploaded = new EventEmitter<DocumentItem[]>();
  @Output() deleted = new EventEmitter<DocumentItem>();

  documentTypes = DOCUMENT_TYPES;
  isDragOver = false;
  private browseIndex: number | null = null;

  readonly maxFileSize = 20 * 1024 * 1024;
  readonly allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  private readonly sanitizer = inject(DomSanitizer);

  viewDialogVisible = false;
  viewDocumentUrl: string | null = null;
  safeDocumentUrl: SafeResourceUrl | null = null;
  viewDocumentName = '';
  viewDocumentType = '';

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['documents']) {
    this.documents = [...(changes['documents'].currentValue ?? [])];
  }
}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;

    if (!files?.length) {
      return;
    }

    this.addFiles(Array.from(files));
  }

  openBrowse(input: HTMLInputElement): void {
    this.browseIndex = null;
    input.click();
  }

  browseFile(index: number, input: HTMLInputElement): void {
    this.browseIndex = index;
    input.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const files = Array.from(input.files);

    if (this.browseIndex !== null) {
      this.replaceFile(this.browseIndex, files[0]);
    } else {
      this.addFiles(files);
    }

    input.value = '';
    this.browseIndex = null;
  }

  private addFiles(files: File[]): void {
    const newDocuments: DocumentItem[] = [];

    for (const file of files) {
      const validation = this.validateFile(file);

      if (!validation.valid) {
        console.error(validation.message);
        continue;
      }

      newDocuments.push({
        id: this.generateDocumentId(),
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        documentType: 'OTHER',
        status: 'pending',
        progress: 0
      });
    }

    if (!newDocuments.length) {
      return;
    }

    this.documents = [...this.documents, ...newDocuments];
    this.emitChange();
  }

  private replaceFile(index: number, file: File): void {
    const validation = this.validateFile(file);

    if (!validation.valid) {
      console.error(validation.message);
      return;
    }

    const document = this.documents[index];

    if (!document) {
      return;
    }

    this.documents[index] = {
      ...document,
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      status: 'pending',
      progress: 0,
      errorMessage: undefined
    };

    this.documents = [...this.documents];
    this.emitChange();
  }

  onDocumentTypeChange(document: DocumentItem): void {
    if (document.status === 'uploaded' || document.status === 'uploading') {
      return;
    }

    document.errorMessage = undefined;
    this.emitChange();
  }

  uploadDocument(document: DocumentItem): void {
    
  if (!document.file) {
    this.setFailed(document, 'Please select a file.');
    return;
  }

  if (!document.documentType) {
    this.setFailed(document, 'Please select document type.');
    return;
  }

  this.setUploading(document);

  const request: DocumentUploadRequest = {
     id: document.id,
    documentType: document.documentType,
    file: document.file,
    patientId: this.patientId,
    visitId: this.visitId,
    admissionId: this.admissionId
  };

  this.documentService
    .uploadDocument(
      this.patientId,
      this.uploadedBy,
      this.visitId,
      this.admissionId,
      request
    )
    .subscribe({
      next: event => {
        this.handleProgress(event, [document]);
      },
      error: error => {
        console.error('Upload failed:', error);

        this.setFailed(
          document,
          error?.error?.message ||
          'Upload failed. Please try again.'
        );
      }
    });
}

  uploadAll(): void {
  const pendingDocuments = this.documents.filter(
    document =>
      document.file &&
      document.documentType &&
      document.status !== 'uploaded' &&
      document.status !== 'uploading'
  );

  if (pendingDocuments.length === 0) {
    return;
  }

  pendingDocuments.forEach(document => {
    this.setUploading(document);
  });

  const requests: DocumentUploadRequest[] =
    pendingDocuments.map(document => ({
      // id: document.id,
      // documentType: document.documentType,
      // file: document.file!
       id: document.id,
      documentType: document.documentType,
      file: document.file,
      patientId: this.patientId,
      visitId: this.visitId,
      admissionId: this.admissionId
      
    }));

  this.documentService
    .uploadDocuments(
      this.patientId,
      this.uploadedBy,
      this.visitId,
      this.admissionId,
      requests
    )
    .subscribe({
      next: event => {
        this.handleProgress(
          event,
          pendingDocuments
        );
      },
      error: error => {
        console.error(
          'Bulk upload failed:',
          error
        );

        pendingDocuments.forEach(document => {
          this.setFailed(
            document,
            error?.error?.message ||
            'Upload failed. Please try again.'
          );
        });
      }
    });
}

  handleProgress(event: HttpEvent<any>, documents: DocumentItem[]): void {
    if (event.type === HttpEventType.UploadProgress) {
      const progress = event.total
        ? Math.round((event.loaded / event.total) * 100)
        : 0;

      documents.forEach(document => {
        document.status = 'uploading';
        document.progress = progress;
      });

      this.documents = [...this.documents];
      this.documentsChange.emit(this.documents);
      return;
    }

    if (event.type === HttpEventType.Response) {
      const response = event.body;

      if (response?.status !== 1 || !response?.data) {
        return;
      }

      const uploadedData = Array.isArray(response.data) ? response.data : [response.data];

      documents.forEach((document, index) => {
        const uploadedDocument = uploadedData[index];

        if (!uploadedDocument) {
          return;
        }

        document.status = 'uploaded';
        document.progress = 100;
        document.documentId = uploadedDocument.documentId;
        document.errorMessage = undefined;
      });

      this.documents = [...this.documents];
      this.documentsChange.emit(this.documents);
      this.uploaded.emit([...documents]);
    }
  }

  deleteDocument(document: DocumentItem, index: number): void {
    if (document.status === 'uploading') {
      return;
    }

    this.documents = this.documents.filter((_, currentIndex) => currentIndex !== index);
    this.deleted.emit(document);
    this.emitChange();
  }

  deleteAll(): void {
    this.documents = this.documents.filter(document => document.status === 'uploaded');
    this.emitChange();
  }

  private setUploading(document: DocumentItem): void {
    document.status = 'uploading';
    document.progress = 0;
    document.errorMessage = undefined;
    this.emitChange();
  }

  private setFailed(document: DocumentItem, message: string): void {
    document.status = 'failed';
    document.progress = 0;
    document.errorMessage = message;
    this.emitChange();
  }

  private emitChange(): void {
    this.documents = [...this.documents];
    this.documentsChange.emit(this.documents);
  }

  private generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private validateFile(file: File): { valid: boolean; message?: string } {
    if (!file) {
      return {
        valid: false,
        message: 'No file selected.'
      };
    }

    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        message: `${file.name} exceeds the 10 MB limit.`
      };
    }

    const extension = `.${(file.name.split('.').pop() || '').toLowerCase()}`;

    if (!this.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        message: `${file.name} is not supported.`
      };
    }

    return { valid: true };
  }

  getStatusLabel(status: DocumentStatus): string {
    switch (status) {
      case 'uploaded':
        return 'Uploaded';
      case 'uploading':
        return 'Uploading';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  }

  getStatusSeverity(
    status: DocumentStatus
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'uploaded':
        return 'success';
      case 'uploading':
        return 'info';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getFileIcon(document: DocumentItem): string {
    const extension = document.fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'pi pi-image';
      case 'doc':
      case 'docx':
        return 'pi pi-file';
      default:
        return 'pi pi-file';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  hasPendingDocuments(): boolean {
    return this.documents.some(
      document =>
        document.file &&
        document.documentType &&
        document.status !== 'uploaded' &&
        document.status !== 'uploading'
    );
  } 

 viewDocument(document: DocumentItem): void {
  if (!document.file) {
    return;
  }

  if (this.viewDocumentUrl) {
    URL.revokeObjectURL(this.viewDocumentUrl);
  }

  this.viewDocumentUrl = URL.createObjectURL(document.file);

  this.safeDocumentUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(
      this.viewDocumentUrl
    );

  this.viewDocumentName = document.fileName;
  this.viewDocumentType = document.fileType;

  this.viewDialogVisible = true;
}

isImageFile(): boolean {
  return [
    'image/jpeg',
    'image/jpg',
    'image/png'
  ].includes(this.viewDocumentType);
}

isPdfFile(): boolean {
  return this.viewDocumentType === 'application/pdf';
}

isWordFile(): boolean {
  return [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ].includes(this.viewDocumentType);
}

getFileExtension(): string {
  return (
    this.viewDocumentName
      .split('.')
      .pop()
      ?.toLowerCase() || ''
  );
}

isWordDocument(): boolean {
  return ['doc', 'docx'].includes(
    this.getFileExtension()
  );
}

closeViewDocument(): void {
  this.viewDialogVisible = false;

  if (this.viewDocumentUrl) {
    URL.revokeObjectURL(this.viewDocumentUrl);
  }

  this.viewDocumentUrl = null;
  this.safeDocumentUrl = null;
  this.viewDocumentName = '';
  this.viewDocumentType = '';
}

openDocument(): void {
  if (!this.viewDocumentUrl) {
    return;
  }

  window.open(
    this.viewDocumentUrl,
    '_blank'
  );
}

hasUploadedDocuments(): boolean {
  return this.documents.some(
    document => document.status === 'uploaded'
  );
}
removeUploadedDocuments(): void {
  this.documents = this.documents.filter(
    document => document.status !== 'uploaded'
  );

  this.emitChange();
}

// --------------------------------------------
documentScopes = [
  { label: 'Personal', value: 'PERSONAL' },
  { label: 'Visit', value: 'VISIT' },
  { label: 'Admission', value: 'ADMISSION' }
];

selectedDocumentScope = '';

onDocumentScopeChange(): void {
  if (this.selectedDocumentScope === 'VISIT' && !this.visitId) {
    console.warn('Visit ID is not available.');
  }

  if (this.selectedDocumentScope === 'ADMISSION' && !this.admissionId) {
    console.warn('Admission ID is not available.');
  }
}

getDocumentScopes() {
  return [
    {
      label: 'Personal',
      value: 'PERSONAL'
    },
    {
      label: 'Visit',
      value: 'VISIT',
    },
    {
      label: 'Admission',
      value: 'ADMISSION',
    }
  ];
}
}
