import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { User, UserRole, UserStatus } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  searchTerm = '';

  showUserForm = false;
  userForm!: FormGroup;
  editingUser: User | null = null;
  formLoading = false;
  formError = '';

  selectedUser: User | null = null;
  showDeleteConfirm = false;
  deleteLoading = false;

  roles = Object.values(UserRole);
  statuses = Object.values(UserStatus);

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
  }

  initializeForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      userId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: [UserRole.GENERAL_USER, Validators.required],
      status: [UserStatus.ACTIVE, Validators.required],
      department: [''],
      organization: ['']
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.userId.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  openCreateForm(): void {
    this.editingUser = null;
    this.userForm.reset({
      role: UserRole.GENERAL_USER,
      status: UserStatus.ACTIVE
    });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserForm = true;
    this.formError = '';
  }

  openEditForm(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue(user);
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserForm = true;
    this.formError = '';
  }

  closeForm(): void {
    this.showUserForm = false;
    this.editingUser = null;
    this.userForm.reset();
    this.formError = '';
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.formLoading = true;
    this.formError = '';

    const formData = this.userForm.value;

    if (this.editingUser) {
      const updateData: any = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      this.adminService.updateUser(this.editingUser.id, updateData).subscribe({
        next: () => {
          this.formLoading = false;
          this.closeForm();
          this.loadUsers();
        },
        error: (error) => {
          this.formLoading = false;
          this.formError = error.error?.message || 'Failed to update user';
        }
      });
    } else {
      this.adminService.createUser(formData).subscribe({
        next: () => {
          this.formLoading = false;
          this.closeForm();
          this.loadUsers();
        },
        error: (error) => {
          this.formLoading = false;
          this.formError = error.error?.message || 'Failed to create user';
        }
      });
    }
  }

  confirmDelete(user: User): void {
    this.selectedUser = user;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.selectedUser = null;
    this.showDeleteConfirm = false;
  }

  deleteUser(): void {
    if (!this.selectedUser) return;

    this.deleteLoading = true;
    this.adminService.deleteUser(this.selectedUser.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.cancelDelete();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.deleteLoading = false;
      }
    });
  }

  viewUserDetail(user: User): void {
    // Navigate to user detail view or open modal
    console.log('View user detail:', user);
  }
}
