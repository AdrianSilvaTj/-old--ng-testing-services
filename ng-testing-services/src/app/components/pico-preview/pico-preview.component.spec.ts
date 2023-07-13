import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicoPreviewComponent } from './pico-preview.component';

describe('PicoPreviewComponent', () => {
  let component: PicoPreviewComponent;
  let fixture: ComponentFixture<PicoPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PicoPreviewComponent]
    });
    fixture = TestBed.createComponent(PicoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
