import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PatientDocument, PatientInfo } from '../../models/patient-document.model';
import { DocumentService } from '../../services/document.service';
import { PatientSearchComponent, PatientSearchConfig } from '../../../../shared/patient-search/patient-search.component';
import { PatientService } from '../../../patient/services/patient-service.service';
import { PatientDocumentUploadComponent } from '../patient-document-upload/patient-document-upload.component';

@Component({
  selector: 'app-patient-document-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    PatientSearchComponent,
    PatientDocumentUploadComponent,
  Dialog
  ],
  templateUrl: './patient-document-management.component.html',
  styleUrl: './patient-document-management.component.css'
})
export class PatientDocumentManagementComponent implements OnInit, OnChanges {
  @Input({ required: true }) patientId!: number;
  @Input() patient: PatientInfo | null = null;
  @Input({ required: true }) uploadedBy!: number;
  @Input() canProfileShow: boolean = true;
  @ViewChild('uploadInput') uploadInput!: ElementRef<HTMLInputElement>;

  private documentService = inject(DocumentService);
  private patientService = inject(PatientService);
  private sanitizer = inject(DomSanitizer);

  allDocuments: PatientDocument[] = [];
  // filteredDocuments = signal<PatientDocument[]>([]);
  filteredDocuments: PatientDocument[] = [];
  loading = false;
  viewMode: 'grid' | 'list' = 'grid';

  searchText = '';
  filterCategory: string | null = null;
  uploadCategory: string | null = null;
  selectedDate: string | null = null;
  selectedSort = 'newest';
  selectedSensitive: string | null = null;

  previewVisible = false;
  previewDocument: PatientDocument | null = null;
  previewUrl: SafeResourceUrl | null = null;
  private previewBlobUrl: string | null = null;

  loggedInUserId = 1;

  showPatientSearch = false;
  showDocumentUploade = false;

  isSearchVisible() {
    this.showPatientSearch = !this.showPatientSearch;
  }

  isDocumentUploadeVisible() {
    this.showDocumentUploade = !this.showDocumentUploade;
  }

  categoryOptions = [
    { label: 'All Categories', value: null },
    { label: 'Lab Reports', value: 'LAB_REPORT' },
    { label: 'Imaging', value: 'IMAGING' },
    { label: 'Prescription', value: 'PRESCRIPTION' },
    { label: 'Discharge Summary', value: 'DISCHARGE_SUMMARY' },
    { label: 'Other', value: 'OTHER' }
  ];

  uploadCategoryOptions = this.categoryOptions.filter(option => option.value !== null);

  dateOptions = [
    { label: 'All Dates', value: null },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' }
  ];

  sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Name A-Z', value: 'nameAsc' },
    { label: 'Name Z-A', value: 'nameDesc' }
  ];

  verifiedOptions = [
    { label: 'All Documents', value: null },
    { label: 'Verified', value: 'verified' },
    { label: 'Non-Verified', value: 'nonVerified' }
  ];

  categoryDialogVisible = false;
  selectedDocument: PatientDocument | null = null;
  selectedDocumentCategory: string | null = null;
  deleteDialogVisible = false;
  replaceDialogVisible = false;
  replaceDocument: PatientDocument | null = null;
  replacementFile: File | null = null;

  
  ngOnInit(): void {
    this.firstCall();
  }

   ngOnChanges(changes: SimpleChanges): void {
    
    this.resetFilters();
    if (
      changes['patientId']
    ) {
      if (this.patientId) {
        this.firstCall();
      }
    }
  }

   firstCall(): void {
    if (this.patientId) {
      this.loadDocuments();
      this.patientService.getPatientByPatientId(this.patientId).subscribe({
        next: (response: any) => {
          this.patient = response.data?.[0];
        },
        error: (error) => {
          console.error('Failed to load patient', error);
        }
      });
    }
  }

  loadDocuments(): void {
    if (!this.patientId) return;

    this.loading = true;

    this.documentService.getDocumentsByPatientId(this.patientId).subscribe({
      next: (response: any) => {
        this.allDocuments = this.extractDocuments(response?.data ?? response);
        this.applyFilters();
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Failed to load patient documents:', error);
        this.allDocuments = [];
        this.filteredDocuments = [];
        this.loading = false;
      }
    });
  }

  private extractDocuments(response: any): PatientDocument[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.result)) return response.result;
    if (Array.isArray(response?.content)) return response.content;
    return [];
  }

  applyFilters(): void {
    let documents = [...this.allDocuments];
    const search = this.searchText.trim().toLowerCase();

    if (search) {
      documents = documents.filter(doc =>
        (doc.fileName || '').toLowerCase().includes(search) ||
        this.getCategoryLabel(doc.documentType).toLowerCase().includes(search)
      );
    }

    if (this.filterCategory) {
      documents = documents.filter(doc => doc.documentType === this.filterCategory);
    }

    if (this.selectedDate) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (this.selectedDate === '7days') start.setDate(start.getDate() - 6);
      if (this.selectedDate === '30days') start.setDate(start.getDate() - 29);

      documents = documents.filter(doc => {
        const value = doc.uploadedAt || doc.createdAt || doc.uploadDate;
        if (!value) return false;

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return false;

        if (this.selectedDate === 'today') {
          return date >= start && date < new Date(start.getTime() + 86400000);
        }

        return date >= start && date <= now;
      });
    }

    if (this.selectedSensitive === 'verified') {
      documents = documents.filter(doc => doc.verified === true);
    } else if (this.selectedSensitive === 'nonVerified') {
      documents = documents.filter(doc => doc.verified !== true);
    }

    this.filteredDocuments = this.sortDocuments(documents);
  }

  private sortDocuments(documents: PatientDocument[]): PatientDocument[] {
    return documents.sort((a, b) => {
      if (this.selectedSort === 'nameAsc') {
        return (a.fileName || '').localeCompare(b.fileName || '');
      }

      if (this.selectedSort === 'nameDesc') {
        return (b.fileName || '').localeCompare(a.fileName || '');
      }

      const dateA = new Date(a.uploadedAt || a.createdAt || a.uploadDate || 0).getTime();
      const dateB = new Date(b.uploadedAt || b.createdAt || b.uploadDate || 0).getTime();

      return this.selectedSort === 'oldest' ? dateA - dateB : dateB - dateA;
    });
  }

  resetFilters(): void {
    this.searchText = '';
    this.filterCategory = null;
    this.selectedDate = null;
    this.selectedSort = 'newest';
    this.selectedSensitive = null;
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  getCategoryLabel(type: string): string {
    return this.categoryOptions.find(item => item.value === type)?.label || type || 'Other';
  }

  getFileSize(size?: number): string {
    if (!size) return '0 KB';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  getDocumentDate(doc: PatientDocument): string {
    const value = doc.uploadedAt || doc.createdAt || doc.uploadDate;
    if (!value) return '-';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? '-'
      : date.toLocaleDateString('en-GB');
  }

  getDocumentIcon(doc: PatientDocument): string {
    const type = doc.fileType?.toLowerCase() || '';
    const name = doc.fileName?.toLowerCase() || '';

    if (
      type.startsWith('image/') ||
      /\.(png|jpe?g|gif|webp)$/.test(name)
    ) {
      return 'pi pi-image';
    }

    if (
      type === 'application/pdf' ||
      name.endsWith('.pdf')
    ) {
      return 'pi pi-file-pdf';
    }

    return 'pi pi-file';
  }

  openUploadPicker(): void {
    if (!this.uploadCategory) {
      console.error('Select an upload category first.');
      return;
    }

    this.uploadInput.nativeElement.click();
  }

  onUploadFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.uploadCategory) return;

    const request = {
      id: `${Date.now()}`,
      documentType: this.uploadCategory,
      file,
      patientId: this.patientId,
      visitId: null,
      admissionId: null
    };

    this.documentService
      .uploadDocument(
        this.patientId,
        this.uploadedBy,
        null,
        null,
        request
      )
      .subscribe({
        next: () => {
          input.value = '';
          this.uploadCategory = null;
          this.loadDocuments();
        },
        error: (error: unknown) => {
          console.error('Document upload failed:', error);
          input.value = '';
        }
      });
  }

  preview(doc: any): void {
    if (!doc?.documentId) {
      console.error('Document ID is missing.');
      return;
    }

    this.clearPreviewUrl();

    this.previewDocument = null;
    this.previewVisible = false;

    this.documentService
      .downloadDocument(doc.documentId)
      .subscribe({
        next: (blob: Blob) => {
          if (!blob || blob.size === 0) {
            console.error('The document download returned an empty file.');
            return;
          }

          const fileType =
            blob.type || this.getMimeType(doc.fileName);

          const previewBlob =
            blob.type
              ? blob
              : new Blob([blob], { type: fileType });

          this.previewBlobUrl =
            URL.createObjectURL(previewBlob);

          this.previewUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              this.previewBlobUrl
            );

          this.previewDocument = {
            ...doc,
            fileType
          };

          this.previewVisible = true;
        },
        error: (error: unknown) => {
          console.error('Document preview failed:', error);
        }
      });
  }

  private getMimeType(fileName?: string): string {
    const name = (fileName || '').toLowerCase();

    if (name.endsWith('.pdf')) {
      return 'application/pdf';
    }

    if (name.endsWith('.png')) {
      return 'image/png';
    }

    if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
      return 'image/jpeg';
    }

    if (name.endsWith('.gif')) {
      return 'image/gif';
    }

    if (name.endsWith('.webp')) {
      return 'image/webp';
    }

    if (name.endsWith('.txt')) {
      return 'text/plain';
    }

    if (name.endsWith('.csv')) {
      return 'text/csv';
    }

    return 'application/octet-stream';
  }

  getPreviewType(
    doc: PatientDocument | null
  ): 'image' | 'pdf' | 'other' {
    if (!doc) {
      return 'other';
    }

    const type = (
      doc.fileType ||
      this.getMimeType(doc.fileName)
    ).toLowerCase();

    if (type.startsWith('image/')) {
      return 'image';
    }

    if (type === 'application/pdf') {
      return 'pdf';
    }

    const fileName = (doc.fileName || '').toLowerCase();

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
    if (!this.previewBlobUrl) {
      return;
    }

    const newWindow = window.open(
      this.previewBlobUrl,
      '_blank'
    );

    if (!newWindow) {
      const link = document.createElement('a');

      link.href = this.previewBlobUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  closePreview(): void {
    this.previewVisible = false;
    this.previewDocument = null;
    this.clearPreviewUrl();
  }

  private clearPreviewUrl(): void {
    if (this.previewBlobUrl) {
      URL.revokeObjectURL(this.previewBlobUrl);
      this.previewBlobUrl = null;
    }

    this.previewUrl = null;
  }

  updateCategory(doc: PatientDocument): void {
    this.selectedDocument = doc;
    this.selectedDocumentCategory = doc.documentType;
    this.categoryDialogVisible = true;
  }

  saveCategory(): void {
    if (!this.selectedDocument || !this.selectedDocumentCategory) return;

    this.selectedDocument.documentType = this.selectedDocumentCategory;
    this.categoryDialogVisible = false;
    this.applyFilters();
    // this.documentService.updateDocument(this.selectedDocument,this.selectedDocument.documentId)

  }

  verifyDocument(doc: PatientDocument): void {
  this.documentService
    .verifyDocument(doc.documentId, true)
    .subscribe({
      next: (response: any) => {
         this.loadDocuments();
      },
      error: (error: any) => {
        console.error('Failed to verify document', error);
      }
    });
}

  onReplacementFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.replacementFile = input.files?.[0] || null;
  }

  confirmReplace(): void {
    if (!this.replaceDocument || !this.replacementFile) return;

    console.error(
      'Replace requires a backend replacement endpoint in DocumentService.'
    );
  }

  delete(doc: PatientDocument): void {
    this.selectedDocument = doc;
    this.deleteDialogVisible = true;
  }

  confirmDelete(): void {
    if (!this.selectedDocument) return;

    // console.log(this.selectedDocument.documentId);
    this.documentService
      .deleteDocument(this.selectedDocument.documentId)
      .subscribe({
        next: () => {
          this.allDocuments = this.allDocuments.filter(
            doc => doc.documentId !== this.selectedDocument?.documentId
          );

          this.applyFilters();
          this.deleteDialogVisible = false;
          this.selectedDocument = null;
        },
        error: (error: unknown) =>
          console.error('Document delete failed:', error)
      });
  }

  get patientName(): string {
    if (!this.patient) return '';

    if (this.patient.fullName) {
      return this.patient.fullName;
    }

    return [
      this.patient.firstName,
      this.patient.lastName
    ]
      .filter(Boolean)
      .join(' ');
  }

  get patientAge(): string {
    if (this.patient?.age !== undefined) {
      return `${this.patient.age} Years`;
    }

    if (!this.patient?.dateOfBirth) {
      return '-';
    }

    const birthDate = new Date(this.patient.dateOfBirth);
    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const month =
      today.getMonth() -
      birthDate.getMonth();

    if (
      month < 0 ||
      (
        month === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    return `${age} Years`;
  }

  readonly searchPatientFn = (keyword: string) =>
    this.patientService.searchPatientByKeyword(keyword);
 
  readonly patientSearchConfig: PatientSearchConfig = {
    title: 'Find Patient',
    description:
      'Search for an existing patient using Patient ABHA ID, name or mobile number.',
    placeholder:
      'Enter Patient ABHA ID, name or mobile number',
    searchButtonLabel: 'Search Patient',
    selectButtonLabel: 'Select Patient'
  };

  onPatientSelected(patient: any): void {
    if (!patient?.patientId) return;

    this.patient = patient;
    this.patientId = patient.patientId;
    this.loadDocuments();
    this.showPatientSearch = false;
  }

  closePatientSearch() {
    this.showPatientSearch = false;
  }
}