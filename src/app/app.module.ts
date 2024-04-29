import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";

import { AppComponent } from "./app.component";
import { StreamChatModule, textareaInjectionToken } from "stream-chat-angular";
import { TextareaComponent } from "./textarea/textarea.component";

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    TranslateModule.forRoot(),
    StreamChatModule,AppComponent, TextareaComponent
    // Make sure you remove any import to StreamAutocompleteTextareaModule or StreamTextareaModule
  ],
  providers: [
    {
      provide: textareaInjectionToken,
      useValue: TextareaComponent,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
