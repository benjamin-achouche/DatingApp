import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersItemComponent } from './member-detail.component';

describe('MembersItemComponent', () => {
  let component: MembersItemComponent;
  let fixture: ComponentFixture<MembersItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
