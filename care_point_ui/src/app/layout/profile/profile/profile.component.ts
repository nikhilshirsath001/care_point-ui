import { Component } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-profile',
  imports: [Avatar,Tag,Divider],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user:any;
}
