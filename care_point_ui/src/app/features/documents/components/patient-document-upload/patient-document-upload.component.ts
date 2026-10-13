import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { finalize, single } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DocumentService, DocumentUploadRequest } from '../../services/document.service';
import { Dialog } from 'primeng/dialog';
import { VisitService } from '../../../visit/services/visit.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedTableComponent, SharedTableConfig, TableColumn } from '../../../../shared/shared-table/shared-table.component';
import { TableModule } from 'primeng/table';
import { ADMISSION_COLUMNS, VISIT_COLUMNS } from '../../models/document-table.config';

type DocumentContext = 'Personal' | 'Visit' | 'Admission';
type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

interface UploadCategory {
  label: string;
  value: string;
}

interface UploadFileItem {
  id: string;
  file: File;
  category: string;
  status: UploadStatus;
  error?: string;
}

interface RelatedRecord {
  id: number;
  date?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-patient-document-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    Dialog,
    SharedTableComponent,
    TableModule
],
  templateUrl: './patient-document-upload.component.html',
  styleUrl: './patient-document-upload.component.css'
})
export class PatientDocumentUploadComponent implements OnChanges {
  private readonly documentService = inject(DocumentService);

  @Input({ required: true}) patientId!: number;
  @Input({ required: true }) uploadedBy!: number;
  @Input() visitId: number | null = null;
  @Input() admissionId: number | null = null;
  @Input() abhaId: number | null = null;

  @Output() uploaded = new EventEmitter<void>();

  private readonly visitService = inject(VisitService);

  selectedRecord: RelatedRecord | null = null;
  recordDialogVisible = false;
  recordSearch = '';
  loadingRecords = false;
  recordColumns:TableColumn[] | [] = [];
  context: DocumentContext = 'Personal';
  
  existingRecords = signal<any[]>([]);
  page:number =0;
  size:number =20 ;
  totalPages = 0;
  totalRecords = 0;

