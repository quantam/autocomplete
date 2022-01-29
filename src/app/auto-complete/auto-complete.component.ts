import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'autocomplete-input',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
})
export class AutoCompleteComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  apiResponse: any = [];
  isLoading = false;

  constructor(private httpClient: HttpClient, searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.isLoading = true;
        this.searchGetCall(text).subscribe(
          (res) => {
            this.isLoading = false;
            this.apiResponse = res;
          },
          (err) => {
            this.isLoading = false;
          }
        );
      });
  }

  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.httpClient.get(`https://restcountries.com/v2/name/${term}`);
  }
}
