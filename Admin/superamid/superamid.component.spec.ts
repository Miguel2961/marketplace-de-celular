import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperamidComponent } from './superamid.component';

describe('SuperamidComponent', () => {
  let component: SuperamidComponent;
  let fixture: ComponentFixture<SuperamidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperamidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperamidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
