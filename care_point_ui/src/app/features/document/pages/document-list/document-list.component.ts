import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { DocumentService } from '../../services/document.service';
import { PatientDocument } from './document.model';
import { DOCUMENT_DATE_OPTIONS, DOCUMENT_SORT_OPTIONS, DOCUMENT_TYPES } from '../../model/document-type.config';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    TagModule,
    DialogModule,
    TooltipModule,
    InputTextModule
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnChanges {
  @Input({ required: true })
  recordType!: 'PATIENT' | 'VISIT' | 'ADMISSION';

  @Input({ required: true })
  recordId!: number;

  @Input({ required: true })
  patientId!: number;

  allDocuments: PatientDocument[] = [];
  filteredDocuments: PatientDocument[] = [];
  loading = false;

  viewMode: 'list' | 'grid' = 'grid';

  searchText = '';
  selectedCategory: string | null = null;
  selectedDate: string | null = null;
  selectedSort = 'newest';
  selectedSensitive: string | null = null;

  previewVisible = false;
  previewDocument: PatientDocument | null = null;
  previewUrl: SafeResourceUrl | null = null;
  private previewBlobUrl: string | null = null;

  categories = DOCUMENT_TYPES;

  dateOptions = DOCUMENT_DATE_OPTIONS;

  sortOptions = DOCUMENT_SORT_OPTIONS;

  verifiedOptions = [
    {
      label: 'All Documents',
      value: null
    },
    {
      label: 'Verified',
      value: 'true'
    },
    {
      label: 'Non-verified',
      value: 'false'
    }
  ];

  constructor(
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    
    this.resetFilters();

    if (
      changes['recordId'] ||
      changes['recordType'] ||
      changes['patientId']
    ) {
      if (this.recordId && this.patientId) {
        this.loadDocuments();
      }
    }
  }

  loadDocuments(): void {
    this.loading = true;
    this.allDocuments = [];
    if (this.recordType === 'PATIENT') {
      this.documentService
        .getDocumentsByPatientId(this.patientId)
        .subscribe({
          next: (response: any) => {

            this.allDocuments = this.extractDocuments(
              response?.data ?? response
            );
            // console.log('Documents loaded:', this.allDocuments);

            this.filteredDocuments = [...this.allDocuments];
            this.applyFilters();
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Failed to load saved documents:', error);
            this.allDocuments = [];
            this.filteredDocuments = [];
            this.loading = false;
          }
        });

      return;
    }

    this.loading = false;
  }

  private extractDocuments(response: any): PatientDocument[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.result)) {
      return response.result;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    return [];
  }

  applyFilters(): void {
    let documents = [...this.allDocuments];

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase().trim();

      documents = documents.filter(
        doc =>
          (doc.fileName || '').toLowerCase().includes(search) ||
          (doc.documentType || '').toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory) {
      documents = documents.filter(
        doc => doc.documentType === this.selectedCategory
      );
    }

    if (this.selectedSensitive !== null) {
      const sensitive = this.selectedSensitive === 'true';

      documents = documents.filter(
        doc => Boolean(doc.sensitive) === sensitive
      );
    }

    if (this.selectedDate) {
      documents = documents.filter(doc =>
        this.isWithinDateRange(doc, this.selectedDate!)
      );
    }

    documents.sort((a, b) => this.compareDocuments(a, b));
    this.filteredDocuments = documents;
  }

  onSearch(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedCategory = null;
    this.selectedDate = null;
    this.selectedSort = 'newest';
    this.selectedSensitive = null;
    this.applyFilters();
  }

  private isWithinDateRange(
    doc: PatientDocument,
    range: string
  ): boolean {
    const value = doc.uploadedAt || doc.createdAt || doc.uploadDate;

    if (!value) {
      return false;
    }

    const documentDate = new Date(value);
    const now = new Date();

    if (range === 'today') {
      return documentDate.toDateString() === now.toDateString();
    }

    const days = range === '7days' ? 7 : 30;
    const fromDate = new Date();

    fromDate.setDate(now.getDate() - days);

    return documentDate >= fromDate;
  }

  private compareDocuments(
    a: PatientDocument,
    b: PatientDocument
  ): number {
    switch (this.selectedSort) {
      case 'nameAsc':
        return (a.fileName || '').localeCompare(b.fileName || '');

      case 'nameDesc':
        return (b.fileName || '').localeCompare(a.fileName || '');

      case 'sizeDesc':
        return (b.fileSize || 0) - (a.fileSize || 0);

      case 'sizeAsc':
        return (a.fileSize || 0) - (b.fileSize || 0);

      case 'oldest':
        return this.getDateValue(a) - this.getDateValue(b);

      case 'newest':
      default:
        return this.getDateValue(b) - this.getDateValue(a);
    }
  }

  private getDateValue(doc: PatientDocument): number {
    const value = doc.uploadedAt || doc.createdAt || doc.uploadDate;

    return value ? new Date(value).getTime() : 0;
  }

  get documentCount(): number {
    return this.allDocuments.length;
  }

  getDocumentTypeLabel(type: string): string {
    const category = this.categories.find(item => item.value === type);

    return category?.label || type || 'Other';
  }

  getFileSize(size?: number): string {
    if (!size) {
      return '-';
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  getDocumentDate(doc: PatientDocument): string {
    const value = doc.uploadedAt || doc.createdAt || doc.uploadDate;

    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleDateString();
  }

  isVerified(doc: PatientDocument): boolean {
    return Boolean(doc.verified);
  }

  getFileIcon(doc: PatientDocument): string {
    const type = (doc.fileType || '').toLowerCase();

    if (type.includes('pdf')) {
      return 'pi pi-file-pdf';
    }

    if (type.includes('image')) {
      return 'pi pi-image';
    }

    if (type.includes('word') || type.includes('document')) {
      return 'pi pi-file-word';
    }

    return 'pi pi-file';
  }

  getPreviewType(
    doc: PatientDocument
  ): 'image' | 'pdf' | 'other' {
    const type = (doc.fileType || '').toLowerCase();

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

  preview(doc: any): void {
    console.log('Preview document:', doc);

    this.documentService
      .downloadDocument(doc.documentId)
      .subscribe({
        next: (blob: Blob) => {
          console.log('Preview blob:', blob);
          console.log('Blob type:', blob.type);
          console.log('Blob size:', blob.size);

          if (!blob || blob.size === 0) {
            console.error('Empty document received');
            return;
          }

          this.clearPreviewUrl();

          this.previewBlobUrl = URL.createObjectURL(blob);

          this.previewDocument = {
            ...doc,
            fileType: blob.type || doc.fileType
          };

          this.previewUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              this.previewBlobUrl
            );

          this.previewVisible = true;
        },
        error: (error: any) => {
          console.error('Document preview failed:', error);
        }
      });
  }

  closePreview(): void {
    this.previewVisible = false;
    this.previewDocument = null;
    this.clearPreviewUrl();
    this.resetFilters();
  }

  private clearPreviewUrl(): void {
    if (this.previewBlobUrl) {
      URL.revokeObjectURL(this.previewBlobUrl);
      this.previewBlobUrl = null;
    }

    this.previewUrl = null;
  }

  download(doc: any): void {
    console.log('Download document:', doc);

    this.documentService
      .downloadDocument(doc.documentId)
      .subscribe({
        next: (blob: Blob) => {
          console.log('Download blob:', blob);

          if (!blob || blob.size === 0) {
            console.error('Empty document received');
            return;
          }

          const url = URL.createObjectURL(blob);
          const anchor = window.document.createElement('a');

          anchor.href = url;
          anchor.download = doc.fileName || `document-${doc.id}`;

          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        },
        error: (error: any) => {
          console.error('Document download failed:', error);
        }
      });
  }
}
