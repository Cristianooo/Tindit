import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptUnregisteredUserComponent } from './prompt-unregistered-user.component';

describe('PromptUnregisteredUserComponent', () => {
  let component: PromptUnregisteredUserComponent;
  let fixture: ComponentFixture<PromptUnregisteredUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptUnregisteredUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptUnregisteredUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
