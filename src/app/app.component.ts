import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserModel } from 'src/models/userModel';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["fname", "lname", "email", "username", "update", "delete"];
  usersList!: UserModel[];
  usermodel: UserModel;
  isClickUpdate: boolean = false;

  constructor(private http: HttpClient) {
    this.usermodel = this.initilizeUserModel();
  }
  ngAfterViewInit(): void {
    this.getUsersList();
  }

  ngOnInit(): void {
  }

  getUsersList() {
    this.http.get<UserModel[]>("https://localhost:7232/api/User/getAll").subscribe(result => {
      this.usersList = result;
    });
  }

  save() {
    let userModel: UserModel = this.usermodel;
    if (!this.isClickUpdate)
      this.http.post<boolean>("https://localhost:7232/api/User", userModel).subscribe(res => {
        this.alert(res, "Added");
        this.initialAfterSave();
      });
    else {
      this.http.put<boolean>("https://localhost:7232/api/User", userModel).subscribe(res => {
        this.alert(res, "Updated");
        this.initialAfterSave();
      });
      this.isClickUpdate = false;
    }
  }

  updateUser(user: UserModel) {
    this.isClickUpdate = true;
    this.usermodel = user;
  }

  deleteUser(id: number) {
    this.http.delete<boolean>("https://localhost:7232/api/User/" + id).subscribe(res => {
      this.alert(res, "Deleted");
      this.getUsersList();
    });
  }

  initilizeUserModel() {
    return { id: 0, firstName: "", lastName: "", email: "", userName: "", password: "" };
  }

  alert(res: boolean, message: string) {
    res ? alert(`${message} successfully`) : alert(`${message} failed`);
  }
  
  initialAfterSave() {
    this.usermodel = this.initilizeUserModel();
    this.getUsersList();
  }
}