    tableConfig: SharedTableConfig = {
      searchable: true,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50, 100],
      // exportable: true,
      // showRefresh: true,
      loading: false,
      emptyMessage: 'No Rocord found',
    };

  contextOptions = [
    { label: 'Personal', value: 'Personal' },
    { label: 'Visit', value: 'Visit' },
    { label: 'Admission', value: 'Admission' }
  ];

  readonly categoryConfig: Record<DocumentContext, UploadCategory[]> = {
    Personal: [
      { label: 'Aadhaar Card', value: 'AADHAAR' },
      { label: 'PAN Card', value: 'PAN' }
    ],
    Visit: [
      { label: 'Lab Report', value: 'LAB_REPORT' },
      { label: 'Imaging', value: 'IMAGING' },
      { label: 'Prescription', value: 'PRESCRIPTION' },
      { label: 'Other', value: 'OTHER' }
    ],
    Admission: [
      { label: 'Discharge Summary', value: 'DISCHARGE_SUMMARY' },
      { label: 'Lab Report', value: 'LAB_REPORT' },
      { label: 'Imaging', value: 'IMAGING' },
      { label: 'Other', value: 'OTHER' }
    ]
  };

  files: UploadFileItem[] = [];
  uploadingAll = false;
  message = '';

  previewUrl: SafeResourceUrl | null = null;
  previewObjectUrl: string | null = null;
  previewName = '';
  previewFileType = '';
  previewVisible = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedRecord = {
      id: Number(this.visitId || this.admissionId)
    };

    if (
      changes['patientId'] ||
      changes['visitId'] ||
      changes['admissionId']
    ) {
      this.setContextFromInputs();
    }
  }

  onSelectRecord(record: RelatedRecord): void {
  const recordId = record?.['visitId'] ?? record.id;
 
  this.selectRecord({
    ...record,
    id: Number(recordId)
  });
}
  get categories(): UploadCategory[] {
    return this.categoryConfig[this.context];
  }

  get selectedRecordId(): number | null {
    if (this.context === 'Visit') return this.visitId;
    if (this.context === 'Admission') return this.admissionId;
    return null;
  }

  get canUploadAll(): boolean {
    return this.files.some(
      file =>
        file.status === 'pending' ||
        file.status === 'failed'
    );
  }

  private setContextFromInputs(): void {
    if (this.visitId != null) {
      this.context = 'Visit';
    } else if (this.admissionId != null) {
      this.context = 'Admission';
    } else {
      this.context = 'Personal';
    }

    this.files = [];
    this.message = '';
  }

  // onContextChange(context: DocumentContext): void {
  //   if(context === 'Visit'){
  //     this.recordColumns = VISIT_COLUMNS;
  //   this.visitService.getVisitsByPatientId(this.patientId,this.page,this.size).subscribe({
  //           next: (response: any) => {

  //             const visits =
  //               response?.data?.content ??
  //               response?.data ??
  //               response ??
  //               [];
  //               console.log(visits);
  //               this.existingRecords.set( Array.isArray(visits) ? visits : []);
                
  //           },
  //           error:(err) =>{
              
  //           },
  //         });
  //       }
  //     else if(context === 'Admission'){
  //       this.recordColumns = ADMISSION_COLUMNS;
  //     }
  //     else{
  //       this.recordColumns = [];
  //     }
  //   this.context = context;
  //   this.selectedRecord = null;
  //   this.recordSearch = '';
  //   this.recordDialogVisible = context !== 'Personal';
  //   this.message = '';
  // }


  selectRecord(record: RelatedRecord): void {
    
    this.selectedRecord = record;
    this.recordDialogVisible = false;
    this.recordSearch = '';
    this.message = '';
  }

  onFilesSelected(event: Event, category: string): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    for (const file of Array.from(input.files)) {
      this.files.push({
        id: this.createId(),
        file,
        category,
        status: 'pending'
      });
    }

    input.value = '';
    this.message = '';
  }

  removeFile(id: string): void {
    this.files = this.files.filter(file => file.id !== id);
  }

  previewFile(item: UploadFileItem): void {
    this.closePreview();

    const file = item.file;

    if (!file) {
      return;
    }

    this.previewName = file.name;
    this.previewFileType = (
      file.type ||
      this.getMimeType(file.name)
    ).toLowerCase();

    this.previewObjectUrl = URL.createObjectURL(file);

    this.previewUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(
        this.previewObjectUrl
      );

    const previewType = this.getPreviewType();

    if (previewType === 'image' || previewType === 'pdf') {
      this.previewVisible = true;
      return;
    }

    this.openDocumentInNewTab();
  }

  getPreviewType(): 'image' | 'pdf' | 'other' {
    const type = (
      this.previewFileType ||
      this.getMimeType(this.previewName)
    ).toLowerCase();

    if (type.startsWith('image/')) {
      return 'image';
    }

    if (type === 'application/pdf') {
      return 'pdf';
    }

    const fileName = this.previewName.toLowerCase();

    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.webp')
    ) {
      return 'image';
    }

    if (fileName.endsWith('.pdf')) {
      return 'pdf';
    }

    return 'other';
  }

  openDocumentInNewTab(): void {
    if (!this.previewObjectUrl) {
      return;
    }

    const newWindow = window.open(
      this.previewObjectUrl,
      '_blank'
    );

    if (!newWindow) {
      const link = document.createElement('a');

      link.href = this.previewObjectUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  downloadPreview(): void {
    if (!this.previewObjectUrl || !this.previewName) {
      return;
    }

    const link = document.createElement('a');

    link.href = this.previewObjectUrl;
    link.download = this.previewName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getMimeType(fileName: string): string {
    const name = (fileName || '').toLowerCase();

    if (name.endsWith('.pdf')) {
      return 'application/pdf';
    }

    if (name.endsWith('.png')) {
      return 'image/png';
    }

    if (
      name.endsWith('.jpg') ||
      name.endsWith('.jpeg')
    ) {
      return 'image/jpeg';
    }

    if (name.endsWith('.gif')) {
      return 'image/gif';
    }

    if (name.endsWith('.webp')) {
      return 'image/webp';
    }

    if (name.endsWith('.doc')) {
      return 'application/msword';
    }

    if (name.endsWith('.docx')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    return 'application/octet-stream';
  }

  closePreview(): void {
    this.previewVisible = false;

    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }

    this.previewUrl = null;
    this.previewName = '';
    this.previewFileType = '';
  }

  filesFor(category: string): UploadFileItem[] {
    return this.files.filter(file => file.category === category);
  }

  isCategoryUploading(
    category: string,
    status: string
  ): boolean {
    return this.files.some(
      file =>
        category !== ''
          ? (
              file.category === category &&
              file.status === status
            )
          : file.status === status
    );
  }

  showUploadButton(category: string): boolean {
    return this.filesFor(category).some(
      file =>
        file.status === 'pending' ||
        file.status === 'failed'
    );
  }

  uploadCategory(category: string): void {
    const pendingDocuments = this.files.filter(
      file =>
        file.category === category &&
        (
          file.status === 'pending' ||
          file.status === 'failed'
        )
    );

    this.uploadItems(pendingDocuments);
  }

  uploadAll(): void {
    const pendingDocuments = this.files.filter(
      file =>
        file.status === 'pending' ||
        file.status === 'failed'
    );

    this.uploadItems(pendingDocuments);
  }

  private uploadItems(items: UploadFileItem[]): void {
    if (
      this.patientId == null ||
      this.uploadedBy == null
    ) {
      this.message =
        'Patient or logged-in user information is missing.';
      return;
    }

    if (!items.length || this.uploadingAll) return;

    if (
      this.context !== 'Personal' &&
      !this.selectedRecord
    ) {
      this.message =
        `Select a ${this.context.toLowerCase()} before uploading.`;
      this.recordDialogVisible = true;
      return;
    }

    const visitId =
      this.context === 'Visit'
        ? this.selectedRecord!.id
        : null;

    const admissionId =
      this.context === 'Admission'
        ? (this.selectedRecord!.id | this.selectedRecord?.['admissionId'])
        : null;

    this.uploadingAll = true;
    this.message = '';

    items.forEach(item => {
      item.status = 'uploading';
      item.error = undefined;
    });

    const requests: DocumentUploadRequest[] =
      items.map(item => ({
        id: item.id,
        documentType: item.category,
        file: item.file,
        patientId: this.patientId,
        visitId,
        admissionId
      }));

    this.documentService
      .uploadDocuments(
        this.patientId,
        this.uploadedBy,
        visitId,
        admissionId,
        requests
      )
      .pipe(
        finalize(() => this.uploadingAll = false)
      )
      .subscribe({
        next: event => {
          if (
            event?.type === HttpEventType.Response ||
            event?.type === undefined
          ) {
            items.forEach(item => {
              item.status = 'uploaded';
              item.error = undefined;
            });

            this.message =
              `${items.length} file(s) uploaded successfully.`;

            this.uploaded.emit();
          }
        },
        error: error => {
          const errorMessage =
            error?.error?.message ||
            'Upload failed. Please try again.';

          items.forEach(item => {
            if (item.status === 'uploading') {
              item.status = 'failed';
              item.error = errorMessage;
            }
          });

          this.message = errorMessage;
        }
      });
  }

  removeUploaded(): void {
    const uploadedCount =
      this.files.filter(
        file => file.status === 'uploaded'
      ).length;

    if (!uploadedCount) {
      this.message =
        'No uploaded documents to remove.';
      return;
    }

    this.files = this.files.filter(
      file => file.status !== 'uploaded'
    );

    this.message =
      `${uploadedCount} uploaded file(s) removed from the list.`;
  }

  private createId(): string {
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
closeSerchRecord(){
   this.loadingRecords = false;
    this.message = '';
    this.recordSearch ='';
}
  searchRecord(): void {
    const id = this.recordSearch.trim();

    if (!id || this.loadingRecords) return;

    if (!/^\d+$/.test(id)) {
      this.message =
        `Enter a valid ${this.context} ID.`;
      return;
    }

    this.loadingRecords = true;
    this.message = '';
    this.selectedRecord = null;

    const request$ =
      this.context === 'Visit'
        ? this.visitService.getVisitById(Number(id))
        : this.visitService.getAdmissionsByPatientOrAbhaId(Number(id),undefined);

    request$
      .pipe(
        finalize(() => this.loadingRecords = false)
      )
      .subscribe({
        next: (response: any) => {
          const record =
            response?.data ??
            response?.result ??
            response;
            
          const recordId =
            this.context === 'Visit'
              ? record?.visitId ?? record?.id
              : record?.admissionId ?? record?.id;

          const recordPatientId =
            record?.patientId ??
            record?.patient?.id;

          if (
            recordId == null ||
            Number(recordId) !== Number(id)
          ) {
            this.message =
              `${this.context} not found.`;
            return;
          }

          if (
            recordPatientId == null ||
            Number(recordPatientId) !==
              Number(this.patientId)
          ) {
            this.message =
              `This ${this.context.toLowerCase()} does not belong to the selected patient.`;
            return;
          }

          this.selectRecord({
            ...record,
            id: Number(recordId)
          });
        },
        error: () => {
          this.selectedRecord = null;
          this.message =
            `${this.context} not found or search failed.`;
        }
      });
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  onRecordPageChange(event: any): void {
  const pageSize = event.rows ?? this.size;
  const pageIndex = Math.floor(
    (event.first ?? 0) / pageSize
  );

  if (
    pageIndex === this.page &&
    pageSize === this.size
  ) {
    return;
  }

  this.page = pageIndex;
  this.size = pageSize;

  this.loadRecords(this.page, this.size);
}
  private loadRecords(page: number, size: number): void {
  if (this.context === 'Personal') {
    this.existingRecords.set([]);
    return;
  }

  this.loadingRecords = true;

  const request$ =
    this.context === 'Visit'
      ? this.visitService.getVisitsByPatientId(
          this.patientId,
          page,
          size
        )
      : this.visitService.getAdmissionsByPatientOrAbhaId(
          this.patientId,
          undefined,
          page,
          size
        );

  request$
    .pipe(
      finalize(() => {
        this.loadingRecords = false;
      })
    )
    .subscribe({
      next: (response: any) => {
        const result = response?.data;

        this.existingRecords.set(
          Array.isArray(result?.content)
            ? result.content
            : []
        );

        this.page = result?.page ?? page;
        this.size = result?.size ?? size;
        this.totalPages = result?.totalPages ?? 0;
        this.totalRecords = result?.totalElements ?? 0;
      },
      error: () => {
        this.existingRecords.set([]);
        this.totalRecords = 0;
        this.totalPages = 0;
        this.message = `Failed to load ${this.context.toLowerCase()} records.`;
      }
    });
}
onContextChange(context: DocumentContext): void {
  this.context = context;
  this.selectedRecord = null;
  this.recordSearch = '';
  this.message = '';

  this.page = 0;
  this.size = 20;
  this.totalPages = 0;
  this.totalRecords = 0;

  this.existingRecords.set([]);

  if (context === 'Visit') {
    this.recordColumns = VISIT_COLUMNS;
  } else if (context === 'Admission') {
    this.recordColumns = ADMISSION_COLUMNS;
  } else {
    this.recordColumns = [];
  }

  this.recordDialogVisible = context !== 'Personal';

  if (context !== 'Personal') {
    this.loadRecords(0, this.size);
  }
}
}