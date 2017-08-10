import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TreeviewModule } from '../lib';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { I18n } from './i18n';
import { DisabledOnSelectorDirective } from './disabled-on-selector.directive';

import { HttpModule  } from '@angular/http';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        TreeviewModule.forRoot(),
    ],
    declarations: [
        
        TestComponent,
        AppComponent,
        DisabledOnSelectorDirective
    ],
    providers: [
        I18n,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
