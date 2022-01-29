import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { AutoCompleteComponent } from './auto-complete.component';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AutoCompleteComponent', () => {
  let component: AutoCompleteComponent;
  let fixture: ComponentFixture<AutoCompleteComponent>;
  let http: any;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AutoCompleteComponent],
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClientTestingModule);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call http with search params', () => {
    httpClientSpy.get.and.returnValue([{ name: 'India' }]);
    component.searchGetCall('ind');
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith(
      'https://restcountries.com/v2/name/ind'
    );
  });

  it('should search for location on init', fakeAsync(() => {
    const spy = httpClientSpy.get.and.returnValue([{ name: 'India' }]);

    fixture.detectChanges();

    const rendered: DebugElement = fixture.debugElement.query(
      By.css('#searchInput')
    );

    rendered.nativeElement.value = 'ind';
    rendered.nativeElement.dispatchEvent(new Event('input'));

    tick(500);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('https://restcountries.com/v2/name/ind');
  }));
});
