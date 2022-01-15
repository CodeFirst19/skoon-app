import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';
import { UserViewComponent } from '../user-view/user-view.component';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;

  users: User[] = [];
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = [
    'username',
    'email',
    'phone',
    'address',
    'role',
    'servicesRequested',
    'viewMore',
  ];
  private userSubscription: Subscription;
  //DOM Rendering
  numUsers: number;
  //For pagination
  totalUsers: number = 0;
  limit: number = 5;
  page: number = 1;
  pageSizeOptions: number[] = [3, 5, 10, 25, 50];
  searchKey: string = '';

  @ViewChild(MatSort) sort: MatSort;

  errorMsg: string;
  private errorSubscription: Subscription;

  isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private _liveAnnouncer: LiveAnnouncer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers(this.page, this.limit);
    this.isLoading = true;
    this.userSubscription = this.userService
      .getUsersUpdateListener()
      .subscribe((userData: { users: User[]; usersCount: number }) => {
        this.users = userData.users;
        console.log(this.users);
        this.totalUsers = userData.usersCount;
        this.numUsers = userData.usersCount;
        this.dataSource = new MatTableDataSource<User>(this.users);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      });

    this.isLoadingSubscription = this.userService
      .getIsLoadingListener()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    this.errorSubscription = this.userService
      .getErrorListener()
      .subscribe((errorMsg) => {
        this.errorMsg = errorMsg.message;
      });
      
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onViewUserDialog(user): void {
    console.log(user);
    const dialogRef = this.dialog.open(UserViewComponent, {
      autoFocus: false,
      width: '30%',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        // this.userService.sendMessage(result.service.id, result.message);
      }
    });
  }

  onPageChanged(pageData: PageEvent) {
    this.page = pageData.pageIndex + 1;
    this.limit = pageData.pageSize;
    this.userService.getUsers(this.page, this.limit);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.userSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
